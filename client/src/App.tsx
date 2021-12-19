import { Container, Fade } from '@mui/material';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './components/Home/Home';
import backgrounds from './assets/code';
import { useState } from 'react';

function App() {
    const [randomIndex] = useState(Math.floor(Math.random() * backgrounds.length));

    return (
        <Fade in>
            <div
                style={{
                    width: '100%',
                    height: '3000vh',
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
                        </Routes>
                    </Container>
                </BrowserRouter>
            </div>
        </Fade>
    );
}

export default App;
