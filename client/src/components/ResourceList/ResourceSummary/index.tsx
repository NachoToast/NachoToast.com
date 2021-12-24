import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AccordionItem from '../../../types/AccordionItem';
import { AccordionSummary, Fade, Stack, Typography, useMediaQuery } from '@mui/material';
import NewPage from './ResourceIcons/NewPage';
import { useTheme } from '@mui/system';
import LinkPage from './ResourceIcons/LinkPage';

const ResourceSummary = ({
    resource,
    expanded,
    navLink,
}: {
    resource: AccordionItem;
    expanded: boolean;
    navLink: string;
}) => {
    const { name, nameIconPrefix, navigatesTo, element, description, unlinkable } = resource;

    const theme = useTheme();
    const notSmall = useMediaQuery(theme.breakpoints.up('sm'));

    const showOpenInNewPageIcon = !!navigatesTo && !!element;
    const showDescription = notSmall && !!description;

    return (
        <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            sx={{ overflow: 'hidden', justifyContent: 'flex-start' }}
        >
            <Stack direction="row" spacing={1} sx={{ width: '100%' }}>
                {!!nameIconPrefix && nameIconPrefix}
                <Typography>{name}</Typography>
                <Fade in={expanded}>
                    <Stack direction="row" spacing={1}>
                        {showOpenInNewPageIcon && <NewPage navigatesTo={navigatesTo} />}
                        {!unlinkable && <LinkPage linkToMake={navLink} />}
                    </Stack>
                </Fade>
                {showDescription && (
                    <Typography
                        noWrap
                        textAlign="right"
                        sx={{ color: 'text.secondary', flexGrow: 1, pr: 2 }}
                    >
                        {description}
                    </Typography>
                )}
            </Stack>
        </AccordionSummary>
    );
};

export default ResourceSummary;
