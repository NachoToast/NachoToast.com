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
import tilesSlice from './redux/slices/tiles.slice';
import { Provider } from 'react-redux';
import mainSlice from './redux/slices/main.slice';
import { HelmetProvider } from 'react-helmet-async';

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
        tiles: tilesSlice,
        main: mainSlice,
    },
});

ReactDOM.render(
    <StrictMode>
        <Provider store={store}>
            <ThemeProvider theme={theme}>
                <HelmetProvider>
                    <CssBaseline />
                    <App />
                </HelmetProvider>
            </ThemeProvider>
        </Provider>
    </StrictMode>,
    document.getElementById('root'),
);
