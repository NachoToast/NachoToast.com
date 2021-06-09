const rawNodes = document.getElementById('rawNodes');
const rawAdj = document.getElementById('rawAdj');
const rawSource = document.getElementById('rawSource');
const rawTarget = document.getElementById('rawTarget');
const rawAdjType = document.getElementById('rawAdjType');

const adjInputTypes = {
    adjMat: 'Adjacency matrix, comma or enter-separated rows, space or tab separated columns, header rows and columns will be ignored.',
    array: 'NodeA NodeB weight, e.g. 1 2 1, 1 3 2, ...',
    auto: 'Adjacency matrix or array.'
}

const statusMessage = document.getElementById('statusMessage');

const outputAdjMat = document.getElementById('outputAdjMat'); // adjacency matrix table
const adjTypeOut = document.getElementById('adjTypeOut'); // its title

const outputPath = document.getElementById('outputPath'); // A -> B -> C
const outputPathMeta = document.getElementById('outputPathMeta') // X Nodes, Y Total Weight
const outputTable = document.getElementById('outputTable') // node, weight, from
const outputMeta = document.getElementById('outputMeta'); // Visited X nodes in Ys

var inputNodes = [];
var inputAdj = [];
var inputSource;
var inputTarget;

//var verbose = false;
var maxAttempts = 100;

/// Input Validation

// main input function chain
function inRawNodes() {
    inputNodes = rawNodes.value.split(/[ ,\n\t]/g)
    .filter(e => isAlphaNumeric(e))
    .filter((e, i, arr) => arr.indexOf(e) == i); // duplicate removal
    if (inputNodes.length == 0) rawNodes.style.outlineColor = 'pink';
    else if (inputNodes.length > 1) rawNodes.style.outlineColor = 'lightgreen';
    else rawNodes.style.outlineColor = 'lightcoral';
    inMatrix(inputNodes.length > 1, true);
}
function inMatrix(passing = false, inChain = false) {
    let thisInput = rawAdj.value
    if (rawAdjType.value.startsWith('auto')) {
        //if (thisInput.split(/[,\n]/g)[0].trim().split().length == inputNodes.length) rawAdjType.value = 'auto0';
        if (rawAdj.value == '') rawAdjType.value = 'auto';
        else if (thisInput.split(/[,\n]/g)[0].trim().split(/[ \t]/g).length == 3) rawAdjType.value = 'auto1';
        else rawAdjType.value = 'auto0';
    }
    if (rawAdjType.value == 'array' || rawAdjType.value == 'auto1') thisInput = arrayToAdjMat();
    else if (rawAdjType.value == 'adjMat' || rawAdjType.value == 'auto0') thisInput = thisInput.split(/[,\n]/g)
    .map(e => e.split(/[ \t]/g))
    .map(e => e.filter(e => Number.isInteger(parseInt(e)))) // avoid errors for next map
    .map(e => e.map(e => parseInt(e)))
    .filter(e => e.length > 0) // remove empty rows

    // remove header columns and rows if present
    if (thisInput[0]?.length + 1 == thisInput[1]?.length) {
        thisInput.splice(0, 1);
        thisInput.map(e => e.shift());
    }
    inputAdj = thisInput;

    let passCondition = typeof inputAdj == 'object' && inputAdj.length == inputNodes.length && inputAdj.every(e => e.length == inputAdj[0].length) && inputAdj.every(e => e.every(e => Number.isInteger(e)));

    if (inputNodes.length == 0) rawAdj.style.outlineColor = 'pink';
    else if (passCondition) rawAdj.style.outlineColor = 'lightgreen';
    else rawAdj.style.outlineColor = 'lightcoral';

    if (!inChain) inRawNodes();
    else inSourceTarget(passing && passCondition, true);

}
function inSourceTarget(passing = false, inChain = false) {
    const SourceEmpty = rawSource.value == '';
    const TargetEmpty = rawTarget.value == '';
    const SourcePass = inputNodes.indexOf(rawSource.value) != -1 && !SourceEmpty;
    const TargetPass = inputNodes.indexOf(rawTarget.value) != -1 && !TargetEmpty;
    const unique = rawSource.value != rawTarget.value;
    // if all 3 good:
    // if passing, display matrix
    // if not passing and not in chain, loop
    // if not passing and matrix is displayed, hide it

    // otherwise
    // show feedback for specific ones
    // if matrix is displayed, hide it
    //console.log(SourcePass, TargetPass, unique, passing, inChain)

    if (SourcePass && TargetPass && unique) {
        inputSource = rawSource.value;
        inputTarget = rawTarget.value;
        rawSource.style.outlineColor = 'lightgreen';
        rawTarget.style.outlineColor = 'lightgreen';
        if (passing) displayMatrix();
        else {
            if (adjTypeOut.style.animationName == 'output_fadein') hideMatrix();
            if (!inChain) inRawNodes();
        }
    }
    else {
        if (adjTypeOut.style.animationName == 'output_fadein') hideMatrix();
        if (!unique && !SourceEmpty) { // both are the same and not empty
            rawSource.style.outlineColor = 'lightcoral';
            rawTarget.style.outlineColor = 'lightcoral';
        }
        else {
            if (SourcePass) {
                rawSource.style.outlineColor = 'lightgreen';
                inputSource = rawSource.value;
            }
            else if (!SourceEmpty) rawSource.style.outlineColor = 'lightcoral'
            else rawSource.style.outlineColor = 'pink';

            if (TargetPass) {
                rawTarget.style.outlineColor = 'lightgreen';
                inputTarget = rawTarget.value;
            }
            else if (!TargetEmpty) rawTarget.style.outlineColor = 'lightcoral'
            else rawTarget.style.outlineColor = 'pink';
        }
    }
}

