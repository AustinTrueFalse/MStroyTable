import { createApp } from 'vue'
import App from './App.vue'

// AG Grid
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community'

import { TreeDataModule } from "ag-grid-enterprise";

ModuleRegistry.registerModules([AllCommunityModule, TreeDataModule])



// AG Grid Vue
import { AgGridVue } from 'ag-grid-vue3'



const app = createApp(App)
app.component('AgGridVue', AgGridVue)
app.mount('#app')
