import { Container } from '@mui/material';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './components/Home/Home';
import { backgroundMap, BackgroundMapKeys, randomBackground } from './assets/images/backgrounds';
import './App.css';

import NotFound from './components/NotFound/NotFound';
import Title from './components/Title/Title';
import Resources from './components/Resources/Resources';
import Block from './components/Resources/CompSci110/Tools/Block/Block';
import Caesar from './components/Resources/CompSci110/Tools/Caesar/Caesar';
import { useSelector } from 'react-redux';
import { getBackgroundOverride, getHideTitle } from './redux/slices/main.slice';
import Float from './components/Resources/CompSci110/Tools/Float/Float';
import Util from './components/Resources/CompSci110/Tools/Util/Util';
import Changelog from './components/Changes/Changelog';
import Colour from './components/Resources/Colour/Colour';
import Minecraft from './components/Minecraft/Minecraft';
import Dijkstra from './components/Resources/Dijkstra/Dijkstra';

function App() {
    const showTitle = !useSelector(getHideTitle);
    const backgroundOverride = useSelector(getBackgroundOverride);

    return (
        <div
            style={{
                backgroundImage: `url(${
                    backgroundOverride !== null
                        ? backgroundMap[backgroundOverride as BackgroundMapKeys]()
                        : randomBackground()
                })`,
            }}
            className="background"
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
                                <Route path="float" element={<Float />} />
                                <Route path="util" element={<Util />} />
                                <Route path="utilization" element={<Util />} />
                            </Route>
                            <Route path="colours" element={<Colour />} />
                            <Route path="colour" element={<Colour />} />
                            <Route path="colors" element={<Colour />} />
                            <Route path="color" element={<Colour />} />
                            <Route path="dijkstra" element={<Dijkstra />} />
                        </Route>
                        <Route path="block" element={<Block />} />
                        <Route path="caesar" element={<Caesar />} />
                        <Route path="float" element={<Float />} />
                        <Route path="util" element={<Util />} />
                        <Route path="utilization" element={<Util />} />
                        <Route path="colours" element={<Colour />} />
                        <Route path="colour" element={<Colour />} />
                        <Route path="colors" element={<Colour />} />
                        <Route path="color" element={<Colour />} />
                        <Route path="dijkstra" element={<Dijkstra />} />
                        <Route path="110">
                            <Route path="block" element={<Block />} />
                            <Route path="caesar" element={<Caesar />} />
                            <Route path="float" element={<Float />} />
                            <Route path="util" element={<Util />} />
                            <Route path="utilization" element={<Util />} />
                        </Route>
                        <Route path="minecraft" element={<Minecraft />} />
                        <Route path="mc" element={<Minecraft />} />
                        <Route path="changelog" element={<Changelog />} />
                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </Container>
            </BrowserRouter>
        </div>
    );
}

export default App;
