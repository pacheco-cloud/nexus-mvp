import { createApp } from 'vue'
import { createPinia } from 'pinia' // 1. Importar o Pinia
import App from './App.vue'

const pinia = createPinia() // 2. Criar uma instância do Pinia
const app = createApp(App)

app.use(pinia) // 3. Dizer ao Vue para usar a instância do Pinia
app.mount('#app')
