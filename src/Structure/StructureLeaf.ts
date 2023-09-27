import path from 'path'
import { Request, Response, NextFunction } from 'express'

type handler = (req: Request, res: Response, next?: NextFunction) => void

export enum LeafType {
  METHOD = 'method',
  MIDDLEWARE = 'middleware',
  SPECIAL = 'special',
}

/**
 * Represents a leaf node in the file system structure.
 */
export class StructureLeaf {
  /** The name of the leaf node. */
  readonly name: string
  /** The path of the leaf node. */
  readonly path: string
  /** The type of the leaf node. */
  private type: LeafType
  /** The handler function for the leaf node. */
  readonly handler: handler

  /**
   * Creates a new instance of the StructureLeaf class.
   * @param name The name of the leaf node.
   * @param parentPath The path of the parent node.
   * @param type The type of the leaf node.
   * @param handler The handler function for the leaf node.
   */
  constructor(
    name: string,
    parentPath: string,
    type: LeafType,
    handler: handler
  ) {
    this.name = name
    this.path = path.join(parentPath, this.name)
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
   * Creates a new StructureLeaf instance with the given name, parent path, handler, and type METHOD.
   * @param name - The name of the leaf.
   * @param parentPath - The parent path of the leaf.
   * @param handler - The handler function for the leaf.
   * @returns A new StructureLeaf instance.
   */
  static createMethodLeaf(
    name: string,
    parentPath: string,
    handler: handler
  ): StructureLeaf {
    return new StructureLeaf(name, parentPath, LeafType.METHOD, handler)
  }

  /**
   * Creates a new StructureLeaf instance with the given name, parent path, handler, and type MIDDLEWARE.
   * @param name - The name of the leaf.
   * @param parentPath - The parent path of the leaf.
   * @param handler - The handler function for the leaf.
   * @returns A new StructureLeaf instance.
   */
  static createMiddlewareLeaf(
    name: string,
    parentPath: string,
    handler: handler
  ): StructureLeaf {
    return new StructureLeaf(name, parentPath, LeafType.MIDDLEWARE, handler)
  }

  /**
   * Creates a new StructureLeaf instance with the given name, parent path, handler, and type SPECIAL.
   * @param name - The name of the leaf.
   * @param parentPath - The parent path of the leaf.
   * @param handler - The handler function for the leaf.
   * @returns A new StructureLeaf instance.
   */
  static createSpecialLeaf(
    name: string,
    parentPath: string,
    handler: handler
  ): StructureLeaf {
    return new StructureLeaf(name, parentPath, LeafType.SPECIAL, handler)
  }
}
