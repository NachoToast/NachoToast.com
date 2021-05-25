const outputs = document.getElementsByClassName('output');
const alphabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
const vowels = ['a', 'e', 'i', 'o', 'u'];
var encode = false;
const input = document.getElementById("input_string");

function dothing(input_string = input.value) {
    if (input_string.length < 1) return;
    input_string = input_string.toLowerCase();
    most_vowels = [0, null];
    for (let j = 1; j < 26; j++) {
        let decoded = "";
        for (let i = 0; i < input_string.length; i++) {
            if (!input_string[i].match(/[a-z]/i)) {
                decoded += input_string[i];
                continue;
            }
            if (encode) decoded += shift(input_string[i], -j);
            else decoded += shift(input_string[i], j);
        }
        let my_vowel_count = get_coolness(decoded);
        if (my_vowel_count > most_vowels[0]) {
            most_vowels = [my_vowel_count, j];
        }
        outputs[j].innerHTML = `${j}: ${decoded}`;
    }
    if (!encode) outputs[most_vowels[1]].innerHTML = `<span style='color:lightgreen'>${outputs[most_vowels[1]].innerHTML}</span>`;
}


function shift(letter, amount) {
    let index = alphabet.indexOf(letter) - amount;
    if (index < 0) index = 26 + index;
    else if (index > 25) index = index - 26;
    return alphabet[index];
}

function get_coolness(string) {
    let coolness = 0;
    for (let i = 1; i < string.length - 1; i++) {
        if (string[i] == " " && vowels.indexOf(string[i - 1]) == -1) coolness += 1;
        if (string[i] == " " && vowels.indexOf(string[i + 1]) == -1) coolness += 1;
        if (string[i] == " " && vowels.indexOf(string[i + 1]) !== -1 && vowels.indexOf(string[i - 1]) !== -1) coolness += 3;
        if (vowels.indexOf(string[i]) == -1) continue;
        coolness += 1;
        if (vowels.indexOf(string[i - 1] == -1)) coolness += 1;
        if (vowels.indexOf(string[i + 1]) == -1) coolness += 1;
    }
    return coolness;
}