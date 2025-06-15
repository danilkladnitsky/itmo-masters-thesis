import '@mantine/core/styles.css';

import { MantineProvider, createTheme } from '@mantine/core';
import { BuildSentencePage } from './pages/build-sentence-page/build-sentence-page';
import { ConstructTaskPage } from './pages/construct-task-page/construct-task-page';

import { BrowserRouter, Routes, Route } from 'react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AppProvider } from './context/app-context';
import { SnackbarProvider } from 'notistack';

const queryClient = new QueryClient()
const theme = createTheme({
  primaryColor: 'blue',

  defaultRadius: 'md',
  components: {
    Button: {
      defaultProps: {
        color: 'blue',
      },
    },
  },
});

function App() {
  return (

    <SnackbarProvider >
      <MantineProvider theme={theme} defaultColorScheme='light'>
        <QueryClientProvider client={queryClient}>
          <AppProvider>
            <BrowserRouter>
              <Routes>
                <Route path='/' element={<ConstructTaskPage />} />
                <Route path='/build-sentence' element={<BuildSentencePage />} />
              </Routes>
            </BrowserRouter>
          </AppProvider>
        </QueryClientProvider>
      </MantineProvider>
    </SnackbarProvider>
  )
}

export default App
