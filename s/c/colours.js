const output = document.getElementById('output');
const canvas = document.getElementById('canvas');
const info = document.getElementById('info');
const info_sort = document.getElementById('output_sort_type');
const extra_info = document.getElementById('extra_info');
const colour_count_output = document.getElementById('colour_count');
const ctx = canvas.getContext('2d');
const palette_options = document.getElementById('palette_options');
const palette_input = document.getElementById('palette_input');
const palette_output = document.getElementById('palette_output');
const canvas2 = document.getElementById('palette_export');
const ctx2 = canvas2.getContext('2d');
const export_options = document.getElementById('export_options');
const palette = document.getElementById('palette');
const heading = document.getElementById('heading');
const export_dim_inputs = document.getElementsByClassName('stop_ar');

var dimensions = {};
var colour_info = {};
var total_pixels = 0;
var sort_state = 'default';
var presorts = {};

var initial_upload = true;
var initial_palette = true;

var stored_palette = [];
var export_width = 1;
var export_height = 1;

var page = 0;
var per_page = 20;
var page_count = 0;

var sort_dict = {
    'default': 'Default',
    'percent': 'Percentage',
    'percent2': 'Percentage (Inverse)',
    'colour_diff': 'Colour Difference',
}
var sort_keys = Object.keys(sort_dict);
var per_page_options = [10, 20, 30, 50, 100];

var palette_colours = 3;
var making_palette = false;

function upload_image(image) {
    if (image === undefined) return;
    let start = new Date().getTime();
    if (initial_upload) {
        canvas.style.display = 'block';
        colour_count_output.style.display = 'block';
        info.style.display = 'block';
        initial_upload = false;
        palette_options.style.display = 'flex';
        heading.innerHTML = 'Image Colour Info';
        if (window.outerWidth >= 1024) {
            extra_info.style.display = 'flex';
        }
    }
    else {
        sort_state = 'default';
        presorts = {};
        dimensions = {};
        palette.style.display = 'none';
        initial_palette = true;
        making_palette = false;
        palette_output.style.display = 'none';
        canvas2.style.display = 'none';
        export_options.style.display = 'none';
    }
    let reader = new FileReader();
    reader.onload = function(e) {
        // load image onto canvas
        var canvas_img = new Image();
        canvas_img.addEventListener('load', function() {
            dimensions.width = canvas_img.width;
            dimensions.height = canvas_img.height;
            canvas.setAttribute('width', canvas_img.width);
            canvas.setAttribute('height', canvas_img.height);
            ctx.drawImage(canvas_img, 0, 0);
            let data = ctx.getImageData(0, 0, canvas_img.width, canvas_img.height).data;
            let colours_information = {};
            total_pixels = data.length / 4;

            for (let i = 0, len = data.length; i < len; i += 4) {
                let hex = rgb_to_hex(data[i], data[i + 1], data[i + 2]);
                if (hex in colours_information) {
                    colours_information[hex] += 1;
                }
                else colours_information[hex] = 1;
            }

            page = 0;
            let keys = Object.keys(colours_information);
            page_count = Math.ceil(keys.length / per_page) - 1;
            presorts["default"] = keys;
            colour_count_output.innerHTML = `${keys.length} Unique Colours (${Math.ceil(Math.log2(keys.length))}bpp)<br><span style='color: gray'>Processed ${total_pixels.toExponential(5)} pixels in ${new Date().getTime() - start}ms (${((new Date().getTime() - start)/total_pixels).toExponential(1)}ms each)</span>`;
            colour_info = colours_information;
            palette_colours = Math.min(presorts['default'].length, 3);
            palette_input.value = palette_colours;
            generate_unique_colour_elements();
            update_info();
        })
        canvas_img.src = e.target.result;
    }
    reader.readAsDataURL(image);
}

