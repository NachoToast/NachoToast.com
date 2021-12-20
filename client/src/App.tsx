import { Container } from '@mui/material';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './components/Home/Home';
import { randomBackground } from './assets/images/backgrounds';

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
                        <Route
                            path="/"
                            element={<Home tileList="mainTiles" newTitle="NachoToast.com" />}
                        />
                        <Route
                            path="/resources"
                            element={<Home tileList={'resourcesTiles'} newTitle="Resources" />}
                        />
                    </Routes>
                </Container>
            </BrowserRouter>
        </div>
    );
}

export default App;
