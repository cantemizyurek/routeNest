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
  try {
    fs.readdirSync(folderPath).forEach(item => {
      const itemPath = path.join(folderPath, item)
      const itemStat = fs.statSync(itemPath)

      if (itemStat.isDirectory()) {
        addDirectoryToTree(item, itemPath, branch)
      } else if (itemStat.isFile()) {
        addFileToTree(item, itemPath, branch)
      }
    })
  } catch (error) {
    console.error(`Error reading directory at ${folderPath}:`, error)
  }
}

function addDirectoryToTree(name: string, dirPath: string, branch: ApiTree) {
  try {
    branch.children[name] = createApiTree()
    setTreeFromFolder(dirPath, branch.children[name])
  } catch (error) {
    console.error(`Error adding directory to tree from ${dirPath}:`, error)
  }
}

function addFileToTree(name: string, filePath: string, branch: ApiTree) {
  try {
    const handler = require(filePath).default as ApiHandler
    const method = name.split('.')[0]

    if (method.startsWith('_')) return

    if (isHttpMethod(method)) {
      branch.handlers[method] = handler
    } else {
      addMiddleware(method, handler, branch)
    }
  } catch (error) {
    console.error(`Error processing file at ${filePath}:`, error)
  }
}

function addMiddleware(name: string, middleware: ApiHandler, branch: ApiTree) {
  try {
    const [id, ...nameParts] = name.split('-')
    name = nameParts.join('-')
    const desiredId = !isNaN(Number(id))
      ? Number(id)
      : branch.handlers.middlewares.length

    if (branch.handlers.middlewares[desiredId]) {
      throw new Error(`Middleware with id ${desiredId} already exists`)
    }

    branch.handlers.middlewares[desiredId] = middleware
  } catch (error) {
    console.error(`Error adding middleware to tree:`, error)
  }
}

function isHttpMethod(method: string): method is HttpMethod {
  return METHODS.includes(method as HttpMethod)
}

function setRouterFromTree(tree: ApiTree, router: express.Router, path = '') {
  const { handlers, children } = tree

  METHODS.forEach(method => {
    if (handlers[method] !== undefined) {
      router[method](
        path,
        ...handlers.middlewares.filter(m => m !== undefined),
        handlers[method]!
      )
    }
  })

  if (handlers.middlewares.length > 0) {
    router.use(path, ...handlers.middlewares.filter(m => m !== undefined))
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
