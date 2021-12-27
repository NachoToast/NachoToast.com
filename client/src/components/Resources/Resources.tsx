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
                            ancient: true,
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
                                        },
                                        {
                                            name: 'Revision Exercise Answers',
                                            titleAppend: 'Answers',
                                        },
                                        {
                                            name: 'Assessment Answers',
                                            titleAppend: 'Answers',
                                        },
                                        {
                                            name: 'Assignments',
                                            titleAppend: 'Answers',
                                        },
                                        {
                                            name: 'Past Papers',
                                            titleAppend: 'Papers',
                                        },
                                        {
                                            name: 'Walkthroughs',
                                            titleAppend: 'Guides',
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
                {/* <Accordion
                    expanded={expanded === '110'}
                    onChange={(e, a) => {
                        handleExpansion('110', e, a);
                    }}
                >
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        style={{
                            overflow: 'hidden',
                            justifyContent: 'flex-start',
                        }}
                    >
                        <Typography sx={{ width: '33%', flexShrink: 0 }}>CompSci110</Typography>
                        {notSmall && (
                            <Fade in={notSmall}>
                                <Typography
                                    noWrap
                                    textAlign="right"
                                    sx={{ color: 'text.secondary', mr: 4 }}
                                    style={{ flexGrow: 1 }}
                                >
                                    Introduction to Computer Systems
                                </Typography>
                            </Fade>
                        )}
                    </AccordionSummary>
                    <AccordionDetails>
                        <Accordion>
                            <AccordionSummary>
                                <Typography>Block</Typography>
                            </AccordionSummary>
                        </Accordion>
                    </AccordionDetails>
                </Accordion>
                <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography>CompSci101</Typography>
                    </AccordionSummary>
                </Accordion>
                <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography>Other</Typography>
                    </AccordionSummary>
                </Accordion> */}
            </Container>
        </Fade>
    );
};

export default Resources;