// Page
function update_info() {
    info.innerHTML = `Page <span class='sort' onclick='change_page("+")'>${page + 1}</span> of <span class='sort' onclick='change_page("++")'>${page_count + 1}</span> | Displaying <span class='sort' onclick='change_per_page()'>${per_page}</span> colours per page | Sorting by <span class='sort' onclick='change_sort_type()'>${sort_dict[sort_state]}</span>`;
    info_sort.innerText = `${sort_dict[sort_state]}`;
}
function change_page(type = "+") {
    if (type == "+") var attempted_page = page + 1;
    else if (type == "++") var attempted_page = page_count;
    else var attempted_page = page - 1;
    if (attempted_page > page_count) attempted_page = 0;
    else if (attempted_page < 0) attempted_page = page_count;
    page = attempted_page;
    generate_unique_colour_elements();
    update_info();
}
function change_per_page(type = "+") {
    let current = per_page_options.indexOf(per_page);
    if (type == "+") var attempted = current + 1;
    else var attempted = current - 1;
    if (attempted >= per_page_options.length) attempted = 0;
    else if (attempted < 0) attempted = per_page_options.length - 1;
    per_page = per_page_options[attempted];
    page_count = Math.ceil(presorts[sort_state].length / per_page) - 1;
    //page = Math.min(page, page_count);
    page = 0;

    generate_unique_colour_elements();
    update_info();
}
window.addEventListener('keydown', function(e) {
    if (initial_upload) return;
    if (document.activeElement.className == 'stop_ar') {
        if (e.key == 'Enter') {
            if (document.activeElement.id != 'palette_input') export_palette_to_png();
            else generate_palette();
            e.preventDefault();
        }  
        return;
    }
    else if (e.key == 'ArrowLeft') {
        change_page("-");
        e.preventDefault();
    }
    else if (e.key == 'ArrowRight') {
        change_page("+");
        e.preventDefault();
    }
    else if (e.key == "ArrowUp") {
        change_per_page("+");
        e.preventDefault();
    }
    else if (e.key == "ArrowDown") {
        change_per_page("-");
        e.preventDefault();
    }
    else if (e.key == " ") {
        change_sort_type("+");
        e.preventDefault();
    }
    else if (e.key == "Enter" && palette_options.style.display === 'flex') {
        generate_palette();
        e.preventDefault();
    }
});