// helpers
function isAlphaNumeric(str) {
    if (str.length == 0) return false;
    for (let i = 0; i < str.length; i++) {
        let code = str.charCodeAt(i);
        if (!(code > 47 && code < 59 || code > 64 && code < 91 || code > 96 && code < 123)) return false;
    }
    return true;
}
function hideMatrix() {
    adjTypeOut.style.animationName = 'output_fadeout';
    outputAdjMat.style.animationName = 'output_fadeout';

    outputMeta.style.animationName = 'output_fadeout';
    outputPath.style.animationName = 'output_fadeout';
    outputPathMeta.style.animationName = 'output_fadeout';
    outputTable.style.animationName = 'output_fadeout';
}
function displayMatrix() {
    outputAdjMat.innerHTML = '';
    adjTypeOut.style.animationName = 'output_fadein';
    outputAdjMat.style.animationName = 'output_fadein';
    // header row of node names
    let headerRow = document.createElement('tr');
    let blankCornerCell = document.createElement('th');
    headerRow.appendChild(blankCornerCell);
    for (let i = 0; i < inputNodes.length; i++) {
        let nodeName = document.createElement('th');
        nodeName.innerHTML = inputNodes[i];
        headerRow.appendChild(nodeName);
    }
    outputAdjMat.appendChild(headerRow);

    // rest of rows
    for (let i = 0, len = inputAdj.length; i < len; i++) {
        let dataRow = document.createElement('tr');
        let rowNodeName = document.createElement('th');
        rowNodeName.innerHTML = inputNodes[i];
        dataRow.append(rowNodeName);
        for (let j = 0; j < len; j++) {
            let dataCell = document.createElement('td');
            dataCell.innerHTML = inputAdj[i][j];
            dataRow.append(dataCell);
        }
        outputAdjMat.appendChild(dataRow);
    }

    beginCalculation();

}
function inFormatType() {
    let type = rawAdjType.value;
    if (type.startsWith("auto")) rawAdj.placeholder = adjInputTypes['auto'];
    else rawAdj.placeholder = adjInputTypes[type] ?? "No description provided.";
    inMatrix();
}
function toggleAdjMatVisibility(e) {
    if (outputAdjMat.style.display == 'none') {
        e.innerHTML = '(Hide)';
        outputAdjMat.style.display = 'block';
    }
    else {
        e.innerHTML = '(Show)';
        outputAdjMat.style.display = 'none';
    }
}

// input format conversion
function arrayToAdjMat(array = rawAdj.value.split(/[,\n]/g).map(e => e.trim().split(/[ \t]/g))) {

    let newAdj = [...Array(inputNodes.length)].map(() => Array(inputNodes.length).fill(0));
    for (let i = 0; i < array.length; i++) {
        let indexA = inputNodes.indexOf(array[i][0]) ?? i;
        let indexB = inputNodes.indexOf(array[i][1]);
        if (indexA == -1 || indexB == -1) continue;
        let weight = parseInt(array[i][2]);
        newAdj[indexA][indexB] = weight;
        newAdj[indexB][indexA] = weight;
    }
    return newAdj;
}

// autoinput
function autoInput(nodes, adj, source, target, format = 'auto') {
    rawNodes.value = nodes;
    rawAdj.value = adj;
    rawSource.value = source;
    rawTarget.value = target;
    rawAdjType.value = format;
    inRawNodes();
}


// wikipedia example, 1 > 3 > 6 > 5 (20)
//autoInput('1 2 3 4 5 6', '0 7 9 0 0 14, 7 0 10 15 0 0, 9 10 0 11 0 2, 0 15 11 0 6 0, 0 0 0 6 0 9, 14 0 2 0 9 0', '1', '5');

