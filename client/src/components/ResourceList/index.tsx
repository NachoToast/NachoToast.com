import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Tooltip,
    Typography,
    useMediaQuery,
    useTheme,
} from '@mui/material';
import { SyntheticEvent, useState } from 'react';
import { useDispatch } from 'react-redux';
import { interpolateTitle } from '../../redux/slices/main.slice';
import AccordionResource from '../../types/AccordionItem';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ArticleIcon from '@mui/icons-material/Article';
import { Link } from 'react-router-dom';

const ResourceList = ({
    resources,
    parentResourceName,
}: {
    resources: AccordionResource[];
    parentResourceName: string;
}) => {
    const dispatch = useDispatch();

    const theme = useTheme();
    const notSmall = useMediaQuery(theme.breakpoints.up('sm'));

    const [expanded, setExpanded] = useState<string | false>(false);

    function handleExpansion(panel: string, _: SyntheticEvent, isExpanded: boolean) {
        setExpanded(isExpanded ? panel : false);
        if (isExpanded) {
            dispatch(interpolateTitle(`${parentResourceName}/${panel}`));
        } else {
            dispatch(interpolateTitle(parentResourceName));
        }
    }

    return (
        <>
            {resources.map((resource, index) => {
                const { path: name, displayName, description, element, navigatesTo } = resource;
                //
                return (
                    <Accordion
                        key={`${parentResourceName}${resource.path}${index}`}
                        expanded={expanded === name}
                        onChange={(event, expanded) => {
                            handleExpansion(name, event, expanded);
                        }}
                    >
                        <AccordionSummary
                            expandIcon={
                                navigatesTo ? (
                                    <Tooltip title="This opens a new page">
                                        <ArticleIcon />
                                    </Tooltip>
                                ) : (
                                    <ExpandMoreIcon />
                                )
                            }
                            style={{ overflow: 'hidden', justifyContent: 'flex-start' }}
                        >
                            {!!navigatesTo ? (
                                <Link to={navigatesTo} target="_blank">
                                    <Typography sx={{ width: '33%' }}>
                                        {displayName || name}
                                    </Typography>
                                </Link>
                            ) : (
                                <Typography sx={{ width: '33%' }}>{displayName || name}</Typography>
                            )}
                            {notSmall && description && (
                                <Typography
                                    noWrap
                                    textAlign="right"
                                    sx={{ color: 'text.secondary', mr: 4, flexGrow: 1 }}
                                >
                                    {description}
                                </Typography>
                            )}
                        </AccordionSummary>
                        {element && <AccordionDetails>{element}</AccordionDetails>}
                    </Accordion>
                );
            })}
        </>
    );
};

export default ResourceList;
