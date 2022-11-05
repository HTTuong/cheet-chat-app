import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import { AuthContextProvider } from './contexts/AuthProvider';
import { AppContextProvider } from './contexts/AppProvider';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <BrowserRouter>
        <AuthContextProvider>
            <AppContextProvider>
                <App />
            </AppContextProvider>
        </AuthContextProvider>
    </BrowserRouter>,
);
