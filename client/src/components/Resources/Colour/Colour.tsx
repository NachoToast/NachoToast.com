import { Box, Fade, Stack, Typography } from '@mui/material';
import { ChangeEvent, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { interpolateTitle, resolveAfterSomeTime } from '../../../redux/slices/main.slice';
import LinearProgressWithLabel from '../../Misc/LinearProgressWithLabel';
import './Colour.css';
import { RGBToHex } from './colourHelpers';

enum SortTypes {
    default = 'Default',
    percentage = 'Percentage',
    colourDiff = 'Colour Difference',
}

type SortTypeMap = {
    [key in SortTypes]: string[];
};

const defaultCachedSorts: SortTypeMap = {
    [SortTypes.default]: [],
    [SortTypes.percentage]: [],
    [SortTypes.colourDiff]: [],
};

type LoadingMap = {
    [key in SortTypes]: number;
};

const Colour = ({ inline }: { inline?: boolean }) => {
    const dispatch = useDispatch();

    useEffect(() => {
        if (!inline) {
            dispatch(interpolateTitle(`Colour`));
        }
    }, [dispatch, inline]);

    // basic info like the file, image source, and loading state
    const [file, setFile] = useState<File | null>(null);
    const [imageSrc, setImageSrc] = useState<string>('');
    const [loading, setLoading] = useState<false | LoadingMap>(false);

    // misc info like number of unique colours
    const [numUnique, setNumUnique] = useState(0);

    // pagination info
    const [page, setPage] = useState(0);
    const [maxPage, setMaxPage] = useState(0);
    const [perPage, setPerPage] = useState<0 | 20 | 50 | 100>(0);

    // sorting info
    const [sortMode, setSortMode] = useState<SortTypes>(SortTypes.default);
    const [cachedSorts, setCachedSorts] = useState<SortTypeMap>(defaultCachedSorts);

    function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
        e.preventDefault();

        // because unabortable asynchronous operations are running
        // we don't want to allow changing file while another is being processed
        // TODO: find way to abort these asynchronous operations
        if (loading) {
            window.alert(
                `Please wait for the current image to finish processing before trying another.`,
            );
            return;
        }

        if (!e.target.files?.length) return;
        const file = e.target.files[0];
        setFile(file);
    }

    // file change handling
    useEffect(() => {
        if (!file) return;
        const newLoading: LoadingMap = {
            [SortTypes.colourDiff]: 0,
            [SortTypes.default]: 0,
            [SortTypes.percentage]: 0,
        };
        setLoading(newLoading);

        /** Instructs the FileReader to create and handle the loading of a new image. */
        function handleReaderLoad(e: ProgressEvent<FileReader>): void {
            e.preventDefault();
            if (typeof e.target?.result !== 'string') {
                return; // should never happen(?)
            }

            setImageSrc(e.target.result);

            const image = new Image();
            image.addEventListener('load', handleImageLoad);
            image.src = e.target.result;
        }

        /** Instructs a new image to draw itself on the canvas and start processing its data. */
        async function handleImageLoad(this: HTMLImageElement, e: Event): Promise<void> {
            e.preventDefault();
            const canvas = document.getElementById('mainCanvas') as HTMLCanvasElement;
            canvas.setAttribute('width', this.width.toString());
            canvas.setAttribute('height', this.height.toString());
            const context = canvas.getContext('2d');
            if (!context) {
                console.error(`context for mainCanvas nonexistant! This should never happen.`);
                return;
            }
            context.drawImage(this, 0, 0);
            await processImageData(context.getImageData(0, 0, this.width, this.height).data);
        }

        /** Sorts colours by default and percentage, then does the remaining sorts. */
        async function processImageData(imageData: Uint8ClampedArray): Promise<void> {
            // the imageData array has groups of 4 integers representing r,g,b, and transparency
            // we only care about r,g,b
            const len = imageData.length;

            const colourAbundanceMap: { [colour: string]: number } = {};

            const newCache: SortTypeMap = {
                [SortTypes.default]: [],
                [SortTypes.percentage]: [],
                [SortTypes.colourDiff]: [],
            };

            for (let i = 0; i < len; i += 4) {
                const hexified = RGBToHex(imageData[i], imageData[i + 1], imageData[i + 2]);
                if (hexified in colourAbundanceMap) {
                    colourAbundanceMap[hexified] += 1;
                } else {
                    colourAbundanceMap[hexified] = 0;
                    newCache[SortTypes.default].push(hexified);
                }
                const newPercentage = Math.ceil((100 * i) / len);
                if (newPercentage > 10 + newLoading[SortTypes.default]) {
                    newLoading[SortTypes.default] = newPercentage;
                    setLoading({ ...newLoading, [SortTypes.default]: newPercentage });
                    await resolveAfterSomeTime(1); // animation accuracy
                }
            }
            newLoading[SortTypes.default] = 100;
            setLoading({ ...newLoading });

            console.log(newCache[SortTypes.default].length + 'unique colours');
            await resolveAfterSomeTime(1000);
            // setLoading(false);
        }

        async function sortByPercentage(abundanceMap: { [colour: string]: number }): Promise<void> {
            const keys = Object.keys(abundanceMap);
            for (let i = 0, len = keys.length; i < len; i++) {}
        }

        const reader = new FileReader();
        reader.addEventListener('load', handleReaderLoad);
        reader.readAsDataURL(file);

        return () => {
            reader.removeEventListener('load', handleReaderLoad);
        };
    }, [file]);

    return (
        <Box>
            <input
                type="file"
                onChange={handleFileChange}
                accept=".jpg, .jpeg, .png"
                style={{ display: 'none' }}
                id="fileInput"
            />
            <label htmlFor="fileInput" className="fileInput">
                <Typography
                    variant="h4"
                    align="center"
                    sx={{ width: '100%', cursor: 'pointer' }}
                    gutterBottom
                >
                    {file?.name ? file.name : `Select File`}
                </Typography>
            </label>
            {!!file && (
                <Stack spacing={1}>
                    <Stack direction="row" spacing={1}>
                        {!!imageSrc && (
                            <img
                                src={imageSrc}
                                style={{ width: '50%' }}
                                alt="Your upload, unmodified."
                            />
                        )}
                        <canvas style={{ width: '50%', display: 'none' }} id="mainCanvas" />
                        {!!loading && (
                            <Stack direction="column" sx={{ width: '100%' }}>
                                <Typography variant="h6" textAlign="center">
                                    Sorting Colours... (
                                    {Math.floor(
                                        Object.keys(loading)
                                            .map((e) => loading[e as SortTypes])
                                            .reduce((prev, next) => prev + next) /
                                            Object.keys(loading).length,
                                    )}
                                    %)
                                </Typography>
                                {Object.keys(loading).map((e, i) => (
                                    <Fade in key={i}>
                                        <Stack direction="column" sx={{ mb: 1 }}>
                                            <Typography variant="caption">{e}</Typography>
                                            <LinearProgressWithLabel
                                                value={loading[e as SortTypes]}
                                            />
                                        </Stack>
                                    </Fade>
                                ))}
                            </Stack>
                        )}
                    </Stack>
                </Stack>
            )}
        </Box>
    );
};

export default Colour;
