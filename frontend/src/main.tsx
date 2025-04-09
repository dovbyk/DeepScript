import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import LoadingScreen from "@/components/LoadingScreen";


const root = document.getElementById("root")!;
const temp = document.createElement("div");
root.appendChild(temp);

ReactDOM.createRoot(temp).render(<LoadingScreen />);

setTimeout(() => {
  ReactDOM.createRoot(root).render(<App />);
}, 1200); // Delay for effect — adjust as needed
