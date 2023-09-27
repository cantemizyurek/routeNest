import fs from 'fs'
import path from 'path'
import StructureTree from '../Structure/StructureTree'
import StructureLeaf, {
  StructureSpecialLeafFactory,
  StructureMethodLeafFactory,
  StructureLeafFactory,
} from '../Structure/StructureLeaf'

/**
 * A class that represents a parser for a folder structure.
 */
export default class StructureParser {
  readonly tree: StructureTree
  private folderPath: string

  /**
   * Creates a new instance of the StructureParser class.
   * @param folderPath The path of the folder to parse.
   * @param name The name of the folder.
   */
  constructor(folderPath: string, name: string = '') {
    this.tree = new StructureTree(name, '')
    this.folderPath = folderPath
  }

  /**
   * Parses the folder structure.
   */
  parse() {
    const folder = fs.readdirSync(this.folderPath)
    folder.forEach(this.parseChildren.bind(this))
  }

  /**
   * Parses the children of the folder.
   * @param children The children to parse.
   */
  private parseChildren(children: string) {
    const childrenPath = `${this.folderPath}/${children}`
    const stats = fs.statSync(childrenPath)

    if (stats.isDirectory()) {
      this.parseFolder(childrenPath)
    } else {
      this.parseFile(childrenPath)
    }
  }

  /**
   * Parses a folder.
   * @param folderPath The path of the folder to parse.
   */
  private parseFolder(folderPath: string) {
    const parser = new StructureParser(folderPath, this.parseName(folderPath))
    parser.parse()
    this.tree.addChild(parser.tree)
  }

  /**
   * Parses a file.
   * @param filePath The path of the file to parse.
   */
  private parseFile(filePath: string) {
    const handler = require(filePath).default
    const name = this.parseName(filePath)

    this.tree.addChild(this.createLeaf(name, handler))
  }

  /**
   * Creates a leaf node for the structure tree.
   * @param name The name of the leaf node.
   * @param handler The handler for the leaf node.
   * @returns The created leaf node.
   */
  private createLeaf(name: string, handler: any) {
    let leaf: StructureLeaf

    if (this.isMethodFile(name)) {
      leaf = new StructureMethodLeafFactory(name, handler).leaf
    } else if (this.isSpecialFile(name)) {
      leaf = new StructureSpecialLeafFactory(name, handler).leaf
    } else {
      leaf = StructureLeafFactory.createMiddlewareLeaf(name, handler)
    }

    return leaf
  }

  /**
   * Checks if the file is a method file.
   * @param name The name of the file.
   * @returns True if the file is a method file, false otherwise.
   */
  private isMethodFile(name: string) {
    return StructureMethodLeafFactory.METHOD_LEAF_NAMES.includes(name)
  }

  /**
   * Checks if the file is a special file.
   * @param name The name of the file.
   * @returns True if the file is a special file, false otherwise.
   */
  private isSpecialFile(name: string) {
    return StructureSpecialLeafFactory.SPECIAL_LEAF_NAMES.includes(name)
  }

  /**
   * Parses the name of a file or folder.
   * @param filePath The path of the file or folder.
   * @returns The parsed name.
   */
  private parseName(filePath: string) {
    let name = path.relative(this.folderPath, filePath)
    name = path.basename(name, path.extname(name))
    return name
  }
}
