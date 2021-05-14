window.onresize = resize_pdf;
pdf = document.getElementsByClassName("other_embed")[0],
header = document.getElementById("header");

function resize_pdf() {
    pdf.style.width = "100%";
    pdf.style.height = window.innerHeight - header.getBoundingClientRect().height + "px";
}

resize_pdf();