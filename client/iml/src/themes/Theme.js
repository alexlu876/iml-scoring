import React from 'react';

import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import Checkbox from '@material-ui/core/Checkbox';
import red from '@material-ui/core/colors/red';
import green from '@material-ui/core/colors/green';

const outerTheme = createMuiTheme({
  palette: {
      primary: green,
      secondary:red,
  },
});

function ThemeNestingExtend() {
  return (
    <ThemeProvider theme={outerTheme}>
      <Checkbox defaultChecked />
      <ThemeProvider
        theme={theme =>
          createMuiTheme({
            ...theme,
            palette: {
              ...theme.palette,
              primary: {
                main: green[500],
              },
            },
          })
        }
      >
        <Checkbox defaultChecked color="primary" />
        <Checkbox defaultChecked color="secondary" />
      </ThemeProvider>
    </ThemeProvider>
  );
}

export default ThemeNestingExtend;

