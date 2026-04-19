import './App.css'

import AppRoutes from "./routes/AppRoutes";
import { Toaster } from "react-hot-toast";
import { AssetProvider } from "./contexts/AssetContext";

function App() {
    return (
        <AssetProvider>
            <AppRoutes />
            <Toaster />
        </AssetProvider>
    );
}

export default App;
