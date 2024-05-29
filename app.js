//document.body.style.border = "10px solid red";
var imgs = document.getElementsByTagName('img');
for (elem of imgs) {
    if (elem.className == 'avatar') {
        elem.style.maxWidth = "100px";
        elem.style.maxHeight = "100px";
        elem.style.height = "auto";
        elem.style.width = "auto";
    } else {
        elem.style.maxWidth = "100%";
        elem.style.height = "auto";
    }

}

function minFontSize(minPxSize) {
    let elements = document.querySelectorAll('.bbc_size');
    for (elem of elements) {
        let fontSize = elem.style.fontSize;
        if (fontSize.endsWith('px')) {
            let sizeNum = parseInt(fontSize.slice(0, -2));
            console.log(sizeNum);
            if (sizeNum < minPxSize) {
                elem.style.fontSize = `${minPxSize}px`;
            }
        }
    }
}
minFontSize(10);



// end of line