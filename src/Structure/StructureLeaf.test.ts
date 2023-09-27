import { describe, it, expect, vi } from 'vitest'
import { StructureLeaf, StructureLeafFactory, LeafType } from './StructureLeaf'

const SLASH = process.platform === 'win32' ? '\\' : '/'

describe('StructureLeaf', () => {
  const parentPath = `${SLASH}api`
  const handler = vi.fn()

  describe('constructor', () => {
    it('should set the name, path, type, and handler properties', () => {
      const name = 'users'
      const type = LeafType.METHOD
      const leaf = new StructureLeaf(name, parentPath, type, handler)

      expect(leaf.name).toBe(name)
      expect(leaf.path).toBe(`${parentPath}${SLASH}${name}`)
      expect(leaf.getType()).toBe(type)
      expect(leaf.handler).toBe(handler)
    })
  })

  describe('getType', () => {
    it('should return the type of the leaf', () => {
      const name = 'auth'
      const type = LeafType.MIDDLEWARE
      const leaf = new StructureLeaf(name, parentPath, type, handler)

      expect(leaf.getType()).toBe(type)
    })
  })
})

describe('StructureLeafFactory', () => {
  const parentPath = `${SLASH}api`
  const handler = vi.fn()

  describe('createMethodLeaf', () => {
    it('should create a new StructureLeaf instance with type METHOD', () => {
      const name = 'users'
      const leaf = StructureLeafFactory.createMethodLeaf(
        name,
        parentPath,
        handler
      )

      expect(leaf.name).toBe(name)
      expect(leaf.path).toBe(`${parentPath}${SLASH}${name}`)
      expect(leaf.getType()).toBe(LeafType.METHOD)
      expect(leaf.handler).toBe(handler)
    })
  })

  describe('createMiddlewareLeaf', () => {
    it('should create a new StructureLeaf instance with type MIDDLEWARE', () => {
      const name = 'auth'
      const leaf = StructureLeafFactory.createMiddlewareLeaf(
        name,
        parentPath,
        handler
      )

      expect(leaf.name).toBe(name)
      expect(leaf.path).toBe(`${parentPath}${SLASH}${name}`)
      expect(leaf.getType()).toBe(LeafType.MIDDLEWARE)
      expect(leaf.handler).toBe(handler)
    })
  })

  describe('createSpecialLeaf', () => {
    it('should create a new StructureLeaf instance with type SPECIAL', () => {
      const name = '404'
      const leaf = StructureLeafFactory.createSpecialLeaf(
        name,
        parentPath,
        handler
      )

      expect(leaf.name).toBe(name)
      expect(leaf.path).toBe(`${parentPath}${SLASH}${name}`)
      expect(leaf.getType()).toBe(LeafType.SPECIAL)
      expect(leaf.handler).toBe(handler)
    })
  })
})
