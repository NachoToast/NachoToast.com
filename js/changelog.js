const now = new Date().getTime(),
day = 86400000;

var loaded_github_changes = [],
changelog = document.getElementById("changelog_container_2"),
changelog_2 = document.getElementById("changelog_container");
github_search_params = {
    page: 1,
    per_page: 100,
    since: new Date(now - 30 * day).toISOString()
}

function make_ajax_request(args) {
    return new Promise(function (resolve, reject) {
        let xhr = new XMLHttpRequest();
        if (args.params) args.url = paramater_encoder(args.url, args.params);
        xhr.open(args.method, args.url);
        xhr.onload = function() {
            if (this.status >= 200 && this.statusText < 300) resolve(xhr.response);
            else {
                reject({
                        status: this.status,
                        statusText: xhr.statusText
                    })
            }
        };
        xhr.onerror = function() {
            reject({
                status: this.status,
                statusText: xhr.statusText
            })
        };
        if (args.headers) {
            Object.keys(args.headers).forEach(function (key) {
                xhr.setRequestHeader(key, args.headers[key]);
            })
        }
        xhr.send();
        
    })
}


function paramater_encoder(url, params_obj) {
    if (typeof params_obj !== 'object') return url + '?' + params_obj;
    let encoded = Object.keys(params_obj).map(function (key) {
        return encodeURIComponent(key) + '=' + encodeURIComponent(params_obj[key]);
    }).join('&');
    return url + '?' + encoded;
}


function generate_github_feed(params_obj = github_search_params) {
    make_ajax_request({
        method: 'GET',
        url: `https://api.github.com/repos/NachoToast/NachoToast.com/commits`,
        params: params_obj
    })
    .then(function (result) {
        result = JSON.parse(result);
        loaded_github_changes = [];
        for (let i = 0, len = result.length; i < len; i++) {
            loaded_github_changes[i] = {
                "message": [result[i].commit.message],
                "author": result[i].commit.author.name,
                "time": new Date(result[i].commit.author.date),
            }
        }
        create_github_log_elements();
    })
}

function create_github_log_elements() {
    for (let i = 0, len = loaded_github_changes.length; i < len; i++) {
        //
        if (i != len - 1 && are_similar_dates(loaded_github_changes[i].time, loaded_github_changes[i + 1].time)) {
            loaded_github_changes[i + 1].message = loaded_github_changes[i + 1].message.concat(loaded_github_changes[i].message);
            //loaded_github_changes.splice(i, 1);
            continue;
        }
        //
        let d = document.createElement("div"),
        h = document.createElement("h4");
        h.innerHTML = loaded_github_changes[i].time.toLocaleDateString()
        d.appendChild(h);
        let ul = document.createElement("ul");
        for (let j = loaded_github_changes[i].message.length - 1, j_len = 0; j >= j_len; j--) {
            let p = document.createElement("li");
            p.innerText = format_comment(loaded_github_changes[i].message[j]);
            ul.appendChild(p);
        }
        d.appendChild(ul);
        let p2 = document.createElement("p");
        p2.innerText = `Author: ${loaded_github_changes[i].author}`;
        d.appendChild(p2);
        changelog.appendChild(d);
    }
}

function are_similar_dates(date1 = new Date(), date2 = new Date()) {
    if (Math.abs(date1.getTime() - date2.getTime()) < day && date1.getDay() == date2.getDay()) return true;
    return false;
}

function format_comment(str = "default") {
    if (str.substring(0, 1) != str.substring(0, 1).toUpperCase()) str = str.substring(0, 1).toUpperCase() + str.substring(1);
    if (str.substring(str.length -1, str.length) != ".") str += ".";
    return str;
}


var feed_type = 0;
function toggle_feed_type(thing) {
    if (feed_type == 0) {
        thing.innerText = 'GitHub Log';
        feed_type = 1;
        changelog_2.style.display = 'none';
        changelog.style.display = 'flex';
        if (!loaded_github_changes.length > 0) generate_github_feed();
        return;
    }
    thing.innerText = 'Website Log';
    feed_type = 0;
    changelog_2.style.display = 'flex';
    changelog.style.display = 'none';
}