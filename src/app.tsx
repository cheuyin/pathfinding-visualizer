import '@mantine/core/styles.css';
import { Grid } from './components/grid';
import './app.css';
import { createTheme, MantineProvider } from '@mantine/core';

const theme = createTheme({});

export const App = () => {
  return (
    <MantineProvider theme={theme}>
      <Grid />
    </MantineProvider>
  );
};
