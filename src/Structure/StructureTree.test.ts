import StructureTree from './StructureTree'
import StructureLeaf, { LeafType, StructureLeafFactory } from './StructureLeaf'
import { describe, beforeEach, it, expect } from 'vitest'

describe('StructureTree', () => {
  let tree: StructureTree

  beforeEach(() => {
    tree = new StructureTree('', '')
  })

  describe('addChild', () => {
    it('should add a child node to the current node', () => {
      const child = StructureLeafFactory.createMethodLeaf('child', () => {})
      tree.addChild(child)
      expect(tree.getLeaf('child')).toBe(child)
    })
  })

  describe('getLeaves', () => {
    it('should return an array of all the leaves of the current node', () => {
      const methodLeaf = StructureLeafFactory.createMethodLeaf(
        'method',
        () => {}
      )
      const middlewareLeaf = StructureLeafFactory.createMiddlewareLeaf(
        'middleware',
        () => {}
      )
      const specialLeaf = StructureLeafFactory.createSpecialLeaf(
        'special',
        () => {}
      )
      tree.addChild(methodLeaf)
      tree.addChild(middlewareLeaf)
      tree.addChild(specialLeaf)
      expect(tree.getLeaves()).toEqual([
        methodLeaf,
        middlewareLeaf,
        specialLeaf,
      ])
    })

    it('should return an array of leaves of the specified type', () => {
      const methodLeaf = StructureLeafFactory.createMethodLeaf(
        'method',
        () => {}
      )
      const middlewareLeaf = StructureLeafFactory.createMiddlewareLeaf(
        'middleware',
        () => {}
      )
      const specialLeaf = StructureLeafFactory.createSpecialLeaf(
        'special',
        () => {}
      )
      tree.addChild(methodLeaf)
      tree.addChild(middlewareLeaf)
      tree.addChild(specialLeaf)
      expect(tree.getLeaves(LeafType.METHOD)).toEqual([methodLeaf])
      expect(tree.getLeaves(LeafType.MIDDLEWARE)).toEqual([middlewareLeaf])
      expect(tree.getLeaves(LeafType.SPECIAL)).toEqual([specialLeaf])
    })
  })

  describe('getLeaf', () => {
    it('should return the leaf node with the specified name', () => {
      const leaf = StructureLeafFactory.createMethodLeaf('leaf', () => {})
      tree.addChild(leaf)
      expect(tree.getLeaf('leaf')).toBe(leaf)
    })

    it('should return undefined if the leaf node is not found', () => {
      expect(tree.getLeaf('nonexistent')).toBeUndefined()
    })
  })

  describe('getSubTrees', () => {
    it('should return an array of all the subtree nodes of the current node', () => {
      const subtree = new StructureTree('subtree', '')
      tree.addChild(subtree)
      expect(tree.getSubTrees()).toEqual([subtree])
    })
  })

  describe('getSubTree', () => {
    it('should return the subtree node with the specified name', () => {
      const subtree = new StructureTree('subtree', '')
      tree.addChild(subtree)
      expect(tree.getSubTree('subtree')).toBe(subtree)
    })

    it('should return undefined if the subtree node is not found', () => {
      expect(tree.getSubTree('nonexistent')).toBeUndefined()
    })
  })

  describe('getMethods', () => {
    it('should return an array of all the method leaves of the current node', () => {
      const methodLeaf = StructureLeafFactory.createMethodLeaf(
        'method',
        () => {}
      )
      const middlewareLeaf = StructureLeafFactory.createMiddlewareLeaf(
        'middleware',
        () => {}
      )
      const specialLeaf = StructureLeafFactory.createSpecialLeaf(
        'special',
        () => {}
      )
      tree.addChild(methodLeaf)
      tree.addChild(middlewareLeaf)
      tree.addChild(specialLeaf)
      expect(tree.getMethods()).toEqual([methodLeaf])
    })
  })

  describe('getMiddlewareLeaves', () => {
    it('should return an array of all the middleware leaves of the current node', () => {
      const methodLeaf = StructureLeafFactory.createMethodLeaf(
        'method',
        () => {}
      )
      const middlewareLeaf = StructureLeafFactory.createMiddlewareLeaf(
        'middleware',
        () => {}
      )
      const specialLeaf = StructureLeafFactory.createSpecialLeaf(
        'special',
        () => {}
      )
      tree.addChild(methodLeaf)
      tree.addChild(middlewareLeaf)
      tree.addChild(specialLeaf)
      expect(tree.getMiddlewareLeaves()).toEqual([middlewareLeaf])
    })
  })

  describe('getSpecialLeaves', () => {
    it('should return an array of all the special leaves of the current node', () => {
      const methodLeaf = StructureLeafFactory.createMethodLeaf(
        'method',
        () => {}
      )
      const middlewareLeaf = StructureLeafFactory.createMiddlewareLeaf(
        'middleware',
        () => {}
      )
      const specialLeaf = StructureLeafFactory.createSpecialLeaf(
        'special',
        () => {}
      )
      tree.addChild(methodLeaf)
      tree.addChild(middlewareLeaf)
      tree.addChild(specialLeaf)
      expect(tree.getSpecialLeaves()).toEqual([specialLeaf])
    })
  })
})
