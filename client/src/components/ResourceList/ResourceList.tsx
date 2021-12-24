import { Accordion, AccordionDetails } from '@mui/material';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { interpolateTitle } from '../../redux/slices/main.slice';
import AccordionItem from '../../types/AccordionItem';
import OpenInNewPage from '../OpenInNewPage';
import ResourceSummary from './ResourceSummary/ResourceSummary';

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

    const [expanded, setExpanded] = useState<string | false>(false);

    const splitParent = parentResourceName.split('/').slice(1);

    function handleExpansion(key: string, isExpanded: boolean, titleAppend?: string) {
        if (isExpanded) {
            setExpanded(key);
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
            {resources.map((resource) => {
                const {
                    name,
                    titleAppend,
                    element,
                    navigatesTo,
                    showNavigationRegardlessOfElement,
                } = resource;

                const key = `${splitParent.length ? `${splitParent.join('/')}/` : ''}${name}`;

                return (
                    <Accordion
                        id={key}
                        disableGutters={!enableGutters}
                        key={key}
                        expanded={expanded === key}
                        onChange={(_, expanded) => {
                            handleExpansion(key, expanded, titleAppend);
                        }}
                    >
                        <ResourceSummary
                            resource={resource}
                            navLink={key}
                            expanded={expanded === key}
                        />
                        {
                            <AccordionDetails>
                                {!!navigatesTo &&
                                    (!element || showNavigationRegardlessOfElement) && (
                                        <OpenInNewPage to={navigatesTo} />
                                    )}
                                {showNavigationRegardlessOfElement && !!element && (
                                    <div style={{ height: 10 }}></div>
                                )}
                                {!!element && element}
                            </AccordionDetails>
                        }
                    </Accordion>
                );
            })}
        </>
    );
};

export default ResourceList;
