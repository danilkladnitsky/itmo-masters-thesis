import {ThemeProvider} from '@gravity-ui/uikit';

import {BrowserRouter, Route, Routes} from 'react-router';
import {AppLayout} from './layout/AppLayout';
import {FillGapsPage} from './pages/FillGapsPage/FillGapsPage';
import {Header} from './components/Header/Header';
import {SelectModelPage} from './pages/SelectModelPage/SelectModelPage';

const App = () => {
    return (
        <ThemeProvider theme="dark">
            <Header />
            <AppLayout>
                <BrowserRouter>
                    <Routes>
                        <Route path="/task/:modelId" element={<FillGapsPage />} />
                        <Route path="/select-model" element={<SelectModelPage />} />
                    </Routes>
                </BrowserRouter>
            </AppLayout>
        </ThemeProvider>
    );
};

export default App;
