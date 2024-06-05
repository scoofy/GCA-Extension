var testing = false;
var dimPercentage = "10%";
var notablePercentage = "60%"


var msPerMinute = 60 * 1000;
var msPerHour = msPerMinute * 60;
var msPerDay = msPerHour * 24;
var msPerMonth = msPerDay * 30;
var msPerYear = msPerDay * 365;

function timeDifference(current, previous) {
    var elapsed = current - previous;
    let time = 0;
    let unit = '';
    if (elapsed < msPerMinute) {
        time = Math.round(elapsed / 1000);
        units = 'second';
    } else if (elapsed < msPerHour) {
        time = Math.round(elapsed / msPerMinute);
        unit = 'minute';
    } else if (elapsed < msPerDay) {
        time = Math.round(elapsed / msPerHour);
        unit = 'hour';
    } else if (elapsed < msPerMonth) {
        time = Math.round(elapsed / msPerDay);
        unit = 'day';
    } else if (elapsed < msPerYear) {
        time = Math.round(elapsed / msPerMonth);
        unit = 'month';
    } else {
        time = Math.round(elapsed / msPerYear);
        unit = 'year';
    }
    if (!(time == 1)) {
        unit = unit + "s";
    }
    return `${time} ${unit} ago`;
}


var body = returnSubTagSingletonElseStyleElement(document, 'body');
body.style.display = "flex";
body.style.flexDirection = "column";
body.style.justifyContent = "space-between";
addBorder(body, 'red', px = 10);

var dateForm = document.getElementById('search_form');
var dateTextNow = dateForm.textContent.replace('Search', '').replace('|  Calendar', '').trim();
var relativeTimeNow = new Date(Date.parse(dateTextNow));

function setAvatarSizesToDataSets(bodyTag) {
    let avatar_divs = bodyTag.getElementsByClassName('avatar');
    for (avatar of avatar_divs) {
        if (avatar.tagName == "IMG") {
            //console.log('setAvatarSizesToDataSets');
            //console.log('height:', avatar.height);
            //console.log('width:', avatar.width);
        }
    }
}

var addedStyleSheet = document.createElement("style");
var myStyle = `
    .container {
        min-height: 0px !important;
    }
    .hideShowNavPillsList:hover {
        background: #eeeeee;
    }
    .extensionNewInfoButton {
        color: white;
        padding: 8px 16px;
        font-size: 12px;
        line-height: 1.5;
        border-radius: 0;
        background-color: #5bc0de;
        border: solid 1px #46b8da;
        margin-bottom: 0;
        text-align: center;
        cursor: pointer;
        white-space: nowrap;
        text-decoration: none;
        font-family: verdana, sans-serif;
    }
    .extensionNewInfoButton:hover {
        color: white;
        background-color: #31b0d5;
        border-color: #269abc;
        text-decoration: none;
    }

    @media (min-width: 768px) {
        .gca-button {
            visibility: collapse;
        }
        .gca-collapse {
            visibility: visible !important;
        }

    }

    @media (max-width: 768px) {
        .gca-collapse {
            visibility: collapse;
        }
        .navbar-nav {
            margin: 0px !important;
        }
    }

    @media screen and (max-width: 575px), (max-device-width: 575px), (pointer: coarse) {
        .wide_flex {
            flex-direction: column;
            justify-content: center;
        }
        .avatar {
            visibility: collapse !important;
            height: 0px !important;
        }
        .signature {
            visibility: collapse !important;
            height: 0px !important;
            margin: 0px 0px !important;
        }
        .new_right_col {
            margin: 0px !important;
            padding: 0px !important;
            min-width: 100% !important;
            width: 100% !important;
            flex-shrink: 1 !important;
            flex-grow: 1 !important;
        }
        .new_right_col div {
            margin: 0px !important;
            padding: 0px !important;
        }
        .navbar-brand {
            padding: 12px 15px;
        }
    }
    `;

addedStyleSheet.innerText = myStyle;
document.head.appendChild(addedStyleSheet);

var base_flex = document.createElement("div");
base_flex.style.display = "flex";
base_flex.style.gap = "5px";
base_flex.style.padding = "5px";
addBorder(base_flex, "#ccc");

var base_col_flex = base_flex.cloneNode();
base_col_flex.style.flexDirection = "column";

function baseFlex() {
    return base_flex.cloneNode();
}

function baseColFlex() {
    return base_col_flex.cloneNode();
}



