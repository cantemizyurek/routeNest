import { describe, it, expect, vi, afterEach } from 'vitest'
import fs from 'fs'
import StructureParser from './StructureParser'
import StructureTree from '../Structure/StructureTree'
import StructureLeaf from '../Structure/StructureLeaf'

vi.mock('fs')

describe('StructureParser', () => {
  const readdirSyncMock = vi.spyOn(fs, 'readdirSync')
  const statSyncMock = vi.spyOn(fs, 'statSync')

  afterEach(() => {
    readdirSyncMock.mockClear()
    statSyncMock.mockClear()
  })

  describe('parse', () => {
    it('should correctly parse a given directory structure', async () => {
      readdirSyncMock
        .mockReturnValueOnce(['name', '404.ts', 'get.ts'] as any[])
        .mockReturnValueOnce(['get.ts'] as any[]) // mock for the `name` directory

      statSyncMock
        // @ts-ignore
        .mockReturnValueOnce({ isDirectory: () => true }) // 'name' is a directory
        // @ts-ignore
        .mockReturnValueOnce({ isDirectory: () => false }) // '404.ts' is a file
        // @ts-ignore
        .mockReturnValueOnce({ isDirectory: () => false }) // 'get.ts' is a file
        // @ts-ignore
        .mockReturnValueOnce({ isDirectory: () => false }) // '/name/get.ts' is a file

      // Mocking the require function to return handlers
      const mockRequire = (path: string) => {
        switch (path) {
          case '/path/to/api/404.ts':
          case '/path/to/api/get.ts':
          case '/path/to/api/name/get.ts':
            return { default: vi.fn() }
          default:
            throw new Error(`Unexpected require path: ${path}`)
        }
      }

      const parser = new StructureParser('/path/to/api', {
        customRequire: mockRequire,
      })
      parser.parse()

      const tree = parser.tree

      expect(tree).toBeInstanceOf(StructureTree)
      expect(tree.name).toEqual('')
      expect(tree.path).toEqual('/')

      const notFoundLeaf = tree.getLeaf('404')
      expect(notFoundLeaf).toBeInstanceOf(StructureLeaf)
      expect(notFoundLeaf!.name).toEqual('404')

      const getLeaf = tree.getLeaf('get')
      expect(getLeaf).toBeInstanceOf(StructureLeaf)
      expect(getLeaf!.name).toEqual('get')

      const nameSubTree = tree.getSubTree('name')
      expect(nameSubTree).toBeInstanceOf(StructureTree)
      expect(nameSubTree!.name).toEqual('name')
      expect(nameSubTree!.path).toEqual('/name')

      const getSubLeaf = nameSubTree!.getLeaf('get')
      expect(getSubLeaf).toBeInstanceOf(StructureLeaf)
      expect(getSubLeaf!.name).toEqual('get')
    })
  })
})
