import path from 'path'
import fs from 'fs'
import express, { Request, Response, NextFunction } from 'express'

type ApiHandler = (req: Request, res: Response, next?: NextFunction) => void
type HttpMethod = 'post' | 'get' | 'put' | 'delete'

type Handlers = {
  [method in HttpMethod]?: ApiHandler
} & {
  middlewares: ApiHandler[]
}

interface ApiTree {
  handlers: Handlers
  children: {
    [key: string]: ApiTree
  }
}

const METHODS: HttpMethod[] = ['post', 'get', 'put', 'delete']

export function initExpress(defaultPath: string = '/api') {
  const apiTree = createApiTree()
  setTreeFromFolder(path.join(process.cwd(), 'api'), apiTree)

  const app = express()
  setRouterFromTree(apiTree, app)
  return app
}

function setTreeFromFolder(folderPath: string, branch: ApiTree) {
  fs.readdirSync(folderPath).forEach(item => {
    const itemPath = path.join(folderPath, item)
    const itemStat = fs.statSync(itemPath)

    if (itemStat.isDirectory()) {
      addDirectoryToTree(item, itemPath, branch)
    } else if (itemStat.isFile()) {
      addFileToTree(item, itemPath, branch)
    }
  })
}

function addDirectoryToTree(name: string, path: string, branch: ApiTree) {
  branch.children[name] = createApiTree()
  setTreeFromFolder(path, branch.children[name])
}

function addFileToTree(name: string, path: string, branch: ApiTree) {
  const handler = require(path).default as ApiHandler
  const method = name.split('.')[0]

  if (method.startsWith('_')) return

  if (isHttpMethod(method)) {
    branch.handlers[method] = handler
  } else {
    addMiddleware(method, handler, branch)
  }
}

function addMiddleware(name: string, middleware: ApiHandler, branch: ApiTree) {
  const middlewareId = branch.handlers.middlewares.length
  const [id, ...nameParts] = name.slice(1).split('-')
  name = nameParts.join('-')
  const desiredId = !isNaN(Number(id)) ? Number(id) : middlewareId

  if (branch.handlers.middlewares[desiredId]) {
    throw new Error(`Middleware with id ${desiredId} already exists`)
  }

  branch.handlers.middlewares[desiredId] = middleware
}

function isHttpMethod(method: string): method is HttpMethod {
  return METHODS.includes(method as HttpMethod)
}

function setRouterFromTree(tree: ApiTree, router: express.Router, path = '') {
  const { handlers, children } = tree

  METHODS.forEach(method => {
    if (handlers[method] !== undefined) {
      router[method](path, ...handlers.middlewares, handlers[method]!)
    }
  })

  if (handlers.middlewares.length > 0) {
    router.use(path, ...handlers.middlewares)
  }

  Object.entries(children).forEach(([child, childTree]) => {
    const childPath =
      child.startsWith('[') && child.endsWith(']')
        ? `${path}/:${child.slice(1, -1)}`
        : `${path}/${child}`
    setRouterFromTree(childTree, router, childPath)
  })
}

function createApiTree(): ApiTree {
  return {
    handlers: {
      middlewares: [],
    },
    children: {},
  }
}
