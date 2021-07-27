const outputs = document.getElementsByClassName('output');

const alphabet = 'abcdefghjklmnpqrstuvwxyz';

function calculate_nhi(input) {
    if (input.length < 6 || input.length > 7) return;
    let score = 11;
    outputs[1].innerHTML = '';

    // letters
    for (let i = 0; i < 3; i++) {
        const index = alphabet.indexOf(input[i].toLowerCase()) + 1;
        if (index == 0) {
            outputs[0].innerHTML = `Invalid character: ${input[i]}`;
            return;
        }
        //console.log(`Did ${7 - i} x ${index} for ${input[i]}`);
        score -= (7 - i) * index;
    }

    // numbers
    for (let i = 3; i < 6; i++) {
        const num = parseInt(input[i]);
        if (!Number.isInteger(num)) {
            outputs[0].innerHTML = `Invalid character: ${input[i]}`;
            return;
        }
        //console.log(`Did ${7 - i} x ${num} for ${input[i]}`);
        score -= (7 - i) * num;
    }

    outputs[0].innerHTML = `Sum: ${score}`;
    score = ((score % 11) + 11) % 11;
    outputs[1].innerHTML = `Final Digit: ${score}`;
}
