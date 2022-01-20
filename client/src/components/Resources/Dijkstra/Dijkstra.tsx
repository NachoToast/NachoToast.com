import {
    Box,
    Button,
    Divider,
    Fade,
    FormControl,
    InputLabel,
    Link,
    MenuItem,
    Select,
    SelectChangeEvent,
    Stack,
    TextareaAutosize,
    TextField,
    Tooltip,
    Typography,
} from '@mui/material';
import { Dispatch, FormEvent, SetStateAction, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { interpolateTitle } from '../../../redux/slices/main.slice';
import {
    dijkstrasAlgorithm,
    InputTypes,
    isAlphanumeric,
    toAdjMat,
    TraceBackOutput,
    Node as NodeType,
} from './dijkstraHelpers';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import './dijkstra.css';

enum Presets {
    Youtube = 'Youtube',
    Impossible = 'Impossible',
    Wikipedia = 'Wikipedia',
    Chungus = 'Chungus',
}

const presetDetails: {
    [key in Presets]: {
        tooltip: JSX.Element;
        adjMat: string;
        nodes: string;
        sourceNode: string;
        targetNode: string;
    };
} = {
    [Presets.Youtube]: {
        tooltip: (
            <Typography>
                From the <Link href="https://youtu.be/pVfj6mxhdMw">YouTube example</Link>
            </Typography>
        ),
        adjMat: '0 6 0 1 0, 6 0 5 2 2, 0 5 0 0 5, 1 2 0 0 1, 0 2 5 1 0',
        nodes: 'A B C D E',
        sourceNode: 'A',
        targetNode: 'C',
    },
    [Presets.Impossible]: {
        tooltip: <Typography>An impossible-to-reach target node</Typography>,
        adjMat: '0 2 0, 2 0 0, 0 0 0',
        nodes: 'A B C',
        sourceNode: 'A',
        targetNode: 'C',
    },
    [Presets.Wikipedia]: {
        tooltip: (
            <Typography>
                From the{' '}
                <Link href="https://en.wikipedia.org/wiki/Dijkstra%27s_algorithm" target="_blank">
                    Wikipedia example
                </Link>
            </Typography>
        ),
        adjMat: '0 7 9 0 0 14, 7 0 10 15 0 0, 9 10 0 11 0 2, 0 15 11 0 6 0, 0 0 0 6 0 9, 14 0 2 0 9 0',
        nodes: '1 2 3 4 5 6',
        sourceNode: '1',
        targetNode: '5',
    },
    [Presets.Chungus]: {
        tooltip: <Typography>A large graph with many nodes and connections</Typography>,
        adjMat: '1 2 1, 1 3 2, 1 4 5, 1 5 2, 2 6 3, 2 7 3, 3 7 1, 4 8 7, 5 8 2, 5 9 2, 6 7 1, 7 8 1, 8 9 1, 6 10 3, 6 11 2, 7 11 2, 8 12 2, 9 12 2, 9 13 3, 10 14 1, 11 14 1, 11 15 3, 12 15 1, 12 16 4, 13 16 1, 10 17 6, 14 17 2, 15 17 2, 16 17 2, 17 18 5, 17 19 3, 18 20 1, 19 20 1',
        nodes: '1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18 19 20',
        sourceNode: '8',
        targetNode: '20',
    },
};

const inputDetails: { [key in InputTypes]: string } = {
    [InputTypes.adjMatrix]:
        'Comma or line separated rows, space or tab separated columns. Header rows and columns will be ignored.',
    [InputTypes.array]: 'nodeA nodeB weight, e.g. 1 2 1, 1 3 2, ...',
    [InputTypes.auto]: 'Adjacency matrix or array',
};

const Dijkstra = ({ inline }: { inline?: boolean }) => {
    const dispatch = useDispatch();

    useEffect(() => {
        if (!inline) {
            dispatch(interpolateTitle(`Dijkstra`));
        }
    }, [dispatch, inline]);

    const [inputType, setInputType] = useState<InputTypes>(InputTypes.auto);
    const [inputNodes, setInputNodes] = useState('');
    const [inputAdj, setInputAdj] = useState('');
    const [sourceNode, setSourceNode] = useState('');
    const [targetNode, setTargetNode] = useState('');

    const [adjMat, setAdjMat] = useState<number[][]>([]);
    const [formattedNodes, setFormattedNodes] = useState<string[]>([]);

    const [travelPath, setTravelPath] = useState<
        (TraceBackOutput & { visitedNodes: number }) | null
    >(null);
    const [nodeTable, setNodeTable] = useState<NodeType[] | null>(null);

    const [matrixShown, setMatrixShown] = useState(true);

    const [error, setError] = useState<JSX.Element | null>(null);

    const handleInputTypeChange = (event: SelectChangeEvent) => {
        setInputType(event.target.value as InputTypes);
    };

    const handleTextInput = (e: FormEvent, fn: Dispatch<SetStateAction<any>>) => {
        e.preventDefault();
        const { value } = e.target as HTMLTextAreaElement;
        fn(value);
    };

    useEffect(() => {
        const nodes = inputNodes
            .split(/[ ,\n\t]/g)
            .filter(isAlphanumeric)
            .filter((e, i, a) => a.indexOf(e) === i);

        const adjMat = toAdjMat(inputAdj, inputType, nodes);
        setFormattedNodes(nodes);
        setAdjMat(adjMat);

        if (
            adjMat.length &&
            nodes.length &&
            sourceNode &&
            targetNode &&
            nodes.indexOf(sourceNode) !== -1 &&
            nodes.indexOf(targetNode) !== -1
        ) {
            const res = dijkstrasAlgorithm(nodes, adjMat, sourceNode, targetNode);
            setTravelPath(res?.result ?? null);
            setNodeTable(res?.nodes ?? null);

            let newError = null;
            if (res?.error) {
                newError = (
                    <Typography color="lightcoral">
                        <ErrorOutlineIcon sx={{ mb: -0.7, mr: 0.5 }} />
                        Error: {res.error}
                    </Typography>
                );
            } else if (!res?.validPath) {
                newError = <Typography>No Valid Path</Typography>;
            }

            setError(newError);
        }
    }, [inputAdj, inputNodes, inputType, sourceNode, targetNode]);

    return (
        <Fade in>
            <Stack spacing={2} alignItems="center" divider={<Divider flexItem />} sx={{ pb: 2 }}>
                <Stack spacing={2} sx={{ width: '80%' }}>
                    <Stack spacing={1} direction="row">
                        <TextareaAutosize
                            minRows={3}
                            maxRows={3}
                            placeholder="List of nodes"
                            style={{ fontFamily: 'roboto', fontSize: '18px', width: '50%' }}
                            onInput={(e) => handleTextInput(e, setInputNodes)}
                            value={inputNodes}
                        />
                        <TextareaAutosize
                            minRows={3}
                            maxRows={3}
                            placeholder={inputDetails[inputType]}
                            style={{ fontFamily: 'roboto', fontSize: '18px', width: '50%' }}
                            onInput={(e) => handleTextInput(e, setInputAdj)}
                            value={inputAdj}
                        />
                    </Stack>
                    <Stack direction="row" spacing={1}>
                        <TextField
                            label="Source Node"
                            autoComplete="off"
                            value={sourceNode}
                            onInput={(e) => handleTextInput(e, setSourceNode)}
                        />
                        <TextField
                            label="Target Node"
                            autoComplete="off"
                            value={targetNode}
                            onInput={(e) => handleTextInput(e, setTargetNode)}
                        />
                        <FormControl>
                            <InputLabel id="input-type-label">Input Type</InputLabel>
                            <Select
                                onChange={handleInputTypeChange}
                                value={inputType}
                                label="Input Type"
                                labelId="input-type-label"
                            >
                                <MenuItem value={InputTypes.auto}>{InputTypes.auto}</MenuItem>
                                <MenuItem value={InputTypes.array}>{InputTypes.array}</MenuItem>
                                <MenuItem value={InputTypes.adjMatrix}>
                                    {InputTypes.adjMatrix}
                                </MenuItem>
                            </Select>
                        </FormControl>
                    </Stack>
                </Stack>
                {!!inputNodes && !!inputAdj && (
                    <Fade in>
                        <table className="adjMatTable">
                            <thead>
                                <tr>
                                    <th>
                                        <Tooltip
                                            title={
                                                matrixShown
                                                    ? 'Hide Adjacency Matrix'
                                                    : 'Show Adjacency Matrix'
                                            }
                                        >
                                            <Button onClick={() => setMatrixShown(!matrixShown)}>
                                                {matrixShown ? (
                                                    <VisibilityOffIcon />
                                                ) : (
                                                    <VisibilityIcon />
                                                )}
                                            </Button>
                                        </Tooltip>
                                    </th>
                                    {formattedNodes.map((e, i) => (
                                        <th key={`${e}${i}`}>{e}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {matrixShown &&
                                    adjMat.map((e, i) => (
                                        <tr key={`${e}${i}`}>
                                            <th>{formattedNodes[i]}</th>
                                            {e.map((e2, i2) => (
                                                <td key={`${e2}${i2}`}>{e2 || ''}</td>
                                            ))}
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                    </Fade>
                )}
                {!!travelPath && (
                    <Fade in>
                        <Stack>
                            <Typography variant="h4">
                                {travelPath.nodeNamePath.join(' → ')}
                            </Typography>
                            <Typography variant="subtitle1" color="#999" textAlign="center">
                                {travelPath.nodeNamePath.length} Nodes,{' '}
                                {
                                    travelPath.nodeWeightPath.slice(
                                        travelPath.nodeNamePath.length - 1,
                                    )[0]
                                }{' '}
                                Total Weight
                            </Typography>
                            <Stack sx={{ maxHeight: '30vh', overflowY: 'auto' }}>
                                <table className="adjMatTable">
                                    <thead>
                                        <tr>
                                            <th>Node</th>
                                            <th>Weight</th>
                                            <th>From</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {!!nodeTable &&
                                            nodeTable.map(
                                                ({ name, prevVertex, tentativeDistance }, i) => (
                                                    <tr key={`${name}${i}`}>
                                                        <td>{name}</td>
                                                        <td>{tentativeDistance || '∞'}</td>
                                                        <td>{prevVertex?.name || ' '}</td>
                                                    </tr>
                                                ),
                                            )}
                                    </tbody>
                                </table>
                            </Stack>
                        </Stack>
                    </Fade>
                )}
                {!!error && <Fade in>{error}</Fade>}
                <Stack
                    direction="row"
                    spacing={1}
                    alignItems="center"
                    sx={{ maxWidth: '100%', overflowX: 'auto' }}
                >
                    <Typography>Presets:</Typography>
                    {Object.keys(presetDetails).map((e, i) => {
                        const { tooltip, adjMat, nodes, sourceNode, targetNode } =
                            presetDetails[e as Presets];

                        return (
                            <Tooltip key={`${e}${i}`} title={tooltip}>
                                <Button
                                    variant="outlined"
                                    onClick={() => {
                                        setInputNodes(nodes);
                                        setInputAdj(adjMat);
                                        setSourceNode(sourceNode);
                                        setTargetNode(targetNode);
                                    }}
                                >
                                    {e}
                                </Button>
                            </Tooltip>
                        );
                    })}
                </Stack>
            </Stack>
        </Fade>
    );
};

export default Dijkstra;
