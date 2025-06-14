import '@mantine/core/styles.css';

import { MantineProvider, createTheme } from '@mantine/core';
import { BuildSentencePage } from './pages/build-sentence-page/build-sentence-page';

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
      <BuildSentencePage />
    </MantineProvider>
  )
}

export default App
