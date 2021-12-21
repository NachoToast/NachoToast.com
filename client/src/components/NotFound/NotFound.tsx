import { Container, Typography } from '@mui/material';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { interpolateTitle } from '../../redux/slices/main.slice';
import './NotFound.css';

const NotFound = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(interpolateTitle(`Page Not Found`));
    }, [dispatch]);

    return (
        <Container
            style={{
                height: '3000vh',
                alignItems: 'center',
                justifyContent: 'center',
                overflowY: 'hidden',
            }}
        >
            <Typography align="center" variant="subtitle1">
                The page you are looking for doesn't exist.
            </Typography>
        </Container>
    );
};

export default NotFound;
