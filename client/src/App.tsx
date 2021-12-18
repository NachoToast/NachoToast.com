import { Container } from '@mui/material';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './components/Home/Home';

function App() {
    return (
        <BrowserRouter>
            <Container maxWidth="xl">
                <Routes>
                    <Route path="/" element={<Home />} />
                </Routes>
            </Container>
        </BrowserRouter>
    );
}

export default App;
