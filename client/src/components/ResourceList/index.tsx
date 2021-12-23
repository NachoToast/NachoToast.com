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
import { SyntheticEvent, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { interpolateTitle } from '../../redux/slices/main.slice';
import AccordionItem from '../../types/AccordionItem';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ArticleIcon from '@mui/icons-material/ArticleOutlined';
import { Link, useNavigate } from 'react-router-dom';

const ResourceList = ({
    resources,
    parentResourceName,
    enableGutters,
}: {
    resources: AccordionItem[];
    parentResourceName: string;
    enableGutters?: boolean;
}) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const theme = useTheme();
    const notSmall = useMediaQuery(theme.breakpoints.up('sm'));

    const [expanded, setExpanded] = useState<string | false>(false);

    function pog() {
        const pog = window.location.hash
            .slice(1)
            .split('/')
            .filter((e) => !!e);
        return pog;
    }

    const [locationHashes, setLocationHashes] = useState<string[]>(pog());

    function handleExpansion(
        key: string,
        _: SyntheticEvent,
        isExpanded: boolean,
        titleAppend: string,
        navigatesTo?: string,
    ) {
        if (isExpanded) {
            setExpanded(key);
            navigate(`#${key}`);
            if (titleAppend) {
                dispatch(interpolateTitle(`${parentResourceName}/${titleAppend}`));
            }
            if (navigatesTo) {
                // window.open(`${window.location}/${navigatesTo}`, '_blank');
                // setExpanded(false);
            }
        } else {
            navigate('');
            setExpanded(false);
            dispatch(interpolateTitle(parentResourceName));
        }
    }

    function shouldBeExpanded(key: string, name: string, titleAppend?: string): boolean {
        return expanded === key;
    }

    return (
        <>
            {resources.map(
                (
                    { name, titleAppend, description, element, navigatesTo, nameIconPrefix },
                    index,
                ) => {
                    //
                    const key = `${parentResourceName}/${name}`;

                    return (
                        <Accordion
                            onClick={() =>
                                console.log(
                                    `"${name}"`,
                                    parentResourceName,
                                    name,
                                    `\n`,
                                    locationHashes,
                                )
                            }
                            id={key}
                            disableGutters={!enableGutters}
                            key={key}
                            expanded={shouldBeExpanded(key, name, titleAppend)}
                            onChange={(event, expanded) => {
                                handleExpansion(
                                    key,
                                    event,
                                    expanded,
                                    titleAppend || '',
                                    navigatesTo,
                                );
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
                                                    setExpanded(name);
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