// youtube video example, A > D > E > C (7)
//autoInput('A B C D E', '0 6 0 1 0, 6 0 5 2 2, 0 5 0 0 5, 1 2 0 0 1, 0 2 5 1 0', 'A', 'C');

// own example, unable to complete
//autoInput('A B C', '0 2 0, 2 0 0, 0 0 0', 'A', 'C');

// youtube video example, but with different input format (matrix)
//autoInput('A B C D E', 'A D 1, A B 6, D B 2, D E 1, B E 2, B C 5, C E 5', 'A', 'C', 'auto');

// sams chungus test, 8 > 12 > 15 > 17 > 19 > 20 (9)
//autoInput('1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18 19 20', '1 2 1, 1 3 2, 1 4 5, 1 5 2, 2 6 3, 2 7 3, 3 7 1, 4 8 7, 5 8 2, 5 9 2, 6 7 1, 7 8 1, 8 9 1, 6 10 3, 6 11 2, 7 11 2, 8 12 2, 9 12 2, 9 13 3, 10 14 1, 11 14 1, 11 15 3, 12 15 1, 12 16 4, 13 16 1, 10 17 6, 14 17 2, 15 17 2, 16 17 2, 17 18 5, 17 19 3, 18 20 1, 19 20 1', '8', '20');

const test = {
    wikipedia: () => autoInput('1 2 3 4 5 6', '0 7 9 0 0 14, 7 0 10 15 0 0, 9 10 0 11 0 2, 0 15 11 0 6 0, 0 0 0 6 0 9, 14 0 2 0 9 0', '1', '5'),
    youtube: () => autoInput('A B C D E', '0 6 0 1 0, 6 0 5 2 2, 0 5 0 0 5, 1 2 0 0 1, 0 2 5 1 0', 'A', 'C'),
    unable: () => autoInput('A B C', '0 2 0, 2 0 0, 0 0 0', 'A', 'C'),
    chungus: () => autoInput('1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18 19 20', '1 2 1, 1 3 2, 1 4 5, 1 5 2, 2 6 3, 2 7 3, 3 7 1, 4 8 7, 5 8 2, 5 9 2, 6 7 1, 7 8 1, 8 9 1, 6 10 3, 6 11 2, 7 11 2, 8 12 2, 9 12 2, 9 13 3, 10 14 1, 11 14 1, 11 15 3, 12 15 1, 12 16 4, 13 16 1, 10 17 6, 14 17 2, 15 17 2, 16 17 2, 17 18 5, 17 19 3, 18 20 1, 19 20 1', '8', '20')
}

if (doNext) {
    test[doNext]()
}