// Colour List Generation
function generate_unique_colour_elements() {
    output.innerHTML = ``;
    for (let i = page * per_page, len = i + Math.min(presorts[sort_state].length - i, per_page); i < len; i++) {
        let d = document.createElement('div');
        d.classList.add('colour');
        let d2 = document.createElement('div');
        let colour = presorts[sort_state][i];
        d2.style.backgroundColor = colour;
        d.appendChild(d2);
        let p = document.createElement('p');
        p.innerHTML = colour;
        d.appendChild(p);
        let p2 = document.createElement('p');
        p2.innerHTML = `<span class='noselect'> (${(100 * colour_info[presorts[sort_state][i]]/total_pixels).toFixed(0)}%)</span>`;
        d.appendChild(p2);
        output.appendChild(d);
    }
}
function rgb_to_hex(r, g, b) {
    return "#" + component_to_hex(r) + component_to_hex(g) + component_to_hex(b);  
}
function component_to_hex(c) {
    let hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

// Colour Sorting
async function change_sort_type(type = "+") {
    if (type == "+") var attempted = sort_keys.indexOf(sort_state) + 1;
    else var attempted = sort_keys.indexOf(sort_state) - 1;
    if (attempted >= sort_keys.length) attempted = 0;
    else if (attempted < 0) attempted = sort_keys.length - 1;
    sort_state = sort_keys[attempted];

    if (presorts[sort_state] === undefined) await do_sort();
    generate_unique_colour_elements();
    update_info();
}
async function do_sort() {
    return new Promise(resolve => {
        console.log(`Doing new sort: ${sort_state}`);
        if (sort_state === 'percent') presorts[sort_state] = [...presorts['default']].sort((a, b) => colour_info[b] - colour_info[a]);
        else if (sort_state === 'percent2') presorts[sort_state] = [...presorts['default']].sort((a, b) => colour_info[a] - colour_info[b]);
        else if (sort_state === 'colour_diff') {
            sort_colour_difference([...presorts['default']]);
        }
        resolve();
    });
}
function sort_colour_difference(arr) {
    return new Promise (resolve => {
        presorts['colour_diff'] = arr.sort((a ,b) => colour_difference(a, b));
        resolve();
    });
}
function colour_difference(a, b) {
    let a_rgb = hex_to_rgb(a),
    b_rgb = hex_to_rgb(b);
    result = 0;
    for (let i = 0; i < a_rgb.length; i++) {
        result += (a_rgb[i] + b_rgb[i]) * (a_rgb[i] - b_rgb[i]);
    }
    return result;
}
function hex_to_rgb(hex) {
    return [parseInt(hex.substring(1, 3), 16), parseInt(hex.substring(3, 5), 16), parseInt(hex.substring(5), 16)];
}

// Palette Generation
async function generate_palette() {
    if (typeof palette_colours !== 'number' || palette_colours < 3 || making_palette) return;
    if (palette_colours > presorts[sort_state].length) {
        window.alert(`Cannot make palette out of more than ${presorts[sort_state].length} colours.`);
        return;
    }
    if (palette_colours > 1000 && !window.confirm(`Generating such a large palette can cause lag!`)) return;

    if (initial_palette) {
        palette.style.display = 'flex';
        window.scrollTo(0, window.innerHeight);
        canvas2.style.display = 'block';
        export_options.style.display = 'block';
        ctx2.clearRect(0, 0, canvas2.width, canvas2.height);
        stored_palette = [];
    }
    making_palette = true;
    let start = new Date().getTime();
    let dots = 0;
    let a = setInterval(function() {
        dots += 1;
        if (dots > 3) dots = 1;
        palette_output.innerHTML = `Loading Palette: Creating Colours Array${".".repeat(dots)} (${Math.round((new Date().getTime() - start) / 1000)}s)`;
    }, 1000);
    let new_palette = await actually_generate_palette(parseInt(palette_colours), presorts[sort_state], sort_state);
    clearInterval(a);
    dots = 0;
    palette_output.innerHTML = `Loading Palette: Colours Array Done (${Math.round((new Date().getTime() - start) / 1000)})`;
    let b = setInterval(function() {
        dots += 1;
        if (dots > 3) dots = 1;
        palette_output.innerHTML = `Loading Palette: Displaying Colours Array${".".repeat(dots)} (${Math.round((new Date().getTime() - start) / 1000)}s)`;
    }, 1000);
    await display_palette(new_palette);
    clearInterval(b);
    palette_output.innerHTML = `Loading Palette: <span style='color:lightgreen'>Done!</span> (${Math.round((new Date().getTime() - start) / 1000)}s)<br>Current Palette is ${new_palette.length} colours sorted by ${sort_dict[sort_state].toLowerCase()}.`;
    stored_palette = new_palette;
    making_palette = false;

    let max_dim = Math.floor(Math.sqrt(palette_colours));
    export_height = max_dim;
    export_width = max_dim;
    export_dim_inputs[1].value = export_width;
    export_dim_inputs[2].value = export_height;

    preview_png();
}
function actually_generate_palette(num, arr, type) {
    return new Promise (resolve => {
        let step = Math.floor(arr.length / num);
        if (type === 'percent' || type === 'percent2') step = 1; // percent/percent2 don't pick at regular intervals, instead only chose first X
        let output = [];
        for (let i = 0, len = arr.length; i < len && output.length < num; i += step) {
            output.push(arr[i]);
        }
        resolve(output);
    });
}
function display_palette(new_palette) {
    return new Promise (resolve => {
        palette.innerHTML = '';
        for (let i = 0, len = new_palette.length; i < len; i++) {
            let d = document.createElement('div');
            d.classList.add('p_colour');
            let d2 = document.createElement('div');
            d2.style.backgroundColor = new_palette[i];
            d.appendChild(d2);
            let p = document.createElement('p');
            p.innerHTML = new_palette[i].substring(1);
            d.appendChild(p);
            palette.appendChild(d);
        }
        resolve();
    })
}

// Palette Exporting
function change_export_dimensions(me, type = 0) {
    if (me.value === "") return;
    let dim = Number(me.value);
    if (!Number.isInteger(dim) || dim < 1 || type == 0 && dim * export_height > stored_palette.length || type == 1 && dim * export_width > stored_palette.length) {
        if (type == 0) me.value = export_width;
        else me.value = export_height;
        return;
    }
    if (type == 0) export_width = dim;
    else export_height = dim;
    me.style.width = `${Math.max(me.value.toString().length, 1) * 12 + 31}px`;
    preview_png();
}
function preview_png() {
    canvas2.style.width = export_width * 50 + 'px';
    canvas2.style.height = export_height * 50 + 'px';
    canvas2.width = export_width * 50;
    canvas2.height = export_height * 50;
    draw_canvas2();
}
function draw_canvas2() {
    for (let i = 0, n = 0; i < export_height; i++) { // per row
        for (let j = 0; j < export_width; j++, n++) { // per column
            let x = j * 50,
                y = i * 50;
            ctx2.beginPath();
            ctx2.rect(x, y, 50, 50);
            ctx2.fillStyle = stored_palette[n];
            ctx2.fill();
        }
    }
}
async function export_palette_to_png() {
    // stored_palette: array of hex colour values
    // export_width: px width
    // export_height: px height
    console.log('Exporting!');

    let a = document.createElement("a");
    a.href = canvas2.toDataURL();
    a.download = 'palette.png';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}