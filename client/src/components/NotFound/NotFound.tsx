import { Container, Fade, Typography } from '@mui/material';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getInTransition, interpolateTitle } from '../../redux/slices/main.slice';
import './NotFound.css';

const NotFound = () => {
    const dispatch = useDispatch();

    const inTransition = useSelector(getInTransition);

    useEffect(() => {
        dispatch(interpolateTitle(`Not Found`));
    }, [dispatch]);

    useEffect(() => {
        document.body.className = 'noScroll';

        return () => {
            document.body.className = '';
        };
    }, []);

    return (
        <Container
            className="noScroll"
            style={{
                height: '3000vh',
                alignItems: 'center',
                justifyContent: 'center',
                overflowY: 'hidden',
            }}
        >
            <Fade in={!inTransition}>
                <Typography align="center" variant="h6">
                    The page you are looking for doesn't exist.
                </Typography>
            </Fade>
        </Container>
    );
};

export default NotFound;
