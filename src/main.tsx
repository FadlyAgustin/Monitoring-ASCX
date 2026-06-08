import ReactDOM from 'react-dom/client'
import App from './App'
import { AuthProvider } from './pages/auth/AuthProvider'
import { BrowserRouter } from 'react-router-dom'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <AuthProvider>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </AuthProvider>
)