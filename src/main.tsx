import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import './App.css'
import App from "@/App.tsx";

const examStartupProgress = (window as Window & {examStartupProgress?: {stop: () => void}}).examStartupProgress;
examStartupProgress?.stop();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App/>
  </StrictMode>,
)
