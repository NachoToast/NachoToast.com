import { Container } from '@mui/material';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './components/Home/Home';
import { randomBackground } from './assets/images/backgrounds';
import './App.css';

import NotFound from './components/NotFound/NotFound';
import Title from './components/Title/Title';
import Resources from './components/Resources/Resources';
import Block from './components/Resources/CompSci110/Tools/Block/Block';
import Caesar from './components/Resources/CompSci110/Tools/Caesar/Caesar';
import { useSelector } from 'react-redux';
import { getHideTitle } from './redux/slices/main.slice';
import Float from './components/Resources/CompSci110/Tools/Float/Float';
import Head from './components/Head/Head';
import Util from './components/Resources/CompSci110/Tools/Util/Util';
import Changelog from './components/Changes/Changelog';

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
            <Head
                title="NachoToast"
                description="NachoToast's Website Is Cooler Than Yours"
                image="%PUBLIC_URL%/logo512.png"
                url="https://nachotoast.com"
                themeColour="#FFFFFF"
            />
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
                                <Route path="float" element={<Float />} />
                                <Route path="util" element={<Util />} />
                                <Route path="utilization" element={<Util />} />
                            </Route>
                        </Route>
                        <Route path="110">
                            <Route path="block" element={<Block />} />
                            <Route path="caesar" element={<Caesar />} />
                            <Route path="float" element={<Float />} />
                            <Route path="util" element={<Util />} />
                            <Route path="utilization" element={<Util />} />
                        </Route>
                        <Route path="changelog" element={<Changelog />} />
                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </Container>
            </BrowserRouter>
        </div>
    );
}

export default App;
