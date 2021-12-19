import { Container, Fade } from '@mui/material';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './components/Home/Home';
import backgrounds from './assets/code';
import { useState } from 'react';
import Resources from './components/Resources/Resources';

function App() {
    const [randomIndex] = useState(Math.floor(Math.random() * backgrounds.length));

    return (
        <div
            style={{
                width: '100%',
                backgroundImage: `url(${backgrounds[randomIndex]})`,
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
