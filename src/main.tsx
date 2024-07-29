import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { ThemeProvider } from '@/components/theme-provider'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from "@/components/ui/toaster"
import store from './store.ts'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <BrowserRouter>
          <main className='bg-[#0a0a0a]'>
            <App />
            <Toaster />
          </main>

        </BrowserRouter>
      </ThemeProvider>
    </Provider>
  </React.StrictMode>,
)
