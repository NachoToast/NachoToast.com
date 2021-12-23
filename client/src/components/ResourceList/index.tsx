import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Typography,
    useMediaQuery,
    useTheme,
    Fade,
    Tooltip,
    Stack,
    MenuItem,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { interpolateTitle } from '../../redux/slices/main.slice';
import AccordionItem from '../../types/AccordionItem';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ArticleIcon from '@mui/icons-material/ArticleOutlined';
import { Link, useNavigate } from 'react-router-dom';

const ResourceList = ({
    resources,
    parentResourceName,
    parentResourceTitle,
    enableGutters,
}: {
    resources: AccordionItem[];
    parentResourceTitle: string;
    parentResourceName: string;
    enableGutters?: boolean;
}) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const theme = useTheme();
    const notSmall = useMediaQuery(theme.breakpoints.up('sm'));

    const [expanded, setExpanded] = useState<string | false>(false);

    const splitParent = parentResourceName.split('/').slice(1);

    function handleExpansion(key: string, isExpanded: boolean, titleAppend: string) {
        if (isExpanded) {
            setExpanded(key);
            navigate(`#${key}`);
            if (titleAppend) {
                dispatch(interpolateTitle(`${parentResourceTitle}/${titleAppend}`));
            }
        } else {
            setExpanded(false);
            dispatch(interpolateTitle(parentResourceTitle));
        }
    }

    useEffect(() => {
        const locationHashes = window.location.hash
            .slice(1)
            .split('/')
            .filter((e) => !!e);

        if (!locationHashes.length) return;

        for (const { name, titleAppend } of resources) {
            const focusArray = [...splitParent, encodeURIComponent(name)];
            if (!focusArray.length) continue;
            const resourceKey = `${splitParent.length ? `${splitParent.join('/')}/` : ''}${name}`;

            if (focusArray.every((e, i) => locationHashes[i] === e)) {
                setExpanded(resourceKey);
                if (titleAppend) {
                    // do stuff
                }
                break;
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            {resources.map(
                ({ name, titleAppend, description, element, navigatesTo, nameIconPrefix }) => {
                    const key = `${splitParent.length ? `${splitParent.join('/')}/` : ''}${name}`;

                    return (
                        <Accordion
                            id={key}
                            disableGutters={!enableGutters}
                            key={key}
                            expanded={expanded === key}
                            onChange={(_, expanded) => {
                                handleExpansion(key, expanded, titleAppend || '');
                            }}
                        >
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                style={{ overflow: 'hidden', justifyContent: 'flex-start' }}
                            >
                                {!!nameIconPrefix && nameIconPrefix}
                                <Typography>{name}</Typography>
                                {!!navigatesTo && (
                                    <Fade in={expanded === key}>
                                        <Link to={navigatesTo}>
                                            <Tooltip
                                                placement="right"
                                                onClick={() => {
                                                    setExpanded(key);
                                                }}
                                                title={
                                                    <Typography variant="body2">
                                                        Open in new page
                                                    </Typography>
                                                }
                                                sx={{ ml: 1 }}
                                            >
                                                <ArticleIcon color="primary" />
                                            </Tooltip>
                                        </Link>
                                    </Fade>
                                )}
                                {notSmall && description && (
                                    <Typography
                                        noWrap
                                        textAlign="right"
                                        sx={{
                                            color: 'text.secondary',
                                            mr: 4,
                                            flexGrow: 1,
                                        }}
                                    >
                                        {description}
                                    </Typography>
                                )}
                            </AccordionSummary>
                            {
                                <AccordionDetails>
                                    {!!navigatesTo && (
                                        <MenuItem component={Link} to={navigatesTo}>
                                            <Stack
                                                direction="row"
                                                // sx={{ width: '100%' }}
                                                spacing={1}
                                            >
                                                <ArticleIcon
                                                    // sx={{ mr: 2 }}
                                                    onClick={(e) => {
                                                        setExpanded(name);
                                                        e.preventDefault();
                                                    }}
                                                />
                                                <Typography
                                                    textAlign="right"
                                                    sx={{ color: 'text.secondary' }}
                                                >
                                                    Click to open in a new page
                                                </Typography>
                                            </Stack>
                                        </MenuItem>
                                    )}
                                    {!!element && element}
                                </AccordionDetails>
                            }
                        </Accordion>
                    );
                },
            )}
        </>
    );
};

export default ResourceList;
