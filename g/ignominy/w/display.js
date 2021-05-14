var documents = document.getElementById("documents"),
stories = document.getElementById("stories"),
other_files = document.getElementById("other");

function generate_documents() {
    resources.documents.reverse();
    for (let i = 0, len = resources.documents.length; i < len; i++) {
        let d = document.createElement("a");
        d.classList.add("rd");
        documents.appendChild(d);
        d.href = `g/ignominy/w/portal?o=data/${resources.documents[i].path}&t=data`;
        d.target = "_blank";
        let p = document.createElement("p");
        p.innerText = resources.documents[i].name;
        d.appendChild(p);
        let p2 = document.createElement("p");
        p2.innerText = resources.documents[i].preview;
        d.appendChild(p2);
    }
}

function generate_stories() {
    for (let i = 0, len = resources.stories.length; i < len; i++) {
        let d = document.createElement("a");
        d.classList.add("rd");
        stories.appendChild(d);
        d.href = `g/ignominy/w/portal?o=pieces/${resources.stories[i].path}&t=piece`;
        d.target = "_blank";
        let p = document.createElement("p");
        p.innerText = resources.stories[i].name;
        d.appendChild(p);
        let p2 = document.createElement("p");
        p2.innerText = resources.stories[i].preview;
        d.appendChild(p2);
    }
}

function generate_other() {
    for (let i = 0, len = resources.other_files.length; i < len; i++) {
        let d = document.createElement("a");
        d.classList.add("rd");
        other_files.appendChild(d);
        d.href = `g/ignominy/w/portal?o=other/${resources.other_files[i].path + "." + resources.other_files[i].type}&t=other&f=${resources.other_files[i].type}`;
        d.target = "_blank";
        let p = document.createElement("p");
        p.innerText = resources.other_files[i].name;
        d.appendChild(p);
        let p2 = document.createElement("p");
        p2.innerHTML = `File Type: ${resources.other_files[i].type} <span style='color: gray'>(${((resources.other_files[i].size)/1000000).toFixed(1)}MB)</span>`;
        d.appendChild(p2);
    }
}

generate_documents();
generate_stories();
generate_other();