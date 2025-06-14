import '@mantine/core/styles.css';

import { MantineProvider, createTheme } from '@mantine/core';
import { BuildSentencePage } from './pages/build-sentence-page/build-sentence-page';
import { ConstructTaskPage } from './pages/construct-task-page/construct-task-page';

import { BrowserRouter, Routes, Route } from 'react-router';

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
    <MantineProvider theme={theme} defaultColorScheme='light'>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<ConstructTaskPage />} />
          <Route path='/build-sentence' element={<BuildSentencePage />} />
        </Routes>
      </BrowserRouter>
    </MantineProvider>
  )
}

export default App
