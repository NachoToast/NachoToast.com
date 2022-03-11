import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { interpolateTitle } from '../../redux/slices/main.slice';
import axios, { AxiosResponse } from 'axios';
import { GitHubCommit } from '../../types/GitHubCommit';

const Changelog = ({ inline }: { inline?: boolean }) => {
    const dispatch = useDispatch();

    useEffect(() => {
        if (!inline) {
            dispatch(interpolateTitle(`Changelog`));
        }
    }, [dispatch, inline]);

    const [page, setPage] = useState(1);
    const [per_page, setPer_page] = useState(30);
    const [since, setSince] = useState(
        new Date(Date.now() - 30 * 25 * 60 * 60 * 1000).toISOString(),
    );

    const [commits, setCommits] = useState([]);

    useEffect(() => {
        async function makeRequest() {
            const { data } = (await axios.get(
                `https://api.github.com/repos/NachoToast/NachoToast.com/commits`,
                {
                    params: {
                        page,
                        per_page,
                        since,
                    },
                },
            )) as AxiosResponse<GitHubCommit[]>;
            console.log(data[0].author);
            setCommits(data as any);
        }
        makeRequest();
    }, [page, per_page, since]);

    return <div>changelog!</div>;
};

export default Changelog;
