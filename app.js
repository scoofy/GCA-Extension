var testing = false;
var dimPercentage = "10%";
var notablePercentage = "60%"

function testingBorder(testing) {
    if (testing) {
        let body_list = document.getElementsByTagName('body');
        for (elem of body_list) {
            elem.style.border = "10px solid red";
        }
    }
}
testingBorder(testing);

function resizeImages() {
    var imgs = document.getElementsByTagName('img');
    for (elem of imgs) {
        if (elem.className === 'avatar') {
            elem.style.maxWidth = "100px";
            elem.style.maxHeight = "50px";
            elem.style.height = "auto";
            elem.style.width = "auto";

            elem.onclick = function() {
                let parent = this.parentElement;
                parent.removeAttribute('href');
                if (this.style.maxWidth === "100px") {
                    this.style.maxWidth = "100%";
                    this.style.maxHeight = "100%";
                } else {
                    this.style.maxWidth = "100px";
                    this.style.maxHeight = "50px";
                }
            }

        } else {
            elem.style.maxWidth = "100%";
            elem.style.height = "auto";
        }
    }
}
resizeImages();

function minFontSize(minPxSize) {
    let elements = document.querySelectorAll('.bbc_size');
    for (elem of elements) {
        let fontSize = elem.style.fontSize;
        if (fontSize.endsWith('px')) {
            let sizeNum = parseInt(fontSize.slice(0, -2));
            if (sizeNum < minPxSize) {
                elem.style.fontSize = `${minPxSize}px`;
            }
        }
    }
}
minFontSize(10);


function hideNewbie() {
    let classesToHide = ['.postgroup', '.stars', '.karma'];
    for (namedClass of classesToHide) {
        let elements = document.querySelectorAll(namedClass);
        for (elem of elements) {
            elem.style.display = "none";
        }
    }
}
hideNewbie();

function hideFatalAndClearFix() {
    let element = document.getElementById('fatal_error');
    element.style.display = "none";
    let elements = document.querySelectorAll('.clearfix');
    for (elem of elements) {
        elem.style.display = "none";
    }
}
hideFatalAndClearFix();

function dimKeyInfo() {
    let keyInfos = document.querySelectorAll('.keyinfo');
    for (keyInfo of keyInfos) {
        keyInfo.style.opacity = dimPercentage;
    }
}
dimKeyInfo()

function formatInnerPostDiv() {
    let inners = document.querySelectorAll('.inner');
    for (inner of inners) {
        inner.style.borderTop = "none";
        inner.style.margin = "10px 0";
        inner.style.padding = "10px";
        inner.style.borderRadius = "5px";
    }
}
formatInnerPostDiv();

function dimSignature() {
    let signatures = document.querySelectorAll('.signature');
    for (signature of signatures) {
        signature.style.opacity = notablePercentage;
        signature.style.borderTop = "none";
    }
}
dimSignature();

function blockquoteBorderLeft() {
    var blocks = document.getElementsByTagName('blockquote');
    for (block of blocks) {
        block.style.borderLeft = "1px solid #ccc";
    }
}
blockquoteBorderLeft();

function dimLogged() {
    let modified_elements = document.querySelectorAll('.modified');
    for (elem of modified_elements) {
        elem.style.opacity = dimPercentage;
    }
    let report_elements = document.querySelectorAll('.reportlinks');
    for (elem of report_elements) {
        elem.style.opacity = dimPercentage;
        let imgs = elem.getElementsByTagName('img');
        for (img of imgs) {
            img.style.display = "none";
        }
        let logs = elem.getElementsByClassName('help');
        for (log of logs) {
            log.style.display = "none";
        }
    }
}
dimLogged();

function hideMessageIcons() {
    classesToRemove = ['messageicon', 'glyphicon-pencil'];
    for (className of classesToRemove) {
        let elements = document.querySelectorAll(`.${className}`);
        for (elem of elements) {
            elem.style.display = 'none';
        }
    }
}
hideMessageIcons();

function replyListToHamburger() {
    let navPillsList = document.querySelectorAll('.nav-pills');
    for (const [index, navPillsElement] of navPillsList.entries()) {
        navPillsElement.style.display = "flex";
        navPillsElement.style.justifyContent = "flex-end";

        addedClassName = `navPillsHide${index}`;
        let navPillsChildren = navPillsElement.children;
        for (elem of navPillsChildren) {
            if (!(elem.className.includes('active') || elem.className.includes('hideShowNavPillsList'))) {
                elem.style.visibility = 'collapse';
                elem.classList.add(addedClassName);
                elem.dataset.index = index;
            }
        }

        let expand_button_list_item = document.createElement("li");
        expand_button_list_item.className = "hideShowNavPillsList"
        expand_button_list_item.onclick = function() {
            let index = this.dataset.index;
            let parent = this.parentElement;
            for (elem of parent.children) {
                if (!(elem.className.includes('active'))) {
                    if (elem.className.includes('hideShowNavPillsList')) {
                        if (elem.firstChild.textContent === "More") {
                            elem.firstChild.textContent = "Less";
                        } else {
                            elem.firstChild.textContent = "More";
                        }
                    } else if (elem.style.visibility === 'collapse') {
                        elem.style.visibility = 'visible';
                    } else {
                        elem.style.visibility = 'collapse';
                    }
                }
            }

        };

        let anchor = document.createElement("a");
        anchor.textContent = "More";
        expand_button_list_item.appendChild(anchor);
        navPillsElement.appendChild(expand_button_list_item);
    }
}
replyListToHamburger();

function warningsFullVisibility() {
    let messageContainers = document.querySelectorAll('.message_container');
    for (container of messageContainers) {
        let posterResponsive = container.getElementsByClassName('poster_responsive')[0];
        let labelWarning = container.getElementsByClassName('label-warning')[0];
        //let h4 = container.getElementsByTagName('h4')[0];

        if (posterResponsive && labelWarning) {
            //h4.style.width = "100%";
            //h4.style.display = "flex";

            posterResponsive.style.display = "flex";
            posterResponsive.style.flexDirection = "column";
            //posterResponsive.style.alignItems = "center";
            posterResponsive.style.gap = "5px";

            labelWarning.style.width = "fit-content";
            labelWarning.style.marginLeft = "20px";

            let br = document.createElement("br");
            posterResponsive.appendChild(labelWarning);
        }
    }
}
warningsFullVisibility()

// end of line