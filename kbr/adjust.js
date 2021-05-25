const displayedFontSize = document.getElementById("fontSizeAdjuster");
const content = document.getElementById("review_content");
var currentSize = 16;

function changeFontSize(type) {
    if (type == "+") currentSize += 2;
    else currentSize -= 2;
    content.style.fontSize = currentSize + 'px';
    displayedFontSize.innerText = currentSize;
}