function resizeImages() {
    let imgs = document.getElementsByTagName('img');
    for (elem of imgs) {
        if (elem.className != 'avatar') {
            elem.style.maxWidth = "100%";
            elem.style.height = "auto";
        }
    }
}



function minFontSize(minPxSize = 10, minEmSize = 0.8) {
    let elements = document.querySelectorAll('.bbc_size');
    for (elem of elements) {
        let fontSize = elem.style.fontSize;
        //console.log('fontSize:', fontSize);
        if (fontSize.endsWith('px')) {
            let sizeNum = parseInt(fontSize.slice(0, -2));
            if (sizeNum < minPxSize) {
                elem.style.fontSize = `${minPxSize}px`;
            }
        }
        if (fontSize.endsWith('em')) {
            let sizeNum = parseFloat(fontSize.slice(0, -2));
            if (sizeNum < minEmSize) {
                elem.style.fontSize = `${minEmSize}em`;
            }
        }
    }
}

function maxFontSize(maxPxSize = 16, maxEmSize = 1.1) {
    let elements = document.querySelectorAll('.bbc_size');
    for (elem of elements) {
        let fontSize = elem.style.fontSize;
        //console.log('fontSize:', fontSize);
        if (fontSize.endsWith('px')) {
            let sizeNum = parseInt(fontSize.slice(0, -2));
            //console.log('sizeNum:', sizeNum);

            if (sizeNum > maxPxSize) {
                elem.style.fontSize = `${maxPxSize}px`;
            }
        }
        if (fontSize.endsWith('em')) {
            let sizeNum = parseFloat(fontSize.slice(0, -2));
            //console.log('sizeNum:', sizeNum);
            if (sizeNum > maxEmSize) {
                elem.style.fontSize = `${maxEmSize}em`;
            }
        }
    }
}

function removeCustomTypefaces() {
    let elements = document.querySelectorAll('.bbc_font');
    for (elem of elements) {
        elem.style.fontFamily = `"Open Sans", "Helvetica Neue", Helvetica, Arial, sans-serif`;
    }
}

function hideNewbie() {
    let classesToHide = ['.postgroup', '.stars', '.karma'];
    for (namedClass of classesToHide) {
        let elements = document.querySelectorAll(namedClass);
        for (elem of elements) {
            elem.style.display = "none";
        }
    }
}

function hideFatalAndClearFix() {
    let element = document.getElementById('fatal_error');
    element.style.display = "none";
    let elements = document.querySelectorAll('.clearfix');
    for (elem of elements) {
        elem.style.display = "none";
    }
}

function dimKeyInfo() {
    let keyInfos = document.querySelectorAll('.keyinfo');
    for (keyInfo of keyInfos) {
        //keyInfo.style.opacity = dimPercentage;
    }
}

function formatInnerPostDiv() {
    let inners = document.querySelectorAll('.inner');
    for (inner of inners) {
        inner.style.borderTop = "none";
        inner.style.margin = "10px 0";
        inner.style.padding = "10px";
        inner.style.borderRadius = "5px";
    }
}

function dimSignature() {
    let signatures = document.querySelectorAll('.signature');
    for (signature of signatures) {
        signature.style.opacity = notablePercentage;
        signature.style.borderTop = "none";
    }
}

function blockquoteFormatting() {
    let blocks = document.getElementsByTagName('blockquote');
    for (block of blocks) {
        block.style.borderLeft = "2px solid #ccc";
        block.style.margin = "0 0 10px 4px";
        block.style.padding = "0 0 0 4px";

        blockImgs = block.getElementsByTagName('img');
        for (img of blockImgs) {
            img.style.maxHeight = "50px";
            img.style.maxWidth = 'none';
            img.style.width = 'auto';
            img.dataset.thumbnail = 'true';
            //console.log((img)
        }
    }

    let quoteHeaders = document.getElementsByClassName('quoteheader');
    for (header of quoteHeaders) {
        header.style.marginTop = "5px";
        let headerTitleAnchor = returnSubTagSingletonElseStyleElement(header, "a");
        if (headerTitleAnchor.textContent.includes(' on ')) {
            let headerTitleSplit = headerTitleAnchor.textContent.split(' on ');
            let quoteFromName = headerTitleSplit[0];
            let quoteDate = headerTitleSplit[1];
            let relativeTimeOfPost = postTimeStrToDateObj(quoteDate);
            let timeAgo = timeDifference(relativeTimeNow, relativeTimeOfPost);
            headerTitleAnchor.textContent = `${quoteFromName} about ${timeAgo}`;
        }
    }
}

