<template>
  <div style="height: 400px">
    <AgGridVue
      :rowData="items"
      :columnDefs="columnDefs"
      :defaultColDef="defaultColDef"
      :treeData="true"
      :getRowId="getRowId"
      :treeDataParentIdField="treeDataParentIdField"
      :groupDefaultExpanded="groupDefaultExpanded"
      :autoGroupColumnDef="autoGroupColumnDef"
      style="height: 100%; width: 100%"
      @grid-ready="onGridReady"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { AgGridVue } from 'ag-grid-vue3'
import type {
  ColDef,
  GetRowIdFunc,
  GridApi,
  GridReadyEvent,
  ValueGetterParams,
} from 'ag-grid-community'
import type { MainTableItem } from '@/types/MainTable'

const items: MainTableItem[] = [
  { id: 1, parent: null, label: 'Айтем 1' },
  { id: '91064cee', parent: 1, label: 'Айтем 2' },
  { id: 3, parent: 1, label: 'Айтем 3' },
  { id: 4, parent: '91064cee', label: 'Айтем 4' },
  { id: 5, parent: '91064cee', label: 'Айтем 5' },
  { id: 6, parent: '91064cee', label: 'Айтем 6' },
  { id: 7, parent: 4, label: 'Айтем 7' },
  { id: 8, parent: 4, label: 'Айтем 8' },
]

function hasChildren(data: MainTableItem): boolean {
  return items.some((item) => item.parent === data.id)
}

const gridApi = ref<GridApi | null>(null)

function onGridReady(params: GridReadyEvent) {
  gridApi.value = params.api
  gridApi.value.sizeColumnsToFit()

  // Вот тут не совсем понятно, как этот столбец передвинуть вправо, в доке не нашел :(

  gridApi.value.moveColumns(['label'], 0)
}
const columnDefs = ref<ColDef[]>([
  {
    headerName: '№ п\\п',
    flex: 1,
    pinned: 'left',
    valueGetter: (params: ValueGetterParams<MainTableItem>) =>
      params.node && typeof params.node.rowIndex === 'number' ? params.node.rowIndex + 1 : '',
    sortable: false,
    filter: false,
    resizable: false,
  },
  // {
  //   headerName: 'Название',
  //   pinned: 'left',
  //   cellRenderer: 'agGroupCellRenderer',

  //   showRowGroup: true,
  //   cellRendererParams: {
  //     suppressCount: true,
  //   },
  //   valueGetter: (params) => {
  //     if (!params.data) return ''
  //     return hasChildren(params.data) ? 'Группа' : 'Элемент'
  //   },
  // },
  {
    headerName: 'Наименование',
    field: 'label',
    pinned: 'left',
    flex: 1,
    cellRendererParams: {
      suppressCount: true,
    },
  },
])

const autoGroupColumnDef = ref<ColDef>({
  headerName: 'Категория',
  cellRendererParams: {
    suppressCount: true,
  },
  valueGetter: (params: ValueGetterParams<MainTableItem>) => {
    if (!params.data) return ''
    return hasChildren(params.data) ? 'Группа' : 'Элемент'
  },
  flex: 1,
  pinned: 'left',
})

const defaultColDef = ref<ColDef>({
  sortable: true,
  filter: true,
  resizable: true,
})

const getRowId = ref<GetRowIdFunc>((params) => params.data.id)
const treeDataParentIdField = ref('parent')
const groupDefaultExpanded = ref(-1)
</script>
