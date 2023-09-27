import { Request, Response, NextFunction } from 'express'
import StructureTree from './StructureTree'

type ErrorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => void
type NormalHandler = (req: Request, res: Response, next?: NextFunction) => void

type Handler = ErrorHandler | NormalHandler

export enum LeafType {
  METHOD = 'method',
  MIDDLEWARE = 'middleware',
  SPECIAL = 'special',
}

/**
 * Represents a leaf node in a structure.
 */
export default class StructureLeaf {
  readonly name: string
  private type: LeafType
  readonly handler: Handler

  /**
   * Creates a new instance of StructureLeaf.
   * @param name - The name of the leaf node.
   * @param type - The type of the leaf node.
   * @param handler - The handler for the leaf node.
   */
  constructor(name: string, type: LeafType, handler: Handler) {
    this.name = name
    this.type = type
    this.handler = handler
  }

  /**
   * Gets the type of the leaf node.
   * @returns The type of the leaf node.
   */
  getType() {
    return this.type
  }
}

/**
 * Factory class for creating instances of StructureLeaf.
 */
export class StructureLeafFactory {
  /**
   * Creates a new StructureLeaf instance with the given name, handler and type set to METHOD.
   * @param name - The name of the leaf.
   * @param handler - The handler function for the leaf.
   * @returns A new instance of StructureLeaf.
   */
  static createMethodLeaf(name: string, handler: NormalHandler): StructureLeaf {
    return new StructureLeaf(name, LeafType.METHOD, handler)
  }

  /**
   * Creates a new StructureLeaf instance with the given name, handler and type set to MIDDLEWARE.
   * @param name - The name of the leaf.
   * @param handler - The handler function for the leaf.
   * @returns A new instance of StructureLeaf.
   */
  static createMiddlewareLeaf(name: string, handler: Handler): StructureLeaf {
    return new StructureLeaf(name, LeafType.MIDDLEWARE, handler)
  }

  /**
   * Creates a new StructureLeaf instance with the given name, handler and type set to SPECIAL.
   * @param name - The name of the leaf.
   * @param handler - The handler function for the leaf.
   * @returns A new instance of StructureLeaf.
   */
  static createSpecialLeaf(name: string, handler: Handler): StructureLeaf {
    return new StructureLeaf(name, LeafType.SPECIAL, handler)
  }
}

/**
 * Factory class for creating method leaves.
 */
export class StructureMethodLeafFactory {
  leaf: StructureLeaf

  /**
   * Creates a new instance of StructureMethodLeafFactory.
   * @param name - The name of the method leaf.
   * @param handler - The handler function for the method leaf.
   * @throws Error if an invalid method leaf name is provided.
   */
  constructor(name: string, handler: NormalHandler) {
    if (name === 'get') {
      this.leaf = StructureMethodLeafFactory.createGetLeaf(handler)
    } else if (name === 'post') {
      this.leaf = StructureMethodLeafFactory.createPostLeaf(handler)
    } else if (name === 'put') {
      this.leaf = StructureMethodLeafFactory.createPutLeaf(handler)
    } else if (name === 'delete') {
      this.leaf = StructureMethodLeafFactory.createDeleteLeaf(handler)
    } else {
      throw new Error(`Invalid method leaf name: ${name}`)
    }
  }

  /**
   * Creates a new instance of StructureLeaf for the GET method.
   * @param handler - The handler function for the GET method.
   * @returns A new instance of StructureLeaf for the GET method.
   */
  static createGetLeaf(handler: NormalHandler): StructureLeaf {
    return StructureLeafFactory.createMethodLeaf('get', handler)
  }

  /**
   * Creates a new instance of StructureLeaf for the POST method.
   * @param handler - The handler function for the POST method.
   * @returns A new instance of StructureLeaf for the POST method.
   */
  static createPostLeaf(handler: NormalHandler): StructureLeaf {
    return StructureLeafFactory.createMethodLeaf('post', handler)
  }

  /**
   * Creates a new instance of StructureLeaf for the PUT method.
   * @param handler - The handler function for the PUT method.
   * @returns A new instance of StructureLeaf for the PUT method.
   */
  static createPutLeaf(handler: NormalHandler): StructureLeaf {
    return StructureLeafFactory.createMethodLeaf('put', handler)
  }

  /**
   * Creates a new instance of StructureLeaf for the DELETE method.
   * @param handler - The handler function for the DELETE method.
   * @returns A new instance of StructureLeaf for the DELETE method.
   */
  static createDeleteLeaf(handler: NormalHandler): StructureLeaf {
    return StructureLeafFactory.createMethodLeaf('delete', handler)
  }

  /**
   * The list of valid method leaf names.
   */
  static METHOD_LEAF_NAMES = ['get', 'post', 'put', 'delete']
}

/**
 * Factory class for creating special StructureLeaf instances.
 */
export class StructureSpecialLeafFactory {
  leaf: StructureLeaf

  /**
   * Creates a new instance of StructureSpecialLeafFactory.
   * @param name - The name of the special leaf to create.
   * @param handler - The handler function for the special leaf.
   * @throws Error if an invalid special leaf name is provided.
   */
  constructor(name: string, handler: Handler) {
    if (name === StructureTree.ERROR) {
      this.leaf = StructureSpecialLeafFactory.createErrorLeaf(
        handler as ErrorHandler
      )
    } else if (name === StructureTree.NOT_FOUND) {
      this.leaf = StructureSpecialLeafFactory.createNotFoundLeaf(
        handler as NormalHandler
      )
    } else {
      throw new Error(`Invalid special leaf name: ${name}`)
    }
  }

  /**
   * Creates a special StructureLeaf instance for handling 404 errors.
   * @param handler - The handler function for the 404 error.
   * @returns A new StructureLeaf instance for handling 404 errors.
   */
  static createNotFoundLeaf(handler: NormalHandler): StructureLeaf {
    function notFoundHandler(req: Request, res: Response) {
      res.status(404)
      handler(req, res)
    }

    return StructureLeafFactory.createSpecialLeaf(
      StructureTree.NOT_FOUND,
      notFoundHandler
    )
  }

  /**
   * Creates a special StructureLeaf instance for handling errors.
   * @param handler - The handler function for the error.
   * @returns A new StructureLeaf instance for handling errors.
   */
  static createErrorLeaf(handler: ErrorHandler): StructureLeaf {
    function errorHandler(
      err: Error,
      req: Request,
      res: Response,
      next: NextFunction
    ) {
      res.status(500)
      handler(err, req, res, next)
    }

    return StructureLeafFactory.createSpecialLeaf(
      StructureTree.ERROR,
      errorHandler
    )
  }

  /**
   * An array of valid special leaf names.
   */
  static SPECIAL_LEAF_NAMES = ['404', 'error']
}