function removeThirdLineBreaks(element) {
    let brsToRemove = [];
    let brs = element.getElementsByTagName('br');
    let acceptableParents = ["A", "BR", "IMG", "#text"];
    for (br of brs) {
        if (br.previousSibling) {
            //console.log('    ', br.previousSibling.nodeName);
            //console.log(br.previousSibling.textContent);
            if (!acceptableParents.includes(br.previousSibling.nodeName)) {
                brsToRemove.push(br);
            } else if (br.previousSibling.tagName == "BR") {
                if (br.previousSibling.previousSibling) {
                    if (!acceptableParents.includes(br.previousSibling.previousSibling.nodeName)) {
                        brsToRemove.push(br);
                    } else if (br.previousSibling.previousSibling.tagName == "BR") {
                        brsToRemove.push(br);
                    }
                } else {
                    brsToRemove.push(br);
                }
            }
        } else {
            brsToRemove.push(br);
        }
    }
    for (br of brsToRemove) {
        br.remove()
    }
}

function dimLogged() {
    let modified_elements = document.querySelectorAll('.modified');
    for (elem of modified_elements) {
        //elem.style.opacity = dimPercentage;
    }
    let report_elements = document.querySelectorAll('.reportlinks');
    for (elem of report_elements) {
        //elem.style.opacity = dimPercentage;
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

function hideMessageIcons() {
    classesToRemove = ['messageicon', 'glyphicon-pencil'];
    for (className of classesToRemove) {
        let elements = document.querySelectorAll(`.${className}`);
        for (elem of elements) {
            elem.style.display = 'none';
        }
    }
}

function replyListToHamburger() {
    let navPillsList = document.querySelectorAll('.nav-pills');
    for (const [index, navPillsElement] of navPillsList.entries()) {
        navPillsElement.style.display = "flex";
        navPillsElement.style.flexDirection = "column";
        navPillsElement.style.flexWrap = "wrap";

        addedClassName = `navPillsHide${index}`;
        let navPillsChildren = navPillsElement.children;
        let count = 2;
        let replyFlex = null;
        for (elem of navPillsChildren) {
            if (elem.className.includes('active')) {
                replyFlex = elem;
                elem.style.display = 'flex';
                elem.style.order = 1
            } else {
                elem.style.visibility = 'collapse';
                elem.classList.add(addedClassName);
                elem.style.order = count;
                count += 1;
            }
        }

        if (replyFlex) {
            let expandButtonDiv = document.createElement("div");
            expandButtonDiv.className = "hideShowNavPillsList";
            expandButtonDiv.style.display = "Flex";
            expandButtonDiv.style.justifyContent = "center";
            expandButtonDiv.style.alignItems = "center";
            expandButtonDiv.style.width = '50px';
            expandButtonDiv.style.cursor = 'pointer';

            expandButtonDiv.onclick = function() {
                let index = this.dataset.index;
                let parent = this.parentElement.parentElement;
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

            let textSpan = document.createElement("div");
            textSpan.textContent = "More";

            expandButtonDiv.appendChild(textSpan);
            replyFlex.appendChild(expandButtonDiv);
        }
    }
}

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
//warningsFullVisibility()


function returnSubClassSingletonElseStyleElement(parentElement, theClassName, returnNull = false) {
    //console.log("returnSubClassSingletonElseStyleElement()");
    let theElementList = parentElement.getElementsByClassName(theClassName);
    let theElement = theElementList.item(0);
    //console.log(theElement);
    if (!theElement) {
        if (returnNull) {
            return null;
        }
        //console.log("STYLE!");
        theElement = document.createElement("style");
        //console.log(theElement);
    }
    return theElement;
}

function returnSubTagSingletonElseStyleElement(parentElement, theTagName, returnNull = false) {
    //console.log("returnSubClassSingletonElseStyleElement()");
    let theElementList = parentElement.getElementsByTagName(theTagName);
    let theElement = theElementList.item(0);
    //console.log(theElement);
    if (!theElement) {
        if (returnNull) {
            return null;
        }
        //console.log("STYLE!");
        theElement = document.createElement("style");
        //console.log(theElement);
    }
    return theElement;
}

function addBorder(element, color, px = 1) {
    if (testing) {
        if (element) {
            element.style.border = `solid ${px}px ${color}`;
        } else {
            //console.log(element);
            throw new Error("element doesn't exist");
        }
    }
}

function formatExistingLeftColumn(leftCol, postTimeAgo) {
    let formatedLeftCol = baseColFlex();

    let h4 = returnSubTagSingletonElseStyleElement(leftCol, 'h4');
    h4.style.marginBottom = "0";
    h4.style.marginLeft = "0";
    h4.style.paddingBottom = "0";
    h4.style.paddingLeft = "0";

    let nameSpan = leftCol.querySelector('[itemprop="name"]');
    if (nameSpan) {
        nameSpan.textContent = nameSpan.textContent.replace('_', ' ');
        nameSpan.style.color = '#c06002';
        let avatar = leftCol.querySelector('[itemprop="image"]');

        formatedLeftCol.appendChild(h4);
        let postTimeDiv = document.createElement('div');
        postTimeDiv.textContent = postTimeAgo;
        postTimeDiv.style.fontSize = "70%";
        postTimeDiv.style.opacity = notablePercentage;
        postTimeDiv.style.margin = "0 0 5px 1px";
        formatedLeftCol.appendChild(postTimeDiv);


        if (avatar) {
            formatedLeftCol.appendChild(avatar);
        }

        return formatedLeftCol;
    }
}

function calculateImgAspectRatioFit(img) {
    //console.log('calculateImgAspectRatioFit(img)');
    //console.log('THIS SHOULD ALWAYS BE AN IMAGE:')
    //console.log(img);
    //console.log(img.style.height);
    //console.log(img.naturalHeight);

    let srcWidth = img.naturalWidth;
    //console.log('srcWidth:', srcWidth);

    if (!srcWidth) {
        //console.log('naturalWidth FAIL')
        srcWidth = parseInt(img.style.width);
        //console.log('style width:', srcWidth);
    }
    if (!srcWidth) {
        return
    }

    let srcHeight = img.naturalHeight;
    if (!srcHeight) {
        srcHeight = parseInt(img.style.height);
    }

    let maxWidth = 100;
    let maxHeight = 50;

    //console.log(srcWidth, srcHeight, maxWidth, maxHeight);

    let ratio = Math.min(maxWidth / srcWidth, maxHeight / srcHeight);

    let ratioObj = {
        width: srcWidth * ratio || 500,
        height: srcHeight * ratio || 500,
    };
    //console.log('ratioObj:', ratioObj);


    return ratioObj;
}

function thisResizeCalculation() {
    this.maxWidth = 'none';
    this.style.maxWidth = 'none';
    this.style.maxHeight = 'none';
    //console.log('this.dataset.thumbnail == false')
    //console.log(this.dataset.thumbnail)
    //console.log(this.dataset.thumbnail == false)
    if (this.dataset.thumbnail == "false") {
        aspect = calculateImgAspectRatioFit(this);
        if (aspect) {
            this.style.width = `${aspect.width}px`;
            this.style.height = `${aspect.height}px`;
            this.dataset.thumbnail = 'true';
        }
    } else {
        this.style.width = `${this.naturalWidth}px`;
        this.style.height = `${this.naturalHeight}px`;
        this.dataset.thumbnail = 'false';
    }
    //console.log(this);
}

function resizeCalculation(img) {
    img.maxWidth = 'none';
    img.style.maxWidth = 'none';
    img.style.maxHeight = 'none';
    //console.log('this.dataset.thumbnail == false')
    //console.log(img.dataset.thumbnail)
    //console.log(img.dataset.thumbnail == false)
    if (img.dataset.thumbnail == "false") {
        aspect = calculateImgAspectRatioFit(img);
        if (aspect) {
            img.style.width = `${aspect.width}px`;
            img.style.height = `${aspect.height}px`;
            img.dataset.thumbnail = 'true';
        }
    } else {
        img.style.width = `${img.naturalWidth}px`;
        img.style.height = `${img.naturalHeight}px`;
        img.dataset.thumbnail = 'false';
    }
    //console.log(img);
}


function resizeAvatar(messageContainerElement) {
    let avatar_divs = messageContainerElement.getElementsByClassName('avatar');
    for (avatar of avatar_divs) {
        if (avatar.tagName == "IMG") {
            avatar.dataset.thumbnail = 'false';
            // this is quite complex
            // i can't get this to work without:
            //    running the function
            //    then passing a this-based function to run onload
            //    then having the this-based function fire onclick
            // but somehow this works!
            resizeCalculation(avatar);
            avatar.onload = thisResizeCalculation;
            avatar.onclick = thisResizeCalculation;
        }
    }
}

function postTimeStrToDateObj(postTimeStr) {
    if (postTimeStr.startsWith("Today at") || postTimeStr.startsWith("Yesterday at")) {
        //console.log('postTimeStr', postTimeStr);
        let cloneOfRelativeTimeNow = structuredClone(relativeTimeNow);
        if (postTimeStr.startsWith("Yesterday at")) {
            cloneOfRelativeTimeNow.setTime(cloneOfRelativeTimeNow.getTime() - (1 * msPerDay));
        }
        let month = cloneOfRelativeTimeNow.toLocaleString('default', {
            month: 'long'
        });
        //console.log(month);
        //let month = cloneOfRelativeTimeNow.getMonth();
        let day = cloneOfRelativeTimeNow.getDate();
        let year = cloneOfRelativeTimeNow.getFullYear();
        postTimeStr = postTimeStr.replace("Today at ", '').replace("Yesterday at", "").trim();

        let timeToParse = `${month} ${day}, ${year}, ${postTimeStr}`
        //console.log('timeToParse');
        //console.log(timeToParse);

        let relativeTimeOfPost = new Date(Date.parse(timeToParse));
        //console.log(relativeTimeOfPost);
        return relativeTimeOfPost;
    } else {
        let relativeTimeOfPost = new Date(Date.parse(postTimeStr));
        //console.log("")
        //console.log(postTimeStr);
        return relativeTimeOfPost;
    }
}

function returnPostDateObj(messageContainerElement) {
    let keyInfoDiv = returnSubClassSingletonElseStyleElement(messageContainerElement, "keyinfo");
    let smallTextDiv = returnSubClassSingletonElseStyleElement(keyInfoDiv, "smalltext");
    //console.log(smallTextDiv.textContent);
    let afterFirstColon = smallTextDiv.textContent.substring(smallTextDiv.textContent.indexOf(':') + 1);
    //console.log(afterFirstColon);
    let postTimeStr = afterFirstColon.replace('»', '').trim();
    let relativeTimeOfPost = postTimeStrToDateObj(postTimeStr);
    return relativeTimeOfPost;
}

function returnPostTimeAgo(messageContainerElement) {
    let relativeTimeOfPost = returnPostDateObj(messageContainerElement);



    //console.log("Then:", relativeTimeOfPost);

    //console.log("")
    //console.log(dateTextNow);
    //console.log("Now :", relativeTimeNow);

    //console.log(relativeTimeNow > relativeTimeOfPost);

    let timeAgo = timeDifference(relativeTimeNow, relativeTimeOfPost);
    return timeAgo;
}

function messageIteration(messageContainerElement) {
    // class = "windowbg row message_container"
    // or
    // class = "windowbg2 row message_container"
    let postTimeAgo = returnPostTimeAgo(messageContainerElement);
    //console.log('postTimeAgo:');
    //console.log(postTimeAgo);

    let col_flex = baseColFlex();
    col_flex.className = messageContainerElement.className;
    addBorder(col_flex, 'black');

    let left_col = baseColFlex();
    left_col.className = "new_left_col"
    left_col.style.width = 'fit-content';
    left_col.style.flexShrink = 3;
    let right_col = baseColFlex();
    right_col.className = "new_right_col"
    right_col.style.maxWidth = '75%';
    right_col.style.flexShrink = 1;
    right_col.style.flexGrow = 3;

    let wide_flex = baseFlex();
    wide_flex.className = "wide_flex";
    wide_flex.style.width = '100%';
    wide_flex.style.justifyContent = "space-between";
    addBorder(wide_flex, 'red');

    let footer_flex = baseFlex();
    footer_flex.className = "footer_flex";
    footer_flex.style.justifyContent = "flex-end";
    addBorder(footer_flex, 'green');

    let footer_info_col = baseColFlex();
    footer_info_col.className = "footer_info_col";
    footer_info_col.style.width = "100%";
    footer_info_col.style.visibility = 'collapse';

    let footer_button_col = baseFlex();
    footer_button_col.className = "footer_info_col";

    // get newPostWarning now, becaues the stuff it's located in will move out of the container
    let newPostWarning = returnSubClassSingletonElseStyleElement(messageContainerElement, 'label-warning', true);

    let existing_left_col = returnSubClassSingletonElseStyleElement(messageContainerElement, "col-md-3");
    let formattedLeftCol = formatExistingLeftColumn(existing_left_col, postTimeAgo);
    addBorder(formattedLeftCol, 'DarkOliveGreen');

    let existing_right_col = returnSubClassSingletonElseStyleElement(messageContainerElement, "col-md-9");
    addBorder(existing_right_col, 'MistyRose');
    existing_right_col.style.width = "100%";
    existing_right_col.style.textAlign = 'justify';
    existing_right_col.style.textJustify = 'inter-word';

    let post = returnSubClassSingletonElseStyleElement(existing_right_col, "postarea");
    removeThirdLineBreaks(post);
    //console.log(post.textContent);


    let subject_info = returnSubClassSingletonElseStyleElement(existing_right_col, "flow_hidden");
    addBorder(subject_info, "Indigo");
    let keyinfo = returnSubClassSingletonElseStyleElement(existing_right_col, "keyinfo");
    keyinfo.style.width = "100%";
    addBorder(keyinfo, "Tomato");

    let moderation = returnSubClassSingletonElseStyleElement(existing_right_col, "moderatorbar");
    addBorder(moderation, "Salmon");
    let signature = returnSubClassSingletonElseStyleElement(existing_right_col, "signature");
    signature.style.width = '100%';
    addBorder(signature, "Fuchsia");
    let buttons = returnSubClassSingletonElseStyleElement(subject_info, "quickbuttons2");
    if (buttons.tagName == "STYLE") {
        buttons = document.createElement("div");
        //buttons.className = "quickbuttons2";
    }
    buttons.style.display = "flex";
    buttons.style.gap = "10px";
    buttons.style.justifyContent = 'center';
    buttons.style.alignItems = 'flex-start';
    buttons.style.flexWrap = "nowrap";
    addBorder(buttons, "BurlyWood");


    let firstButton = returnSubTagSingletonElseStyleElement(buttons, "a");
    let newButton = firstButton.cloneNode();
    if (firstButton.tagName == "A") {
        newButton.removeAttribute("href");
    } else {
        newButton = document.createElement("a");
        newButton.className = "extensionNewInfoButton";
    }

    //console.log(newButton);
    newButton.textContent = "Info";
    newButton.onclick = function() {
        if (footer_info_col.style.visibility == 'visible') {
            footer_info_col.style.visibility = 'collapse';
        } else {
            footer_info_col.style.visibility = 'visible';
        }
    }
    buttons.appendChild(newButton);

    footer_info_col.appendChild(subject_info);
    footer_info_col.appendChild(moderation);
    footer_button_col.appendChild(buttons);
    footer_button_col.style.flexWrap = "nowrap";

    footer_flex.appendChild(footer_info_col);
    footer_flex.appendChild(footer_button_col);
    footer_flex.style.justifyContent = 'space-between';


    right_col.appendChild(post);
    left_col.appendChild(formattedLeftCol);
    left_col.appendChild(signature);
    wide_flex.appendChild(left_col);
    wide_flex.appendChild(right_col);

    //console.log('newPostWarning START!');
    //console.log(newPostWarning);
    if (newPostWarning) {
        let newPostFlex = baseFlex();
        newPostFlex.style.justifyContent = "center";
        newPostFlex.appendChild(newPostWarning);
        col_flex.appendChild(newPostFlex);
        col_flex.style.borderLeft = "solid 4px #e99002";
        col_flex.style.borderRadius = "2px";

    }


    col_flex.appendChild(wide_flex);
    col_flex.appendChild(footer_flex);

    resizeAvatar(col_flex);
    return col_flex;
}

function forumIteration() {
    forumPosts = document.getElementById('forumposts');
    if (!forumPosts) {
        return
    }
    forumPosts.style.display = "flex";
    forumPosts.style.flexDirection = "column";
    forumPosts.style.gap = "10px";


    forumForm = document.getElementById('quickModForm');
    messages = document.querySelectorAll('.message_container');
    //console.log(forumForm);

    forumPosts.replaceChildren();
    for (const [i, message] of messages.entries()) {
        let formattedMessage = messageIteration(message);
        forumPosts.appendChild(formattedMessage);
    }
}

function removePreviousAndNextPageAndBackButtons() {
    pagers = document.getElementsByClassName("pager");
    for (pager of pagers) {
        //console.log(pager);
        pager.style.display = "none";
    }
    centerTextDivs = document.getElementsByClassName("centertext");
    for (centerTextDiv of centerTextDivs) {
        //console.log(centerTextDiv);
        if (centerTextDiv.children.length == 1) {
            if (centerTextDiv.firstChild.nodeName == "A") {
                centerTextDiv.style.display = "none";
            }
        }
    }
}

function formatFirstRow() {
    let topRow = returnSubClassSingletonElseStyleElement(body, "row");

    let searchForm = document.getElementById('search_form');

    let layoutText = `
    <div class="col-md-9">
        <form class="navbar-form navbar-left" role="search" id="search_form" action="https://www.golfclubatlas.com/forum/index.php?action=search2" method="post" accept-charset="ISO-8859-1">

                <div class="form-group">
                  <input type="text" class="form-control" placeholder="Search" name="search" />
                </div>
                <input type="hidden" name="advanced" value="0" />
                <button type="submit" class="btn btn-default btn-sm">
                    <span class="glyphicon glyphicon-search">
                    </span>
                    Search
                </button>
                <a href="https://www.golfclubatlas.com/forum/index.php?action=search;advanced=1">
                    <span class="glyphicon glyphicon-cog">
                    </span>
                </a>
                <input type="hidden" name="topic" value="72924" />


                <br class="clear" />
                <br class="clear" />
                <span class="glyphicon glyphicon-time"></span> May 31, 2024, 07:45:57 PM
                |
                <span class="glyphicon glyphicon-calendar"></span> <a href="https://www.golfclubatlas.com/forum/index.php?action=calendar">Calendar</a>
         </form>
    </div>
    `

    //pull out elements and reput them in to remove pesky text
    elementList = [];
    for (element of searchForm) {
        elementList.push(element);
    }
    searchForm.innerHTML = "";
    for (element of elementList) {
        searchForm.appendChild(element);
        searchForm.dataset.searchFormElement = "true";
    }
    //remove text



    // news area
    let newsDiv = returnSubClassSingletonElseStyleElement(topRow, "col-md-3");
    // double check here
    for (child of newsDiv.children) {
        if (child.innerText.includes("News")) {
            newsDiv.style.display = "none";
            return
        }

    }
}



function removeContainerHr() {
    for (element of body.children) {
        if (element.className == "container") {
            for (child of element.children) {
                //console.log(element.tagName);
                if (child.tagName == "HR") {
                    child.remove();
                    return;
                }
            }
        }
    }
}

function cleanerPageBar() {
    let keyInfo = returnSubClassSingletonElseStyleElement(body, 'keyinfo');
    let h5 = returnSubTagSingletonElseStyleElement(keyInfo, 'h5');
    let titleAnchor = returnSubTagSingletonElseStyleElement(h5, 'a', true);


    pageBars = document.getElementsByClassName("pagesection");
    for (pageBar of pageBars) {
        //console.log(pageBar)
        addBorder(pageBar, 'orange');
        pageBar.style.width = '100%';
        pageBar.style.margin = "15px 0";

        pageBar.style.display = 'flex';
        pageBar.style.justifyContent = 'space-between';
        pageBar.style.alignItems = 'center';
        //pageBar.style.flexWrap = 'wrap';


        let newH5 = h5.cloneNode();
        if (titleAnchor) {
            let newTitleAnchor = titleAnchor.cloneNode(true);
            //console.log(newTitleAnchor);
            newTitleAnchor.href = newTitleAnchor.href.split('.msg', 1) + ".0.html"

            //console.log(newTitleAnchor.href)
            newH5.appendChild(newTitleAnchor);
            newH5.style.order = 1;
            newH5.style.fontWeight = 'bold';
            //console.log('newH5');
            //console.log(newH5);
            pageBar.appendChild(newH5);


            for (element of pageBar.children) {
                addBorder(element, 'DarkOrange');
                if (element.className.includes("floatright")) {
                    //hamburger
                    element.style.order = 4;
                    //element.style.flexShrink = 4;
                    element.style.flexBasis = '100px';


                } else if (element.className.includes("floatleft")) {
                    //pages seciton
                    element.style.order = 2;
                    element.style.whiteSpace = "nowrap";
                    element.style.padding = "0 20px";


                }
            }
        }
    }
}

function cleanerNavBar() {
    navbar = returnSubClassSingletonElseStyleElement(body, 'navbar-fixed-top');
    navContainer = returnSubClassSingletonElseStyleElement(navbar, 'container');
    navContainerClone = navContainer.cloneNode()

    navContainerClone.style.width = "100%";
    navContainerClone.style.display = "flex";
    navContainerClone.style.justifyContent = "flex-end";
    navContainerClone.style.alignItems = "center";
    navContainerClone.style.flexWrap = "wrap";


    brandSpacer = document.createElement("div");
    brandSpacer.style.display = 'flex';
    brandSpacer.style.justifyContent = 'space-between';
    brandSpacer.style.alignItems = 'center';
    brandSpacer.style.flexGrow = 2;

    navbarBrand = returnSubClassSingletonElseStyleElement(navContainer, 'navbar-brand');
    navbarBrand.style.padding = '0px';
    navbarBrand.style.display = 'flex';
    navbarBrand.style.alignItems = 'center';

    addBorder(navbarBrand, "PowderBlue");
    brandSpacer.appendChild(navbarBrand);

    brandImg = returnSubTagSingletonElseStyleElement(navbarBrand, 'img');
    // hard coded actual image width:
    // https://golfclubatlas.com/images/Golf-Club-Atlas-Logo.jpg
    brandImg.style.width = '250px';
    brandImg.style.height = 'auto';
    brandImg.style.padding = '0px 6px';

    let dummy_ul = document.createElement("ul");
    dummy_ul.classList.add('nav');
    dummy_ul.classList.add('navbar-nav');
    dummy_ul.classList.add('gca-button');
    let dummy_li = document.createElement("li");
    let dummy_a = document.createElement("a");
    let dummy_span = document.createElement("span");
    addBorder(dummy_ul, 'red');


    dummy_span.textContent = "More";


    dummy_ul.onclick = function() {
        //console.log('HERE WE GO!');
        let parentContainer = this.parentElement.parentElement;
        //console.log(parentContainer);
        let unorderedListClones = parentContainer.getElementsByClassName('gca-collapse');
        for (ulc of unorderedListClones) {
            //console.log(ulc.style.visibility);
            //console.log(ulc.style);
            if (!ulc.style.visibility) {
                ulc.style.visibility = 'visible';
            } else {
                if (ulc.style.visibility == 'collapse') {
                    ulc.style.visibility = 'visible';

                } else if (ulc.style.visibility == 'visible') {
                    ulc.style.visibility = 'collapse';
                }
            }
        }
        let thisSpan = returnSubTagSingletonElseStyleElement(this, 'span');
        //console.log(thisSpan.textContent);
        if (thisSpan.textContent.includes("More")) {
            thisSpan.textContent = "✕";
        } else {
            thisSpan.textContent = "More";
        }
    };


    dummy_a.appendChild(dummy_span);
    dummy_li.appendChild(dummy_a);
    dummy_ul.appendChild(dummy_li);
    brandSpacer.appendChild(dummy_ul);


    navContainerClone.appendChild(brandSpacer);



    navbarCollapse = returnSubClassSingletonElseStyleElement(navContainer, 'navbar-collapse');
    collapseClassList = navbarCollapse.classList;
    //console.log(collapseClassList);
    for (unorderedList of navbarCollapse.children) {
        let listItemList = [];
        for (listItem of unorderedList.children) {
            listItem.style.whiteSpace = 'nowrap';
            listItem.style.width = 'fit-content !important';

            //listItem.className = '';
            //for (thisClassName of collapseClassList) {
            //    //listItem.classList.add(thisClassName);
            //}
            addBorder(listItem, "PowderBlue");
            listItemList.push(listItem);
        }
        for (listItem of listItemList) {
            //let unorderedListClone = document.createElement("ul");
            let unorderedListClone = unorderedList.cloneNode();
            unorderedListClone.classList.add('gca-collapse');
            addBorder(unorderedListClone, "PowderBlue");
            unorderedListClone.appendChild(listItem);
            navContainerClone.appendChild(unorderedListClone);
        }
    }
    navbar.appendChild(navContainerClone);
    navContainer.remove();
}


function fullPageIteration() {
    resizeImages();
    minFontSize();
    maxFontSize();
    removeCustomTypefaces();
    hideFatalAndClearFix();
    hideNewbie();
    hideMessageIcons();

    dimKeyInfo()
    dimLogged();
    dimSignature();

    formatInnerPostDiv();
    blockquoteFormatting();
    replyListToHamburger();



    formatFirstRow();
    removePreviousAndNextPageAndBackButtons();
    removeContainerHr();
    cleanerPageBar();

    forumIteration();
    cleanerNavBar()
    //console.log('FULL PAGE ITERATION!!!')
}
fullPageIteration()



// end of line