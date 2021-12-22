import { Container, Fade } from '@mui/material';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { interpolateTitle } from '../../redux/slices/main.slice';
import ResourceList from '../ResourceList';

const Resources = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(interpolateTitle(`Resources`));
    }, [dispatch]);

    return (
        <Fade in>
            <Container
            // maxWidth="md"
            // style={{
            //     // alignItems: 'center',
            //     justifyContent: 'space-evenly',
            //     display: 'flex',
            //     flexFlow: 'row wrap',
            // }}
            >
                <ResourceList
                    resources={[
                        {
                            path: '110',
                            displayName: 'CompSci110',
                            description: 'Introduction to Computer Systems',
                            element: (
                                <ResourceList
                                    resources={[
                                        {
                                            path: 'Block Cipher Decoder',
                                            displayName: 'Block',
                                            description: 'Decode/Encode Block Ciphers',
                                            // element: <Block />,
                                            navigatesTo: `110/Block`,
                                        },
                                    ]}
                                    parentResourceName="Resources/110"
                                />
                            ),
                        },
                    ]}
                    parentResourceName="Resources"
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