/// Execution
async function beginCalculation() {
    var focussed = document.activeElement; // disabling loses focus

    rawAdj.disabled = true;
    rawNodes.disabled = true;
    rawSource.disabled = true;
    rawTarget.disabled = true;
    rawAdjType.disabled = true;

    outputPath.style.animationName = 'output_fadein';
    outputPath.innerHTML = '<span style="color: gray">Calculating Best Route</span>';
    let startTime = new Date().getTime();
    let dots = 1;
    let elapseTimeFunction = setInterval(() => {
        outputPath.innerHTML = `<span style="color: gray">Calculating Best Route.${".".repeat(dots)}</span>`;
        dots = (dots + 1) % 3;
    }, 1000);

    let nodeList = {}
    for (let i = 0; i < inputNodes.length; i++) {
        nodeList[inputNodes[i]] = {
            node: inputNodes[i],
            tentativeDistance: Number.MAX_SAFE_INTEGER,
            prevVertex: null,
            visited: false
        }
    }
    nodeList[inputSource].tentativeDistance = 0;

    //if (verbose) console.log('Beginning traversal...');

    let response = await graphTraverse(nodeList, nodeList[inputSource]);

    //if (verbose) console.log('Traversal completed!');

    let timeTaken = new Date().getTime() - startTime;

    let visitedNodes = [];
    if (typeof response === 'object') visitedNodes = Object.values(response).filter(e => e.visited == true);
    clearInterval(elapseTimeFunction);
    rawAdj.disabled = false;
    rawNodes.disabled = false;
    rawSource.disabled = false;
    rawTarget.disabled = false;
    rawAdjType.disabled = false;
    focussed.focus();
    outputMeta.style.animationName = 'output_fadein';
    outputMeta.innerHTML = `Visited ${visitedNodes.length} of ${inputNodes.length} nodes in ${(timeTaken/1000).toExponential(1)}s`;

    if (typeof response !== 'object') { // error catching
        outputPath.innerHTML = `<span style="color: lightcoral">${response}</span>`;
        return;
    }

    if (response[inputTarget].prevVertex === null) { // unable to reach target
        outputPath.innerHTML = `<span style="color: lightcoral">Target is unreachable.</span>`;
        console.log(response);
        return;
    }

    let {path, weight} = await traceBack(nodeList, nodeList[inputSource], nodeList[inputTarget])
    let bestPath = path[0]
    for (let i = 1; i < path.length; i++) {
        bestPath += '→' + path[i];
    }
    outputPath.innerHTML = bestPath;
    outputPathMeta.style.animationName = 'output_fadein';
    outputPathMeta.innerHTML = `${path.length} Nodes, ${weight[weight.length - 1]} Total Weight`;

    // table creation
    outputTable.innerHTML = '';
    outputTable.style.animationName = 'output_fadein';

    // header
    let tr = document.createElement('tr');
    let th1 = document.createElement('th');
    th1.innerHTML = 'Node';
    tr.appendChild(th1);
    let th2 = document.createElement('th');
    th2.innerHTML = 'Weight';
    tr.appendChild(th2);
    let th3 = document.createElement('th');
    th3.innerHTML = 'From';
    tr.appendChild(th3);
    outputTable.appendChild(tr);

    for (let i = 0; i < inputNodes.length; i++) {
        let row = document.createElement('tr');
        let d1 = document.createElement('td');
        let d2 = document.createElement('td');
        let d3 = document.createElement('td');
        d1.innerHTML = response[inputNodes[i]].node
        let myDist = response[inputNodes[i]].tentativeDistance
        if (myDist == Number.MAX_SAFE_INTEGER) myDist = '∞';
        d2.innerHTML = myDist;
        d3.innerHTML = response[inputNodes[i]].prevVertex;
        row.appendChild(d1);
        row.appendChild(d2);
        row.appendChild(d3);
        outputTable.appendChild(row);
    }

}

function graphTraverse(nodeList, currentNode, n = 0) {
    return new Promise(resolve => {

        n++;
        if (n == maxAttempts) { // limit
            resolve(`Max attempts hit (${maxAttempts})`);
            return;
        }
        let unvisitedNeighbours = getUnvisitedNeighbours(nodeList, currentNode.node);
        if (unvisitedNeighbours.length == 0) { // no unvisited neighbouring nodes left
            currentNode.visited = true;
            let unvisitedNonNeighbours = Object.values(nodeList).filter(e => !e.visited);
            if (unvisitedNonNeighbours.length > 0) { // go to best unvisited node if it exists
                let bestNonNeighbour = unvisitedNonNeighbours.sort((a, b) => a.tentativeDistance - b.tentativeDistance)[0];
                resolve(graphTraverse(nodeList, bestNonNeighbour, n));
                return;
            } // otherwise all nodes are visited, algorithm is done
            resolve(nodeList);
            return;
        }
        unvisitedNeighbours.forEach(e => { // update (unvisited) neighbours tenative distance if shorter
            let oldTenativeDistance = nodeList[e.node].tentativeDistance;
            let newTenativeDistance = currentNode.tentativeDistance + e.weight;
            if (newTenativeDistance < oldTenativeDistance) {
                nodeList[e.node].tentativeDistance = newTenativeDistance;
                nodeList[e.node].prevVertex = currentNode.node;
            }
        });
        currentNode.visited = true;
        
        resolve(graphTraverse(nodeList, nodeList[Object.values(nodeList).filter(e => !e.visited).sort((a, b) => a.tentativeDistance - b.tentativeDistance)[0].node], n)); // set unvisited neighbour with lowest tenative distance as current, go again
        return;
    });
}
function getUnvisitedNeighbours(nodeList, currentNode) {
    // return arrays of objects with formatting {node: nodeA, weight: 7}

    return inputAdj[inputNodes.indexOf(currentNode)]
    .map((e, i) => {
        return {
            node: inputNodes[i],
            weight: e
        }
    })
    .filter(e => e.weight > 0)
    .filter(e => e.node != currentNode)
    .filter(e => !nodeList[e.node].visited);
}
function traceBack(nodeList, nodeA, nodeB, output = {path: [], weight: []}) {
    return new Promise(resolve => {
        output.path.push(nodeB.node);
        output.weight.push(nodeB.tentativeDistance);
        if (nodeB.node !== nodeA.node) resolve(traceBack(nodeList, nodeA, nodeList[nodeB.prevVertex], output));
        else {
            output.path.reverse();
            output.weight.reverse();
            resolve(output)
        };
    })    
}