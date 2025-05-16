import { ThemeProvider } from '@gravity-ui/uikit';

import { BrowserRouter, Route, Routes } from 'react-router';
import { AppLayout } from './layout/AppLayout';
import { FillGapsPage } from './pages/FillGapsPage/FillGapsPage';
import { Header } from './components/Header/Header';
import { SelectModelPage } from './pages/SelectModelPage/SelectModelPage';
import { CreateModelPage } from './pages/CreateModelPage/CreateModelPage';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StartPage } from './pages/StartPage/StartPage';
const queryClient = new QueryClient();
const App = () => {
    return (
        <ThemeProvider theme="dark">
            <QueryClientProvider client={queryClient}>
                <Header />
                <AppLayout>
                    <BrowserRouter>
                        <Routes>
                            <Route path="/" index element={<StartPage />} />
                            <Route path="/sentence-generator" index element={<FillGapsPage />} />
                            <Route path="/create-model" element={<CreateModelPage />} />
                            <Route path="/select-model" element={<SelectModelPage />} />
                        </Routes>
                    </BrowserRouter>
                </AppLayout>
            </QueryClientProvider>

        </ThemeProvider>
    );
};

export default App;
