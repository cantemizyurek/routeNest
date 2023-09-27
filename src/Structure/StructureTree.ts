import path from 'path'
import StructureLeaf, { LeafType } from './StructureLeaf'

/**
 * Represents a tree structure that can contain child nodes of type `StructureTree` or `StructureLeaf`.
 */
export default class StructureTree {
  /**
   * The children of the current node.
   */
  private children = new Map<string, StructureTree | StructureLeaf>()

  /**
   * The name of the current node.
   */
  readonly name: string

  /**
   * The path of the current node.
   */
  readonly path: string

  /**
   * Creates a new instance of `StructureTree`.
   * @param name - The name of the current node.
   * @param parentPath - The path of the parent node.
   */
  constructor(name: string, parentPath: string) {
    this.name = this.parseName(name)
    this.path = parentPath + '/' + this.name
  }

  /**
   * Adds a child node to the current node.
   * @param children - The child node to add.
   */
  addChild(children: StructureLeaf | StructureTree) {
    this.children.set(children.name, children)
  }

  /**
   * Gets all the leaves of the current node.
   * @param type - The type of the leaves to get.
   * @returns An array of `StructureLeaf` objects.
   */
  getLeaves(type?: LeafType): StructureLeaf[] {
    return [...this.children.values()].filter(
      child =>
        child instanceof StructureLeaf && (!type || child.getType() === type)
    ) as StructureLeaf[]
  }

  /**
   * Gets a leaf node by name.
   * @param name - The name of the leaf node to get.
   * @returns The `StructureLeaf` object if found, otherwise `undefined`.
   */
  getLeaf(name: string): StructureLeaf | undefined {
    const child = this.children.get(name)
    if (child instanceof StructureLeaf) {
      return child
    }
    return undefined
  }

  /**
   * Returns an array of child subtrees.
   * @returns An array of child subtrees.
   */
  getSubTrees() {
    return [...this.children.values()].filter(
      child => child instanceof StructureTree
    ) as StructureTree[]
  }

  /**
   * Gets a subtree node by name.
   * @param name - The name of the subtree node to get.
   * @returns The `StructureTree` object if found, otherwise `undefined`.
   */
  getSubTree(name: string) {
    const child = this.children.get(name)
    if (child instanceof StructureTree) {
      return child
    }
    return undefined
  }

  /**
   * Gets all the method leaves of the current node.
   * @returns An array of `StructureLeaf` objects.
   */
  getMethods() {
    return this.getLeaves(LeafType.METHOD)
  }

  /**
   * Gets all the middleware leaves of the current node.
   * @returns An array of `StructureLeaf` objects.
   */
  getMiddlewareLeaves() {
    return this.getLeaves(LeafType.MIDDLEWARE)
  }

  /**
   * Gets all the special leaves of the current node.
   * @returns An array of `StructureLeaf` objects.
   */
  getSpecialLeaves() {
    return this.getLeaves(LeafType.SPECIAL)
  }

  /**
   * Parses the name of the current node.
   * @param name - The name of the current node.
   * @returns The parsed name of the current node.
   */
  private parseName(name: string) {
    let newName = name

    if (name.startsWith('[') && name.endsWith(']')) {
      newName = name.slice(1, -1)
    }

    return newName
  }

  /**
   * The `NOT_FOUND` constant.
   */
  static readonly NOT_FOUND = '404'

  /**
   * The `ERROR` constant.
   */
  static readonly ERROR = 'error'

  /**
   * The `ROOT_PATH` constant.
   */
  static ROOT_PATH = '/'
}
