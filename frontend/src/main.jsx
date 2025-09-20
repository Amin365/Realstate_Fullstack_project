import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import {QueryClient,QueryClientProvider} from '@tanstack/react-query'
import { Toaster } from "@/components/ui/sonner"
import store, { persister } from './lib/Reduxs/store.js'
import { PersistGate } from 'redux-persist/es/integration/react'
import { Provider } from 'react-redux'
import { ThemeProvider } from './components/theme-provider.jsx'


const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
    },
  },
});
createRoot(document.getElementById('root')).render(
  <StrictMode>
  <QueryClientProvider client={queryClient}>
  <Provider store={store}>
   <PersistGate loading={null} persistor={persister}>
     <BrowserRouter>
     <ThemeProvider>
     <App/>

     </ThemeProvider>
  
  <Toaster/>
  </BrowserRouter>
 </PersistGate>
  </Provider>

  </QueryClientProvider>
   </StrictMode>
)
