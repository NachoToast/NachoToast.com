import { Container } from '@mui/material';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './components/Home/Home';
import { randomBackground } from './assets/backgrounds';
import Resources from './components/Resources/Resources';

function App() {
    return (
        <div
            style={{
                width: '100%',
                backgroundImage: `url(${randomBackground()})`,
                backgroundColor: '#121212',
                backgroundRepeat: 'repeat-y',
                backgroundSize: '100%, auto',
            }}
        >
            <BrowserRouter>
                <Container maxWidth="xl">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/resources" element={<Resources />} />
                    </Routes>
                </Container>
            </BrowserRouter>
        </div>
    );
}

export default App;
