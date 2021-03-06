import { StrictMode } from 'react';
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
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import mainSlice from './redux/slices/main.slice';

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

const store = configureStore({
    reducer: {
        main: mainSlice,
    },
});

ReactDOM.render(
    <StrictMode>
        <Provider store={store}>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <App />
            </ThemeProvider>
        </Provider>
    </StrictMode>,
    document.getElementById('root'),
);
