outputs = document.getElementsByClassName("output");

function calculate_float(input) {

    if (!input.length > 0) return;
    // binary conversion
    binary_input = parseFloat(input).toString(2);
    if (binary_input[0] == "-") {var negative = true, sign = "-"; binary_input.substring(1)}
    else var negative = false, sign = "";
    binary_input = Math.abs(binary_input).toString();

    if (binary_input.length > 9) {
        outputs[0].innerHTML = `${input} in binary is ${sign}<span style='color: aquamarine'>${binary_input.substring(0, 10)}</span> <span style='color: lightcoral' title='Cannot express in a finite number of bits.'>[Rounded]</span>`;
    } else outputs[0].innerHTML = `${input} in binary is ${sign}<span style='color: aquamarine'>${binary_input}</span>`;

    // standard form conversion
    standard_input = binary_input;
    var exponent = 0,
    decimal_point_index = standard_input.indexOf(".");

    if (standard_input == "0") exponent = 0;
    else if (parseFloat(standard_input) < 1 && decimal_point_index != -1) { // cases like 0.01, 0.625 [small floats]
        let decimal_string = standard_input.substring(decimal_point_index + 1),
        end_index = decimal_string.indexOf("1");
        if (end_index != -1) decimal_string = decimal_string.substring(0, end_index);
        exponent = -decimal_string.length;
    }
    else if (decimal_point_index != -1) { // cases like 101.1, 100111.1 [large floats]
            let nondecimal_string = standard_input.substring(0, decimal_point_index);
            exponent = nondecimal_string.length;
    } else exponent = standard_input.length; // cases like 101, 1, 1100 [ints]

    if (decimal_point_index != -1) standard_input = standard_input.substring(0, decimal_point_index) + standard_input.substring(decimal_point_index + 1);
    if (standard_input.indexOf("1") != -1) standard_input = standard_input.substring(standard_input.indexOf("1"));
    if (standard_input.length > 9) {standard_input = standard_input.substring(0, 10); var rounded = "<span style='color: lightcoral' title='Cannot express accurately in 9 bits.'>[Rounded]</span>"}
    else var rounded = "";
    outputs[1].innerHTML = `In standard form .<span style='color: aquamarine'>${standard_input}</span> x 2<sup style='color: lightgreen'>${exponent}</sup> ${rounded}`;
   
    // showing individual components
    if (negative) var mantissa_sign = "1";
    else var mantissa_sign = "0";
    outputs[2].innerHTML = `Sign of Mantissa<br><span style='color: pink'>${mantissa_sign}</span>`;

    if (standard_input.length < 9) var mantissa = (standard_input + "00000000").substring(0, 9);
    else var mantissa = standard_input;
    outputs[3].innerHTML = `Mantissa<br><span style='color: aquamarine'>${mantissa}</span>`;

    if (exponent < 0) var exponent_sign = "1";
    else var exponent_sign = "0";
    outputs[4].innerHTML = `Sign of Exponent<br><span style='color: yellow'>${exponent_sign}</span>`;

    if (exponent < 0) exponent = exponent.toString(2).substring(1);
    if (exponent.toString().length < 5) {var exponent = "0000" + exponent.toString(2); exponent = exponent.substring(exponent.length - 5)}
    else var exponent = exponent.toString();
    outputs[5].innerHTML = `Exponent<br><span style='color: lightgreen'>${exponent}</span>`;

    // combined
    var combined = mantissa_sign + mantissa + exponent_sign + exponent,
    nibble1 = combined.substring(0, 4),
    nibble2 = combined.substring(4, 8),
    nibble3 = combined.substring(8, 12),
    nibble4 = combined.substring(12),
    n = [n1 = parseInt(nibble1, 2), parseInt(nibble2, 2), parseInt(nibble3, 2), parseInt(nibble4, 2)];

    outputs[6].innerHTML = `${combined}<br><span style='color: pink'>${nibble1}</span> <span style='color: aquamarine'>${nibble2}</span> <span style='color: yellow'>${nibble3}</span> <span style='color: lightgreen'>${nibble4}</span><br><span style='padding: 0 10px; color: pink'>${n[0]}</span> <span style='padding: 0 10px; color: aquamarine'>${n[1]}</span> <span style='padding: 0 10px; color: yellow'>${n[2]}</span> <span style='padding: 0 10px; color: lightgreen'>${n[3]}</span>`;

    // final outputs
    const hex = ["A", "B", "C", "D", "E", "F"];
    var final = [];
    for (let i = 0; i < n.length; i++) {
        if (n[i] >= 10) {
            n[i] -= 10;
            final += hex[n[i]];
        }
        else final += n[i];
    }

    outputs[7].innerHTML = `${final[0]} ${final[1]} ${final[2]} ${final[3]}`;
}