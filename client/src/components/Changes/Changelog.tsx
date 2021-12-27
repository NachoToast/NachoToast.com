import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { interpolateTitle } from '../../redux/slices/main.slice';

const Changelog = ({ inline }: { inline?: boolean }) => {
    const dispatch = useDispatch();

    useEffect(() => {
        if (inline) {
            dispatch(interpolateTitle(`Changelog`));
        }
    }, [dispatch, inline]);

    return <div>changelog!</div>;
};

export default Changelog;
