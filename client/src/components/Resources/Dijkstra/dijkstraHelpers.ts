// config variables
const MAX_RECUSION_LIMIT = 100;

export function isAlphanumeric(str: string): boolean {
    if (!str.length) return false;
    for (let i = 0, len = str.length; i < len; i++) {
        let code = str.charCodeAt(i);
        if (!((code > 47 && code < 59) || (code > 64 && code < 91) || (code > 96 && code < 123)))
            return false;
    }
    return true;
}

export enum InputTypes {
    adjMatrix = 'Adjacency Matrix',
    array = 'Array',
    auto = 'Auto',
}

/** Converts an unknown input string into an adjacency matrix, separating values by comma, newlines, tabs, and spaces. */
export function toAdjMat(
    rawInput: string,
    inputType: InputTypes,
    inputNodes: string[],
): number[][] {
    let inferredValueType = inputType;

    if (inputType === InputTypes.auto) {
        if (rawInput.split(/[,\n]/g)[0].trim().split(/[ \t]/g).length === 3) {
            inferredValueType = InputTypes.array;
        } else inferredValueType = InputTypes.adjMatrix;
    }

    // adjacency matrix formatting
    if (inferredValueType === InputTypes.adjMatrix) {
        return rawInput
            .split(/[,\n]/g)
            .map((e) => e.split(/[ \t]/g))
            .map((e) => e.filter((e) => Number.isInteger(parseInt(e))))
            .map((e) => e.map((e) => parseInt(e)))
            .filter((e) => e.length > 0);
    }

    // array formatting
    const baseArr = rawInput.split(/[,\n]/g).map((e) => e.trim().split(/[ \t]/g));
    const newAdj = [...Array(inputNodes.length)].map(() => Array(inputNodes.length).fill(0));

    for (let i = 0, len = baseArr.length; i < len; i++) {
        const indexA = inputNodes.indexOf(baseArr[i][0]);
        const indexB = inputNodes.indexOf(baseArr[i][1]);
        if (indexA === -1 || indexB === -1) continue;
        const weight = parseInt(baseArr[i][2]);

        newAdj[indexA][indexB] = weight;
        newAdj[indexB][indexA] = weight;
    }

    return newAdj;
}

export interface Node {
    name: string;
    tentativeDistance: number;
    prevVertex: Node | null;
    visited: boolean;
}

interface NodeList {
    [index: string]: Node;
}

interface Neighbour {
    nodeName: string;
    weight: number;
}

interface AlgorithmReturn {
    /** Whether or not the target node is reachable from the source node. */
    validPath: boolean;
    /** Any error that occurred during the graph traversal process. */
    error?: string;

    result?: TraceBackOutput & { visitedNodes: number };

    nodes?: Node[];
}

export function dijkstrasAlgorithm(
    inputNodeNames: string[],
    adjMat: number[][],
    sourceNode: string,
    targetNode: string,
): AlgorithmReturn {
    const nodeList: NodeList = {};

    for (const name of inputNodeNames) {
        nodeList[name] = {
            name,
            tentativeDistance: Number.MAX_SAFE_INTEGER,
            prevVertex: null,
            visited: false,
        };
    }

    nodeList[sourceNode].tentativeDistance = 0;
    try {
        const error = graphTraverse(nodeList, inputNodeNames, nodeList[sourceNode], adjMat, 0);
        if (error) return { validPath: false, error };
    } catch (error) {
        if (error instanceof Error) {
            return { validPath: false, error: error.message };
        }
        return { validPath: false, error: `Unknown error occurred` };
    }

    if (nodeList[targetNode].prevVertex === null) {
        return { validPath: false };
    }

    const visitedNodes = Object.values(nodeList).filter(({ visited }) => visited).length;

    const traceBackResult = traceBack(nodeList, nodeList[sourceNode], nodeList[targetNode], {
        nodeNamePath: [],
        nodeWeightPath: [],
    });

    return {
        validPath: true,
        result: { ...traceBackResult, visitedNodes },
        nodes: Object.values(nodeList),
    };
}

function graphTraverse(
    nodeList: NodeList,
    inputNodeNames: string[],
    currentNode: Node,
    adjMat: number[][],
    callNumber: number,
): string | null {
    callNumber++;
    if (callNumber === MAX_RECUSION_LIMIT) {
        return 'Hit recursion limit';
    }

    const unvisitedNeighbours = getUnvisitedNeighbours(
        nodeList,
        inputNodeNames,
        currentNode.name,
        adjMat,
    );

    if (!unvisitedNeighbours.length) {
        // no unvisited neighbouring nodes left
        currentNode.visited = true;

        const unvisitedNonNeighbours = Object.values(nodeList).filter(({ visited }) => !visited);
        if (unvisitedNonNeighbours.length) {
            // go to best unvisited node if it exists
            const bestNonNeighbour = unvisitedNonNeighbours.sort(
                (a, b) => a.tentativeDistance - b.tentativeDistance,
            )[0];
            return graphTraverse(nodeList, inputNodeNames, bestNonNeighbour, adjMat, callNumber);
        }
        // otherwise all nodes are visited, algorithm is done
        return null;
    }

    unvisitedNeighbours.forEach((e) => {
        // update unvisited neighbours tentative distance if shorter
        const oldDistance = nodeList[e.nodeName].tentativeDistance;
        const newDistance = currentNode.tentativeDistance + e.weight;

        if (newDistance < oldDistance) {
            nodeList[e.nodeName].tentativeDistance = newDistance;
            nodeList[e.nodeName].prevVertex = currentNode;
        }
    });

    currentNode.visited = true;

    // call again with `currentNode` being the neighbour with lowest tentative distance
    const bestNeighbour = Object.values(nodeList)
        .filter(({ visited }) => !visited)
        .sort((a, b) => a.tentativeDistance - b.tentativeDistance)[0];

    return graphTraverse(nodeList, inputNodeNames, bestNeighbour, adjMat, callNumber);
}

/** Returns an array of `Neighbour`'s to the current node that have a valid weight and are unvisited. */
function getUnvisitedNeighbours(
    nodeList: NodeList,
    inputNodeNames: string[],
    currentNodeName: string,
    adjMat: number[][],
): Neighbour[] {
    return adjMat[inputNodeNames.indexOf(currentNodeName)]
        .map((e, i) => {
            return { nodeName: inputNodeNames[i], weight: e };
        })
        .filter((e) => e.weight > 0)
        .filter((e) => e.nodeName !== currentNodeName)
        .filter((e) => !nodeList[e.nodeName].visited);
}

export interface TraceBackOutput {
    nodeNamePath: string[];
    nodeWeightPath: number[];
}

function traceBack(
    nodeList: NodeList,
    nodeA: Node,
    nodeB: Node,
    output: TraceBackOutput,
): TraceBackOutput {
    output.nodeNamePath.push(nodeB.name);
    output.nodeWeightPath.push(nodeB.tentativeDistance);

    if (nodeA.name !== nodeB.name) {
        return traceBack(nodeList, nodeA, nodeB.prevVertex!, output);
    }
    output.nodeNamePath.reverse();
    output.nodeWeightPath.reverse();
    return output;
}
