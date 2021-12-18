import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import {
    createTheme,
    CssBaseline,
    darkScrollbar,
    responsiveFontSizes,
    ThemeProvider,
} from '@mui/material';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

let theme = createTheme({
    palette: {
        mode: 'dark',
    },
    components: {
        MuiCssBaseline: {
            styleOverrides: {
                body: darkScrollbar(),
            },
        },
    },
});

theme = responsiveFontSizes(theme, { factor: 4 });

ReactDOM.render(
    <React.StrictMode>
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <App />
        </ThemeProvider>
    </React.StrictMode>,
    document.getElementById('root'),
);
