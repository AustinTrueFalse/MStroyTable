import type { MainTableItem, TableItemId } from './types/MainTable'

export class TreeStore<T extends MainTableItem> {
  private items: T[]

  constructor(initialItems: T[]) {
    this.items = [...initialItems]
  }

  getAll(): T[] {
    return [...this.items]
  }

  getItemById(id: TableItemId): T | null {
    return this.items.find((item) => item.id === id) || null
  }

  getAllChildren(id: TableItemId): T[] {
    const parent = this.getItemById(id)
    const allChildren: T[] = []

    if (parent) {
      const childrens: T[] = this.items.filter((item) => item.parent === parent.id)

      allChildren.push(...childrens)

      for (const child of childrens) {
        allChildren.push(...this.getAllChildren(child.id))
      }
    }

    return allChildren
  }

  getAllParents(id: TableItemId): T[] {
    const children = this.getItemById(id)

    const allParents: T[] = []

    if (children && children.parent !== null) {
      const parent = this.getItemById(children.parent)

      if (parent) {
        allParents.push(parent, ...this.getAllParents(parent.id))
      }
    }

    return allParents
  }

  addItem(item: T): void {
    this.items.push(item)
  }

  removeItem(id: TableItemId): void {
    const childrens = this.getAllChildren(id)
    const idsToDelete = [id]

    for (const child of childrens) {
      idsToDelete.push(child.id)
    }
    this.items = this.items.filter((item) => !idsToDelete.includes(item.id))
  }

  updateItem(item: T) {
    const index = this.items.findIndex((i) => i.id === item.id)
    if (index !== -1) {
      this.items[index] = item
    }
  }
}
