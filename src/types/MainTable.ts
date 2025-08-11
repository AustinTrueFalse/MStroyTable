export interface MainTableItem {
  id: TableItemId
  parent: TableItemId | null
  label: string
}


export type TableItemId = string | number
