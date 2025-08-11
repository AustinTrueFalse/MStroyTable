import type { MainTableItem, TableItemId } from '@/types/MainTable'
import { describe, it, expect, beforeEach } from 'vitest'

import { TreeStore } from '../utils'

interface TestMainTableItem extends MainTableItem {
  id: TableItemId
  parent: TableItemId | null
  label: string
}

const initialItems: TestMainTableItem[] = [
  { id: 1, parent: null, label: 'Root' },
  { id: 'aaa', parent: 1, label: 'Child 1' },
  { id: 3, parent: 1, label: 'Child 2' },
  { id: 4, parent: 'aaa', label: 'Grandchild 1' },
]

describe('TreeStore with mixed id types', () => {
  let store: TreeStore<TestMainTableItem>

  beforeEach(() => {
    store = new TreeStore<TestMainTableItem>(initialItems)
  })

  it('getAll возвращает все элементы', () => {
    expect(store.getAll()).toHaveLength(4)
  })

  it('getItemById возвращает элемент по числовому id', () => {
    expect(store.getItemById(3)?.label).toBe('Child 2')
  })

  it('getItemById возвращает элемент по строковому id', () => {
    expect(store.getItemById('aaa')?.label).toBe('Child 1')
  })

  it('getItemById возвращает null для несуществующего id', () => {
    expect(store.getItemById('not-exist')).toBeNull()
  })

  it('getAllChildren возвращает всех детей по числовому id', () => {
    const childrenOf1 = store.getAllChildren(1).map((i) => i.id)
    expect(childrenOf1).toEqual(expect.arrayContaining(['aaa', 3, 4]))
  })

  it('getAllChildren возвращает всех детей по строковому id', () => {
    const childrenOfAaa = store.getAllChildren('aaa').map((i) => i.id)
    expect(childrenOfAaa).toEqual([4])
  })

  it('getAllChildren возвращает пустой массив, если детей нет', () => {
    expect(store.getAllChildren(4)).toHaveLength(0)
  })

  it('getAllParents возвращает всех родителей по числовому id', () => {
    const parentsOf3 = store.getAllParents(3).map((i) => i.id)
    expect(parentsOf3).toEqual([1])
  })

  it('getAllParents возвращает всех родителей по строковому id', () => {
    const parentsOf4 = store.getAllParents(4).map((i) => i.id)
    expect(parentsOf4).toEqual(expect.arrayContaining(['aaa', 1]))
  })

  it('getAllParents возвращает пустой массив для элемента без parent', () => {
    expect(store.getAllParents(1)).toHaveLength(0)
  })

  it('addItem добавляет новый элемент с любым id типа string или number', () => {
    store.addItem({ id: 'bbb', parent: 3, label: 'Child 3' })
    expect(store.getAll()).toHaveLength(5)
    expect(store.getItemById('bbb')?.label).toBe('Child 3')

    store.addItem({ id: 5, parent: 'bbb', label: 'Grandchild 2' })
    expect(store.getAll()).toHaveLength(6)
    expect(store.getItemById(5)?.label).toBe('Grandchild 2')
  })

  it('removeItem удаляет элемент и всех его детей по строковому id', () => {
    store.removeItem('aaa')
    expect(store.getItemById('aaa')).toBeNull()
    expect(store.getItemById(4)).toBeNull()
    expect(store.getAll()).toHaveLength(2)
  })

  it('removeItem удаляет элемент и всех его детей по числовому id', () => {
    store.removeItem(1)
    expect(store.getItemById(1)).toBeNull()
    expect(store.getItemById('aaa')).toBeNull()
    expect(store.getItemById(3)).toBeNull()
    expect(store.getItemById(4)).toBeNull()
    expect(store.getAll()).toHaveLength(0)
  })

  it('updateItem обновляет существующий элемент с числовым id', () => {
    store.updateItem({ id: 3, parent: 1, label: 'Child 2 updated' })
    expect(store.getItemById(3)?.label).toBe('Child 2 updated')
  })

  it('updateItem обновляет существующий элемент со строковым id', () => {
    store.updateItem({ id: 'aaa', parent: 1, label: 'Child 1 updated' })
    expect(store.getItemById('aaa')?.label).toBe('Child 1 updated')
  })

  it('updateItem не добавляет новый элемент, если его нет', () => {
    store.updateItem({ id: 'not-exist', parent: null, label: 'Non existent' })
    expect(store.getItemById('not-exist')).toBeNull()
  })
})
