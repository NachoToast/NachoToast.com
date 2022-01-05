import { Container, Fade } from '@mui/material';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import ResourceList from './ResourceList/ResourceList';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import SchoolIcon from '@mui/icons-material/School';
import LinkIcon from '@mui/icons-material/Link';
import CalculateIcon from '@mui/icons-material/Calculate';
import MemoryIcon from '@mui/icons-material/Memory';
import { interpolateTitle } from '../../redux/slices/main.slice';
import Block from './CompSci110/Tools/Block/Block';
import Caesar from './CompSci110/Tools/Caesar/Caesar';
import Float from './CompSci110/Tools/Float/Float';
import Util from './CompSci110/Tools/Util/Util';
import QuickLinks from './CompSci101/QuickLinks/QuickLinks';
import PastPapers from './CompSci101/PastPapers/PastPapers';
import ArticleIcon from '@mui/icons-material/Article';
import Colour from './Colour/Colour';

const Resources = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(interpolateTitle(`Resources`));
    }, [dispatch]);

    return (
        <Fade in>
            <Container>
                <ResourceList
                    enableGutters
                    resources={[
                        {
                            name: 'CompSci110',
                            titleAppend: '110',
                            description: 'Introduction to Computer Systems',
                            nameIconPrefix: <SchoolIcon sx={{ mr: 1 }} />,
                            unlinkable: true,
                            element: (
                                <ResourceList
                                    resources={[
                                        {
                                            name: 'Float',
                                            titleAppend: 'Float',
                                            description: 'Floating Point Calculator',
                                            nameIconPrefix: <CalculateIcon sx={{ mr: 1 }} />,
                                            navigatesTo: '110/float',
                                            element: <Float inline />,
                                        },
                                        {
                                            name: 'Utilization',
                                            titleAppend: 'Util',
                                            description: 'Processor Utilization Calculator',
                                            nameIconPrefix: <MemoryIcon sx={{ mr: 1 }} />,
                                            navigatesTo: '110/utilization',
                                            element: <Util inline />,
                                        },
                                        {
                                            name: 'Caesar',
                                            titleAppend: 'Caesar',
                                            description: 'Decode/Encode Caesar Ciphers',
                                            nameIconPrefix: <VpnKeyIcon sx={{ mr: 1 }} />,
                                            navigatesTo: `110/caesar`,
                                            element: <Caesar inline />,
                                        },
                                        {
                                            name: 'Block',
                                            titleAppend: 'Block',
                                            description: 'Decode/Encode Block Ciphers',
                                            element: <Block inline />,
                                            navigatesTo: `110/block`,
                                            nameIconPrefix: <VpnKeyIcon sx={{ mr: 1 }} />,
                                        },
                                    ]}
                                    parentResourceName="Resources/CompSci110"
                                    parentResourceTitle="Resources/110"
                                />
                            ),
                        },
                        {
                            name: 'CompSci101',
                            titleAppend: '101',
                            description: 'Principles of Programming',
                            nameIconPrefix: <SchoolIcon sx={{ mr: 1 }} />,
                            unlinkable: true,
                            ancient: true,
                            element: (
                                <ResourceList
                                    resources={[
                                        {
                                            name: 'Quick Links',
                                            nameIconPrefix: <LinkIcon sx={{ mr: 1 }} />,
                                            titleAppend: 'Links',
                                            element: <QuickLinks />,
                                        },
                                        {
                                            name: 'Past Papers',
                                            titleAppend: 'PP',
                                            element: <PastPapers />,
                                            nameIconPrefix: <ArticleIcon sx={{ mr: 1 }} />,
                                        },
                                    ]}
                                    parentResourceName="Resources/CompSci101"
                                    parentResourceTitle="Resources/101"
                                />
                            ),
                        },
                        {
                            name: 'Colour Palette',
                            titleAppend: 'Colour',
                            ancient: true,
                            element: <Colour inline />,
                            navigatesTo: 'colours',
                        },
                        {
                            name: 'Dijkstra',
                            titleAppend: 'Dijkstra',
                            ancient: true,
                        },
                    ]}
                    parentResourceName="Resources"
                    parentResourceTitle="Resources"
                />
            </Container>
        </Fade>
    );
};

export default Resources;
