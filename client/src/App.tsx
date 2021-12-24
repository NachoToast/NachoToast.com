import { Container } from '@mui/material';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './components/Home/Home';
import { randomBackground } from './assets/images/backgrounds';
import NotFound from './components/NotFound/NotFound';
import Title from './components/Title/Title';
import Resources from './components/Resources/Resources';
import Block from './components/Resources/CompSci110/Tools/Block/Block';
import Caesar from './components/Resources/CompSci110/Tools/Caesar/Caesar';
import { useSelector } from 'react-redux';
import { getHideTitle } from './redux/slices/main.slice';

function App() {
    const showTitle = !useSelector(getHideTitle);

    return (
        <div
            style={{
                width: '100%',
                minHeight: '100vh',
                backgroundImage: `url(${randomBackground()})`,
                backgroundColor: '#121212',
                backgroundRepeat: 'repeat-y',
                backgroundSize: '100%, auto',
            }}
        >
            <BrowserRouter>
                {showTitle && <Title />}
                <Container maxWidth="xl">
                    <Routes>
                        <Route
                            index
                            element={<Home tileList="mainTiles" newTitle="NachoToast.com" />}
                        />
                        <Route path="resources">
                            <Route index element={<Resources />} />
                            <Route path="110">
                                <Route path="block" element={<Block />} />
                                <Route path="caesar" element={<Caesar />} />
                            </Route>
                        </Route>
                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </Container>
            </BrowserRouter>
        </div>
    );
}

export default App;
