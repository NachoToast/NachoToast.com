const outputs = document.getElementsByClassName('output');
const alphabets = {
    English: {
        chars: [
            'a',
            'b',
            'c',
            'd',
            'e',
            'f',
            'g',
            'h',
            'i',
            'j',
            'k',
            'l',
            'm',
            'n',
            'o',
            'p',
            'q',
            'r',
            's',
            't',
            'u',
            'v',
            'w',
            'x',
            'y',
            'z',
        ],
        vowels: ['a', 'e', 'i', 'o', 'u'],
    },
    Korean: {
        chars: [
            'ㄱ',
            'ㄴ',
            'ㄷ',
            'ㄹ',
            'ㅁ',
            'ㅂ',
            'ㅅ',
            'ㅇ',
            'ㅈ',
            'ㅊ',
            'ㅋ',
            'ㅌ',
            'ㅍ',
            'ㅎ',
            'ㅏ',
            'ㅑ',
            'ㅓ',
            'ㅕ',
            'ㅗ',
            'ㅛ',
            'ㅜ',
            'ㅠ',
            'ㅡ',
            'ㅣ',
        ],
        vowels: ['ㅏ', 'ㅑ', 'ㅓ', 'ㅕ', 'ㅗ', 'ㅛ', 'ㅜ', 'ㅠ', 'ㅡ', 'ㅣ'],
    },
};
/*
const alphabets[chosen_language].chars = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
const k_alphabet = ['ㄱ', 'ㄴ', 'ㄷ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅅ', 'ㅇ', 'ㅈ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ', 'ㅏ', 'ㅑ', 'ㅓ', 'ㅕ', 'ㅗ', 'ㅛ', 'ㅜ', 'ㅠ', 'ㅡ', 'ㅣ'];
const k_vowels = ['ㅏ', 'ㅑ', 'ㅓ', 'ㅕ', 'ㅗ', 'ㅛ', 'ㅜ', 'ㅠ', 'ㅡ', 'ㅣ'];
const alphabets[chosen_language].vowels = ['a', 'e', 'i', 'o', 'u'];
*/
var encode = false;
var chosen_language = 'English';
const input = document.getElementById('input_string');

function dothing(input_string = input.value) {
    if (chosen_language == 'Korean') input_string = input_string.replace('ㅆ', 'ㅅㅅ');
    if (input_string.length < 1) return;
    input_string = input_string.toLowerCase();
    let most_vowels = [0, 0];
    for (let j = 1; j < alphabets[chosen_language].chars.length; j++) {
        let decoded = '';
        for (let i = 0; i < input_string.length; i++) {
            if (alphabets[chosen_language].chars.indexOf(input_string[i]) == -1) {
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
    if (!encode)
        outputs[most_vowels[1]].innerHTML = `<span style='color:lightgreen'>${
            outputs[most_vowels[1]].innerHTML
        }</span>`;
}

function shift(letter, amount) {
    let index = alphabets[chosen_language].chars.indexOf(letter) - amount;
    if (index < 0) index = alphabets[chosen_language].chars.length + index;
    else if (index > alphabets[chosen_language].chars.length - 1)
        index = index - alphabets[chosen_language].chars.length;
    return alphabets[chosen_language].chars[index];
}

function get_coolness(string) {
    let coolness = 0;
    for (let i = 1; i < string.length - 1; i++) {
        if (string[i] == ' ' && alphabets[chosen_language].vowels.indexOf(string[i - 1]) == -1)
            coolness += 1;
        if (string[i] == ' ' && alphabets[chosen_language].vowels.indexOf(string[i + 1]) == -1)
            coolness += 1;
        if (
            string[i] == ' ' &&
            alphabets[chosen_language].vowels.indexOf(string[i + 1]) !== -1 &&
            alphabets[chosen_language].vowels.indexOf(string[i - 1]) !== -1
        )
            coolness += 3;
        if (alphabets[chosen_language].vowels.indexOf(string[i]) == -1) continue;
        coolness += 1;
        if (alphabets[chosen_language].vowels.indexOf(string[i - 1] == -1)) coolness += 1;
        if (alphabets[chosen_language].vowels.indexOf(string[i + 1]) == -1) coolness += 1;
    }
    return coolness;
}
