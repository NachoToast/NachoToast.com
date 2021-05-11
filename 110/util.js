var outputs = document.getElementsByClassName("output"),
util_element = document.getElementById("input_util"),
wait_element = document.getElementById("input_waittime");

function calculate() {
    let util_r = util_element.value,
    wait_r = wait_element.value;
    if (util_r.length < 1 || wait_r.length < 1) return;
    let util = parseInt(util_element.value),
    wait = parseInt(wait_element.value);
    if (util < 1 || util > 100 || wait < 0 || wait > 100) return;
    let wait_d = wait/100,
    util_d = util/100,
    lhs = (100 - util) / 100,
    logged = Math.log(lhs) / Math.log(wait_d);
    outputs[0].innerHTML = `<span style="color: gray">Formula:</span> 1 - <span style='color: aquamarine'>${wait_d}</span><sup><span style='color: pink'>n</span></sup> >= <span style='color: lightgreen'>${util_d}</span>`;
    outputs[1].innerHTML = `<span style="color: gray">Rearranged:</span> 1 - <span style='color: lightgreen'>${util_d}</span> >= <span style='color: aquamarine'>${wait_d}</span><sup><span style='color: pink'>n</span></sup>`;
    outputs[2].innerHTML = `<span style="color: gray">Simplified:</span> <span style='color: lightgreen'>${lhs}</span> >= <span style='color: aquamarine'>${wait_d}</span><sup><span style='color: pink'>n</span></sup>`;
    outputs[3].innerHTML = `<span style="color: gray">Take Logarithm:</span> log<sub><span style='color: aquamarine'>${wait_d}</span></sub>(<span style='color: lightgreen'>${lhs}</span>) <= <span style='color: pink'>n</span>`;
    outputs[4].innerHTML = `<span style="color: gray">Solve:</span> <span style='color: lightgreen'>${logged.toFixed(4)}...</span> <= <span style='color: pink'>n</span>`;
    outputs[5].innerHTML = `<span style='color: pink'>n</span> = ${Math.ceil(logged)}`;
}