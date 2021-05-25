var encode = false;
var zero_index = true;
const input_string = document.getElementById("input_string");
const input_matrix = document.getElementById("input_matrix");
const output_matrix = document.getElementById("output_matrix");
const alphabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
const outputs = document.getElementsByClassName("output");

function dothing(str = input_string.value.toLowerCase(), mat = input_matrix.value.split(" ")) {
    for (let i = 0; i < outputs.length; i++) {
        outputs[i].innerHTML = "";
    }
    if (mat.length != 4 || mat.some(e => isNaN(parseInt(e)))) return;
    var displays = 0;
    if (!encode) {
        var out_mat = decode_matrix(mat);
        outputs[0].innerHTML = `Decoding Matrix:${out_mat.map(e => ` ${e}`)}`;
        displays += 1;
    }
    if (str.length < 1) return;
    var enc_str = encode_string(str);
    if (enc_str.length % 2 != 0) {
        outputs[displays].innerHTML = `Invalid input string.`;
        return;
    }
    outputs[displays].innerHTML = `Encoded String: ${enc_str.map(e => ` ${e}`)}`;
    // diffused string
    if (!encode) var diff_str = diffuse_string(enc_str, out_mat);
    else var diff_str = diffuse_string(enc_str, mat);
    outputs[displays + 1].innerHTML = `Diffused String: ${diff_str.map(e => ` ${e}`)}`;
    // modulo
    let wrap_str = wrap_string(diff_str);
    outputs[displays + 2].innerHTML = `Wrapped String: ${wrap_str.map(e => ` ${e}`)}`;
    // decode
    let dec_str = decode_string(wrap_str);
    let output = "";
    for (let i = 0; i < dec_str.length; i++) output += dec_str[i];
    outputs[displays + 3].innerHTML = `Decoded String: ${output.toUpperCase()}`;
}




function decode_matrix(input, modulo = true) {
    // flip a d
    let temp = parseInt(input[0]);
    input[0] = parseInt(input[3]);
    input[3] = temp;
    // neg b c
    input[1] = -input[1];
    input[2] = -input[2];
    // divide by determinant
    let det = input[0] * input[3] - input[1] * input[2];
    input = input.map(e => e/det);
    if (modulo) input = input.map(e => (e < 0) ? 26 + e : e);
    return input;
}

function encode_string(str) {
    let encoded = [];
    for (let i = 0; i < str.length; i++) {
        let ind = alphabet.indexOf(str[i]);
        if (!zero_index) ind += 1;
        encoded.push(ind);
    }
    return encoded;
}

function diffuse_string(enc_str, mat) {
    console.log(enc_str, mat);
    out_str = new Array(enc_str.length);
    for (let i = 0; i < enc_str.length; i += 2) {
        //console.log(`${enc_str[i]} * ${mat[0]} + ${enc_str[i + 1]} * ${mat[2]}`);
        out_str[i] = enc_str[i] * mat[0] + enc_str[i + 1] * mat[2];
        //console.log(`${enc_str[i]} * ${mat[1]} + ${enc_str[i + 1]} * ${mat[3]}`);
        out_str[i + 1] = enc_str[i] * mat[1] + enc_str[i + 1] * mat[3];
    }
    return out_str;
}

function wrap_string(str) {
    for (let i = 0; i < str.length; i++) {
        str[i] = str[i] % 26;
    }
    return str;
}

function decode_string(str) {
    for (let i = 0; i < str.length; i++) {
        if (!zero_index) str[i] = alphabet[str[i] - 1];
        else str[i] = alphabet[str[i]];
    }
    return str;
}