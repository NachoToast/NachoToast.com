import { Box, Fade, Stack, Typography } from '@mui/material';
import { ChangeEvent, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { interpolateTitle, resolveAfterSomeTime } from '../../../redux/slices/main.slice';
import LinearProgressWithLabel from '../../Misc/LinearProgressWithLabel';
import { colourDifference, RGBToHex } from './colourHelpers';
import './Colour.css';
import Palette from './Palette';

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
} & { done: boolean };

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

    const [cachedSorts, setCachedSorts] = useState<SortTypeMap>(defaultCachedSorts);

    function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
        e.preventDefault();

        // because unabortable asynchronous operations are running
        // we don't want to allow changing file while another is being processed
        // TODO: find way to abort these asynchronous operations
        if (loading && !loading.done) {
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
            done: false,
        };
        setLoading(newLoading);

        const newCache: SortTypeMap = {
            [SortTypes.default]: [],
            [SortTypes.percentage]: [],
            [SortTypes.colourDiff]: [],
        };

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

            const colourAbundanceMap: { [colour: string]: number } = {};

            for (let i = 0, len = imageData.length; i < len; i += 4) {
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
            setCachedSorts({ ...newCache });
            await resolveAfterSomeTime(1); // animation accuracy

            await Promise.all([
                sortByPercentage(colourAbundanceMap),
                sortByColourDifference(colourAbundanceMap),
            ]);
            await resolveAfterSomeTime(1000);
            newLoading.done = true;
            setLoading({ ...newLoading });
            await resolveAfterSomeTime(500);
            setLoading(false);
        }

        async function sortByPercentage(abundanceMap: { [colour: string]: number }): Promise<void> {
            const byPercentage = (a: string, b: string) => abundanceMap[b] - abundanceMap[a];
            newCache[SortTypes.percentage] = Object.keys(abundanceMap).sort(byPercentage);
            newLoading[SortTypes.percentage] = 100;
            setLoading({ ...newLoading });
            setCachedSorts({ ...newCache });
        }

        async function sortByColourDifference(abundanceMap: {
            [colour: string]: number;
        }): Promise<void> {
            newLoading[SortTypes.colourDiff] = 100;
            newCache[SortTypes.colourDiff] = Object.keys(abundanceMap).sort(colourDifference);
            setLoading({ ...newLoading });
            setCachedSorts({ ...newCache });
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
                    textOverflow="ellipsis"
                >
                    {file?.name || `Select File`}
                </Typography>
            </label>
            {!!file && (
                <Stack spacing={1}>
                    <Stack direction="row" spacing={1} justifyContent="center">
                        {!!imageSrc && (
                            <img
                                src={imageSrc}
                                style={{ maxWidth: '25%', display: loading ? 'flex' : 'none' }}
                                alt="Your upload, unmodified."
                            />
                        )}
                        <canvas style={{ display: 'none' }} id="mainCanvas" />
                        {!!loading && (
                            <Fade in={!loading.done}>
                                <Stack direction="column" sx={{ width: '100%' }}>
                                    <Typography variant="h6" textAlign="center">
                                        Sorting Colours... (
                                        {Math.floor(
                                            Object.keys(loading)
                                                .map((e) => loading[e as SortTypes])
                                                .reduce((prev, next) => prev + next) /
                                                (Object.keys(loading).length - 1),
                                        )}
                                        %)
                                    </Typography>
                                    {Object.keys(loading)
                                        .filter((e) => e !== 'done')
                                        .map((e, i) => (
                                            <Fade in key={`${e}${i}`}>
                                                <Stack direction="column" sx={{ mb: 1 }}>
                                                    <Typography variant="caption">{e}</Typography>
                                                    <LinearProgressWithLabel
                                                        value={loading[e as SortTypes]}
                                                    />
                                                </Stack>
                                            </Fade>
                                        ))}
                                </Stack>
                            </Fade>
                        )}
                    </Stack>
                </Stack>
            )}
            {!!cachedSorts.Default.length && (
                <Box>
                    <Typography>
                        {cachedSorts.Default.length} Unique Colours (
                        {Math.ceil(Math.log2(cachedSorts.Default.length))}bpp)
                    </Typography>
                    <Stack sx={{ mt: 1 }} spacing={1}>
                        {Object.keys(cachedSorts)
                            .filter((e) => !!e.length)
                            .map((e, i) => (
                                <Palette
                                    key={`${e}${i}`}
                                    title={e}
                                    colours={cachedSorts[e as SortTypes]}
                                />
                            ))}
                    </Stack>
                </Box>
            )}
        </Box>
    );
};

export default Colour;
