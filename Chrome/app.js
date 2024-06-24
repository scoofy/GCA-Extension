//////////// full iteration at bottom of page ////////////
//console.log('START Extension')
//////////// CONFIG ////////////

/// START DATABASE CONFIG ///
var user_dict = {}
/// END DATABASE CONFIG ///

const testing = false;

const dimPercentage = "10%";
const notablePercentage = "60%"

var body = returnSubTagSingletonElseStyleElement(document, 'body');

var dateForm = document.getElementById('search_form');
var dateTextNow = dateForm.textContent.replace('Search', '').replace('|  Calendar', '').trim();
var relativeTimeNow = new Date(Date.parse(dateTextNow));
var collapserCount = 0;

const msPerMinute = 60 * 1000;
const msPerHour = msPerMinute * 60;
const msPerDay = msPerHour * 24;
const msPerMonth = msPerDay * 30;
const msPerYear = msPerDay * 365;

const rightArrow = '\u25BC';
//const downArrow = '\u25B6';
//const upArrow = '\u25B2';
//const plusWide = '\uFF0B';
//const minusWide = '\uFF0D';


const bbCodeClosingTags = [
    '[/li]',
    '[/list]',
    '[/quote]',
    '[/code]',
    '[/td]',
    '[/tr]',
    '[/table]',
    '[/tt]',
    '[/sub]',
    '[/sup]',
    '[/move]',
    '[/shadow]',
    '[/glow]',
    '[/ftp]',
    '[/email]',
    '[/url]',
    '[/img]',
    '[/color]',
    '[/size]',
    '[/font]',
    '[/right]',
    '[/center]',
    '[/left]',
    '[/pre]',
    '[/s]',
    '[/u]',
    '[/i]',
    '[/b]'
];

const skippableInLineElements = [
    'A',
    'ABBR',
    'B',
    'BR',
    'CITE',
    'EM',
    'I',
    'MARK',
    'S',
    'SMALL',
    'SPAN',
    'STRONG',
    'SUB',
    'SUP',
];

// USE ITERATION OVER REGEX, IT'S FASTER
// const bbCodeClosingTagRegEx = /\[\/[a-zA-Z]+\]/g


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

const collapserButtonClass = 'gca_collapser_button';
const collapserRowClass = 'gca_collapser_row';
const gcaFadeElementClass = 'gca_fade_element';
const gcaFadeButtonClass = 'gca_fade_button';
const gcaDontFadeThisClass = 'gca_dont_fade_this';
const decreaseFadeButtonClass = 'gca_decrease_fade';
const increaseFadeButtonClass = 'gca_increase_fade';
const muteButtonClass = 'gca_mute_button';

const maxMuteLevel = 100;
const minMuteLevel = 0;
const middleMuteLevel = 50;
const muteClickUnits = 10;

const greyOutStandardColor = '#111';

//////////// END CONFIG ////////////
//////////// STORAGE ////////////
function setItem() {
    console.log("OK");
}

function onError(error) {
    console.log(error);
}

function launchExtension() {
    if (location.pathname.includes('topic')) {
        chrome.storage.local.get(
            'user_dict'
        ).then(fullTopicPageIteration, onError);
    } else {
        chrome.storage.local.get(
            'user_dict'
        ).then(fullBoardPageIteration, onError);
    }
}


function setMuteLevel(int_user_id, muteLevel) {
    let userData = user_dict[int_user_id] ? user_dict[int_user_id] : {};
    userData['mute_level'] = muteLevel;
    user_dict[int_user_id] = userData;
    chrome.storage.local.set({
        user_dict
    }).then(setItem, onError);
}

function factoryReset() {
    user_dict = {};
    chrome.storage.local.set({
        user_dict
    }).then(setItem, onError).then(reloadPage, onError);
}
//////////// END STORAGE ////////////
//////////// UTILITIES ////////////

//function returnFormattedUserId(user_id) {
//    return `user${user_id}`;
//}

/// MUTE USERS UTILITIES ///
function returnMuteLevelFromUserId(int_user_id) {
    if (user_dict[int_user_id]) {
        let muteLevel = user_dict[int_user_id]['mute_level']
        if (muteLevel) {
            return muteLevel;
        } else {
            return minMuteLevel;
        }
    } else {
        return minMuteLevel;
    }
}

function returnMuteLevelFromElement(inputElement) {
    let user_id = returnUserIDfromElement(inputElement);
    return returnMuteLevelFromUserId(user_id)
}

function clickCollapserButton(element) {
    collapserButton = returnSubClassSingletonElseStyleElement(element, collapserButtonClass);
    for (child of collapserButton.parentElement.parentElement.children) {
        if (child.classList.contains(collapserButton.dataset.id)) {
            if (child.style.visibility == 'collapse') {
                child.style.visibility = '';
                collapserButton.textContent = '\uFF0D';
            } else {
                child.style.visibility = 'collapse';
                //collapserButton.textContent = '\uFF0B';
                collapserButton.textContent = '\xa0';
            }
        }
    }
}

function returnNewCollapserElement(parentElement) {
    let collapserID = `gca_collapser_${collapserCount}`;
    collapserCount += 1;

    let collapserButton = document.createElement("div");
    collapserButton.id = collapserID;
    collapserButton.dataset.id = collapserID;

    collapserButton.classList.add(collapserButtonClass);
    collapserButton.textContent = '\uFF0D';

    if (parentElement.classList.contains('windowbg')) {
        collapserButton.style.color = '#bbb';
        collapserButton.style.border = 'solid 1px #bbb';

    } else if (parentElement.classList.contains('windowbg2')) {
        collapserButton.style.color = '#fff';
        collapserButton.style.border = 'solid 1px #fff';
    }

    collapserButton.style.borderRadius = '5px';
    //collapserButton.style.padding = '0px 2px';
    //collapserButton.style.lineHeight = '70%';
    collapserButton.style.padding = '0px';
    collapserButton.style.textAlign = 'center';
    collapserButton.style.width = '16px';

    collapserButton.style.fontSize = '10px';
    collapserButton.style.cursor = 'pointer';

    collapserButton.onclick = function() {
        for (child of this.parentElement.parentElement.children) {
            if (child.classList.contains(this.dataset.id)) {
                if (child.style.visibility == 'collapse') {
                    child.style.visibility = '';
                    this.textContent = '\uFF0D';
                } else {
                    child.style.visibility = 'collapse';
                    //this.textContent = '\uFF0B';
                    this.textContent = '\xa0';
                }
            }
        }
    }

    let collapserRow = baseFlex();
    collapserRow.className = collapserRowClass;
    collapserRow.style.padding = '0px';
    collapserRow.style.margin = '0px';
    collapserRow.style.justifyContent = 'flex-end'
    collapserRow.appendChild(collapserButton);

    return collapserRow;
}

function muteNewBorderNameAndSignature(recursionElement) {
    if (!recursionElement.dataset.muted) {
        recursionElement.dataset.borderLeft = recursionElement.style.borderLeft;

    }
    recursionElement.style.borderLeft = '';
    recursionElement.dataset.muted = true;
    newLeftCol = returnSubClassSingletonElseStyleElement(recursionElement, 'new_left_col');
    nameH4 = returnSubTagSingletonElseStyleElement(newLeftCol, 'h4');
    if (!nameH4.dataset.muted) {
        nameH4.dataset.opacity = nameH4.style.opacity;

    }
    nameH4.style.opacity = '25%';
    nameH4.dataset.muted = true;
    signature = returnSubClassSingletonElseStyleElement(newLeftCol, 'signature');
    if (!signature.dataset.muted) {
        signature.dataset.display = signature.style.display;

    }
    signature.style.display = 'none';
    signature.dataset.muted = true;
}

function unmuteNewBorderNameAndSignature(recursionElement) {
    recursionElement.style.borderLeft = recursionElement.dataset.borderLeft ? recursionElement.dataset.borderLeft : recursionElement.style.borderLeft;
    recursionElement.dataset.muted = false;

    newLeftCol = returnSubClassSingletonElseStyleElement(recursionElement, 'new_left_col');
    nameH4 = returnSubTagSingletonElseStyleElement(newLeftCol, 'h4');
    // just fyi... if condition ? return_true_condition: else return_false_condition;
    nameH4.style.opacity = nameH4.dataset.opacity ? nameH4.dataset.opacity : '';
    nameH4.dataset.muted = false;

    signature = returnSubClassSingletonElseStyleElement(newLeftCol, 'signature');
    signature.style.display = signature.dataset.display ? signature.dataset.display : '';
    signature.dataset.muted = false;
}

function returnStandardMuteOpacityInt(muteLevel) {
    // currently max - mute unless max mute level, then 20
    muteOpacityInt = Math.round(maxMuteLevel - (muteLevel));
    if (muteLevel >= middleMuteLevel) {
        muteOpacityInt = Math.round(maxMuteLevel - (muteLevel));
    }
    if (muteLevel >= maxMuteLevel) {
        muteOpacityInt = 20;
    }
    return muteOpacityInt;
}

function formatMutedElement(recursionElement, muteLevel, topLevel = true) {
    let recursionElementMuteLevel = recursionElement.dataset.muteLevel;
    if (!recursionElementMuteLevel) {
        recursionElementMuteLevel = 0;
    }
    if (muteLevel != recursionElementMuteLevel) {
        // changes to top level of post only
        if (topLevel) {
            let collapserRowElement = null;
            let collapserButton = null;

            if (muteLevel == maxMuteLevel) {
                // if element moved to max,
                // add collapser
                // mute info
                collapserRowElement = returnNewCollapserElement(recursionElement);
                collapserButton = returnSubClassSingletonElseStyleElement(collapserRowElement, collapserButtonClass);

                muteNewBorderNameAndSignature(recursionElement);
            } else if (recursionElementMuteLevel == maxMuteLevel) {
                // if element was at max,
                // remove collapser
                // unmute info
                collapserRowElement = returnSubClassSingletonElseStyleElement(recursionElement, collapserRowClass);
                collapserRowElement.remove();

                unmuteNewBorderNameAndSignature(recursionElement);
            }



            for (child of recursionElement.children) {
                if (muteLevel == maxMuteLevel) {
                    child.classList.add(collapserButton.dataset.id);
                }
                if (!child.classList.contains(gcaDontFadeThisClass)) {
                    child.style.opacity = `${returnStandardMuteOpacityInt(muteLevel)}%`;
                }

            }
            // reset muteing buttons
            if (muteLevel == minMuteLevel) {
                // no mute
                let increaseFadeButton = returnSubClassSingletonElseStyleElement(recursionElement, increaseFadeButtonClass);
                increaseFadeButton.style.opacity = 1;
                let decreaseFadeButton = returnSubClassSingletonElseStyleElement(recursionElement, decreaseFadeButtonClass);
                decreaseFadeButton.style.opacity = 0;
                let muteButton = returnSubClassSingletonElseStyleElement(recursionElement, muteButtonClass);
                muteButton.style.opacity = 1;
            } else if (muteLevel == maxMuteLevel) {
                // full mute
                recursionElement.insertBefore(collapserRowElement, recursionElement.firstChild);
                clickCollapserButton(recursionElement);

                let increaseFadeButton = returnSubClassSingletonElseStyleElement(recursionElement, increaseFadeButtonClass);
                increaseFadeButton.style.opacity = 0;
                let decreaseFadeButton = returnSubClassSingletonElseStyleElement(recursionElement, decreaseFadeButtonClass);
                decreaseFadeButton.style.opacity = 1;
                let muteButton = returnSubClassSingletonElseStyleElement(recursionElement, muteButtonClass);
                muteButton.style.opacity = 0;
            } else {
                // some fade
                let decreaseFadeButton = returnSubClassSingletonElseStyleElement(recursionElement, decreaseFadeButtonClass);
                decreaseFadeButton.style.opacity = 1;
                let increaseFadeButton = returnSubClassSingletonElseStyleElement(recursionElement, increaseFadeButtonClass);
                increaseFadeButton.style.opacity = 1;
                let muteButton = returnSubClassSingletonElseStyleElement(recursionElement, muteButtonClass);
                muteButton.style.opacity = 1;
            }
        }

        // set dataset elements
        recursionElement.dataset.muteLevel = muteLevel;

        for (child of recursionElement.children) {
            formatMutedElement(child, muteLevel, topLevel = false);
        }

        // execute fade process:

        // first: get original colors, etc
        if (!recursionElement.dataset.faded) {
            if (recursionElement.classList.contains('label')) {
                // skip -- do not edit
            } else if (recursionElement.classList.contains('btn-info')) {
                // if element is a button or a "new" label
                recursionElement.dataset.borderColor = recursionElement.style.borderColor;
                recursionElement.dataset.backgroundColor = recursionElement.style.backgroundColor;
            } else {
                recursionElement.dataset.color = recursionElement.style.color;
            }
            if (recursionElement.tagName == 'IMG') {
                recursionElement.dataset.display = recursionElement.style.display;
            }
        }
        // reset faded every time
        recursionElement.dataset.faded = muteLevel > minMuteLevel
        // if not muted, restore original colors
        if (muteLevel == minMuteLevel) {
            restoreOriginalColor(recursionElement);
            restoreRecursionImgElement(recursionElement);
        } else if (muteLevel < middleMuteLevel) {
            // maninely used to set color
            greyOutRecursionElement(recursionElement);
            restoreRecursionImgElement(recursionElement);
        } else if (muteLevel >= middleMuteLevel) {
            greyOutRecursionElement(recursionElement);
            removeRecursionImgElement(recursionElement);
        }
        // technically the maxMuteLevel edits here
        // are the same as >= middleMuteLevel:
        //
        //else if (muteLevel >= maxMuteLevel) {
        //    greyOutRecursionElement(recursionElement);
        //    removeRecursionImgElement(recursionElement);
        //}
    }
}

function restoreOriginalColor(recursionElement) {
    // just fyi... if condition ? return_true_condition: else return_false_condition;
    if (recursionElement.classList.contains('label')) {
        // skip
    } else if (recursionElement.classList.contains('btn-info')) {
        // if element is a button or a "new" label
        recursionElement.style.borderColor = recursionElement.dataset.borderColor ? recursionElement.dataset.borderColor : '';
        recursionElement.style.backgroundColor = recursionElement.dataset.backgroundColor ? recursionElement.dataset.backgroundColor : '';
    } else {
        recursionElement.style.color = recursionElement.dataset.color ? recursionElement.dataset.color : '';
    }
}

function greyOutRecursionElement(recursionElement) {
    // recursion for all lower level changes
    // buttons have white text not marked as white text
    if (recursionElement.classList.contains('label')) {
        // skip
    } else if (recursionElement.classList.contains('btn-info')) {
        // if element is a button or a "new" label
        recursionElement.style.backgroundColor = '#bbb';
        recursionElement.style.borderColor = '#aaa';

    } else {
        recursionElement.style.color = greyOutStandardColor;
    }
}

function restoreRecursionImgElement(recursionElement) {
    if (recursionElement.tagName == 'IMG') {
        recursionElement.style.display = recursionElement.dataset.display ? recursionElement.dataset.display : '';
    }
}

function removeRecursionImgElement(recursionElement) {
    if (recursionElement.tagName == 'IMG') {
        recursionElement.style.display = 'none';
    }
}

function muteIteration() {
    messages = document.querySelectorAll('.message_container');
    for (message of messages) {
        muteLevel = returnMuteLevelFromElement(message);
        formatMutedElement(message, muteLevel);
    }
}

function fullMute(muteButton) {
    let user_id = muteButton.dataset.userId;
    let muteLevel = maxMuteLevel;
    setMuteLevel(user_id, muteLevel);
    let toggleButton = returnSubClassSingletonElseStyleElement(muteButton.parentElement.parentElement, gcaFadeButtonClass);
    toggleButton.textContent = `Fade (${muteLevel}%)`;
    muteIteration();
    //console.log(`new muteLevel: ${muteLevel}`);
}

function increaseMute(increaseFadeButton) {
    let user_id = increaseFadeButton.dataset.userId;
    let muteLevel = returnMuteLevelFromUserId(user_id);
    muteLevel = Math.min(maxMuteLevel, muteLevel + muteClickUnits);
    setMuteLevel(user_id, muteLevel);
    let toggleButton = returnSubClassSingletonElseStyleElement(increaseFadeButton.parentElement.parentElement, gcaFadeButtonClass);
    toggleButton.textContent = `Fade (${muteLevel}%)`;
    muteIteration();
    //console.log(`new muteLevel: ${muteLevel}`);
}

function decreaseMute(decreaseFadeButton) {
    let user_id = decreaseFadeButton.dataset.userId;
    let muteLevel = returnMuteLevelFromUserId(user_id);
    muteLevel = Math.max(minMuteLevel, muteLevel - muteClickUnits);
    setMuteLevel(user_id, muteLevel);
    let toggleButton = returnSubClassSingletonElseStyleElement(decreaseFadeButton.parentElement.parentElement, gcaFadeButtonClass);
    toggleButton.textContent = `Fade (${muteLevel}%)`;
    muteIteration();
    //console.log(`new muteLevel: ${muteLevel}`);
}

function returnLastpostAuthorMuteLevel(elementContaningUserId) {
    let user_id = returnUserIDfromElement(elementContaningUserId);
    //console.log(user_id);
    let muteLevel = returnMuteLevelFromUserId(user_id)
    //console.log(muteLevel);
    if (muteLevel) {
        return muteLevel;
    } else {
        return minMuteLevel;
    }
}

/// END MUTE USERS UTILITIES, BUT CONTINUE UTILITIES ///

function returnUserIDfromElement(element) {
    let anchors = element.getElementsByTagName('a');
    for (anchor of anchors) {
        if (anchor.href.includes('u=')) {
            let this_url = new URL(anchor.href);
            let user_id = parseInt(this_url.searchParams.get('action').split('u=')[1]);
            if (user_id) {
                return user_id;
            } else {
                console.log('ERROR ERROR ERROR!')
                console.log('ERROR ERROR ERROR!')
                console.log('ERROR ERROR ERROR!')
                console.log('ERROR ERROR ERROR!')
                throw new Error(`${anchor.href} does not end "action" with user id `);
            }
        }
    }
}

function timeDifference(current, previous) {
    var elapsed = current - previous;
    let time = 0;
    let unit = '';
    if (elapsed < msPerMinute) {
        time = Math.round(elapsed / 1000);
        unit = 'second';
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

//////////// END UTILITIES ////////////

//////////// TOPIC & BOARD FUNCTIONS ////////////

function bodyToFlex() {
    body.style.display = "flex";
    body.style.flexDirection = "column";
    body.style.justifyContent = "space-between";
    body.style.paddingTop = "95px";
    addBorder(body, 'red', px = 10);
}

function hideFatalAndClearFix() {
    let element = document.getElementById('fatal_error');
    element.style.display = "none";
    let elements = document.querySelectorAll('.clearfix');
    for (elem of elements) {
        elem.style.display = "none";
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
                ulc.style.width = 'fit-content';
                ulc.style.visibility = 'visible';
            } else {
                if (ulc.style.visibility == 'collapse') {
                    ulc.style.width = 'fit-content';
                    ulc.style.visibility = 'visible';

                } else if (ulc.style.visibility == 'visible') {
                    ulc.style.width = '0px';
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

function pageLinksToButtons() {
    pageLinks = document.getElementsByClassName('pagelinks');
    for (pageLink of pageLinks) {
        pageLink.style.fontSize = '14px';
        //pageLink.style.display = 'flex';
        //pageLink.style.justifyContent = 'center';
        //pageLink.style.alignItems = 'center';
        //pageLink.style.gap = '5px';

        for (child of pageLink.children) {
            //console.log(child.tagName);
            if (child.tagName == "A") {
                child.style.padding = '1px 6px';
                child.style.border = 'solid 1px #eee';
                child.style.borderRadius = '3px';
            }
        }
    }
}

function reloadPage(db) {
    location.reload();
}



function addExtensionFooterCitation() {
    let footerSection = document.getElementById('footer_section');
    let resetList = returnSubClassSingletonElseStyleElement(footerSection, 'reset');

    let newList = document.createElement('ul');
    newList.className = 'reset';
    let listItem = document.createElement('li');
    let niceGcaAnchor = document.createElement('a');
    niceGcaAnchor.textContent = "Nice GCA Extension";
    niceGcaAnchor.href = "https://github.com/scoofy/GCA-Extension";
    listItem.appendChild(niceGcaAnchor);
    newList.appendChild(listItem);

    if (Object.keys(user_dict).length) { // if user_dict has been edited
        let spacerListItem = document.createElement('li');
        let spacerSpan = document.createElement('span');
        spacerSpan.textContent = "\u2014";
        spacerListItem.appendChild(spacerSpan);
        newList.appendChild(spacerListItem);


        let resetListItem = document.createElement('li');
        let resetNiceGcaAnchor = document.createElement('a');
        resetNiceGcaAnchor.textContent = "Reset Extension";
        resetNiceGcaAnchor.onclick = function() {
            if (confirm("CAUTION! You are about to fully reset the Nice GCA Extension. Are you sure you want to remove all of the data you've saved and reset the extension?") == true) {
                factoryReset();
            }
        }
        resetListItem.appendChild(resetNiceGcaAnchor);
        newList.appendChild(resetListItem);
    }
    resetList.insertAdjacentElement('afterend', newList);
}
//////////// END TOPIC & BOARD FUNCTIONS ////////////

//////////// TOPIC PAGE ONLY FUNCTIONS ////////////
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
            img.style.maxWidth = '';
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

function recursiveBBCodeTagRemoval(recursionElement) {
    for (childElement of recursionElement.children) {
        recursiveBBCodeTagRemoval(childElement);
    }
    for (node of recursionElement.childNodes) {
        if (node.nodeName == "#text") {
            for (bbCodeSnippit of bbCodeClosingTags) {
                node.nodeValue = node.nodeValue.replace(bbCodeSnippit, ' ');
            }
        }
    }
}

function removeOrphanBBCodeTags(postElement) {
    let inner = returnSubClassSingletonElseStyleElement(postElement, 'inner');
    recursiveBBCodeTagRemoval(inner);
}

function removeThirdLineBreaks(element) {
    let brsToRemove = [];
    let brs = element.getElementsByTagName('br');
    let skippableNonInlineElements = ["IMG", "#text"];
    let acceptableParents = skippableNonInlineElements.concat(skippableInLineElements);
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
    let afterFirstColon = smallTextDiv.textContent.substring(smallTextDiv.textContent.indexOf(':') + 1);
    let postTimeStr = afterFirstColon.replace('»', '').trim();
    let relativeTimeOfPost = postTimeStrToDateObj(postTimeStr);
    return relativeTimeOfPost;
}

function returnBoardTableRowDateObj(boardTableRow) {
    let lastpost = returnSubClassSingletonElseStyleElement(boardTableRow, 'lastpost');
    let timeTextContent = lastpost.textContent;
    timeTextContent = timeTextContent.trim();
    timeTextContent = timeTextContent.split('by', 1)[0];
    postTimeStr = timeTextContent.trim();
    let relativeTimeOfPost = postTimeStrToDateObj(postTimeStr);
    return relativeTimeOfPost;
}

function returnBoardTableRowTimeAgo(boardTableRow) {
    let relativeTimeOfPost = returnBoardTableRowDateObj(boardTableRow);
    let timeAgo = timeDifference(relativeTimeNow, relativeTimeOfPost);
    return timeAgo;
}

function returnPostTimeAgo(messageContainerElement) {
    let relativeTimeOfPost = returnPostDateObj(messageContainerElement);
    let timeAgo = timeDifference(relativeTimeNow, relativeTimeOfPost);
    return timeAgo;
}

function addRespondButtonClasses(newButton) {
    let respondButtonClasses = ['btn', 'btn-info', 'btn-sm'];
    for (btnClass of respondButtonClasses) {
        newButton.classList.add(btnClass);
    }
    return newButton;
}

function createMuteButtons(user_id) {
    let muteButtonFlexAnchor = document.createElement("a");
    muteButtonFlexAnchor.classList.add(gcaFadeElementClass);
    muteButtonFlexAnchor.classList.add(gcaDontFadeThisClass);

    muteButtonFlexAnchor.padding = '0px';
    muteButtonFlexAnchor.margin = '0px';
    muteButtonFlexAnchor.border = 'none';
    muteButtonFlexAnchor.textContent = '';

    muteButtonFlexAnchor.style.display = 'flex';
    muteButtonFlexAnchor.style.flexDirection = 'column';

    let toggleButton = document.createElement("a");
    toggleButton = addRespondButtonClasses(toggleButton);
    toggleButton.classList.add(gcaFadeElementClass);
    toggleButton.classList.add(gcaFadeButtonClass);
    toggleButton.classList.add(gcaDontFadeThisClass);

    toggleButton.padding = '0px';
    toggleButton.margin = '0px';

    // quick clones with classes added
    let increaseFadeButton = toggleButton.cloneNode();
    let decreaseFadeButton = toggleButton.cloneNode();
    let muteButton = toggleButton.cloneNode();

    let muteLevel = returnMuteLevelFromUserId(user_id);

    toggleButton.textContent = 'Fade';
    toggleButton.onclick = function() {
        if (this.textContent == 'Fade') {
            this.textContent = `Fade (${muteLevel}%)`;
            this.nextElementSibling.style.visibility = '';
        } else {
            this.textContent = 'Fade';
            this.nextElementSibling.style.visibility = 'collapse';
        }
    }

    muteButtonFlexAnchor.appendChild(toggleButton);

    let buttonHolderFlex = baseColFlex();
    buttonHolderFlex.classList.add(gcaFadeElementClass);
    buttonHolderFlex.classList.add(gcaDontFadeThisClass);

    buttonHolderFlex.padding = '0px';
    buttonHolderFlex.margin = '0px';
    buttonHolderFlex.style.visibility = 'collapse';

    // no adding classed because cloned
    increaseFadeButton.classList.add(increaseFadeButtonClass);
    increaseFadeButton.textContent = 'More';
    increaseFadeButton.dataset.userId = user_id;
    increaseFadeButton.onclick = function() {
        increaseMute(this);
    }
    if (muteLevel == maxMuteLevel) {
        increaseFadeButton.style.opacity = 0;
    }

    // no adding extra classed because cloned
    decreaseFadeButton.classList.add(decreaseFadeButtonClass);
    decreaseFadeButton.textContent = 'Less';
    decreaseFadeButton.style.textDecoration = 'none';
    decreaseFadeButton.style.userSelect = 'none';
    decreaseFadeButton.dataset.userId = user_id;
    decreaseFadeButton.onclick = function() {
        decreaseMute(this);
    }
    if (muteLevel == minMuteLevel) {
        decreaseFadeButton.style.opacity = 0;
    }

    // no adding classed because cloned
    muteButton.classList.add(muteButtonClass);
    muteButton.textContent = 'Mute';
    muteButton.dataset.userId = user_id;
    muteButton.onclick = function() {
        fullMute(this);
    }
    if (muteLevel == maxMuteLevel) {
        muteButton.style.opacity = 0;
    }

    buttonHolderFlex.appendChild(increaseFadeButton);
    buttonHolderFlex.appendChild(decreaseFadeButton);
    buttonHolderFlex.appendChild(muteButton);

    muteButtonFlexAnchor.appendChild(buttonHolderFlex);

    return muteButtonFlexAnchor;
}


function messageIteration(messageContainerElement) {
    let user_id = returnUserIDfromElement(messageContainerElement);

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
    //left_col.style.flexShrink = 3;
    left_col.style.flex = "0 1 25%";
    let right_col = baseColFlex();
    right_col.className = "new_right_col"
    //right_col.style.maxWidth = '75%';
    //right_col.style.flexShrink = 1;
    //right_col.style.flexGrow = 3;
    right_col.style.flex = '0 1 75%';

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
    removeOrphanBBCodeTags(post);
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


    let infoButton = document.createElement("a");
    infoButton = addRespondButtonClasses(infoButton);
    infoButton.classList.add("extensionNewInfoButton");

    //console.log(infoButton);
    infoButton.textContent = "Info";
    infoButton.onclick = function() {
        if (footer_info_col.style.visibility == 'collapse') {
            footer_info_col.style.visibility = '';
        } else {
            footer_info_col.style.visibility = 'collapse';
        }
    }
    buttons.appendChild(infoButton);

    // only create mute buttons if logged in
    let loggedOut = document.getElementById('guest_form');
    if (!loggedOut) { // if logged in
        let muteButtonFlexAnchor = createMuteButtons(user_id);
        buttons.appendChild(muteButtonFlexAnchor);
    }

    footer_info_col.appendChild(subject_info);
    footer_info_col.appendChild(moderation);
    footer_button_col.appendChild(buttons);
    footer_button_col.style.flexWrap = "nowrap";

    footer_flex.appendChild(footer_info_col);
    footer_flex.appendChild(footer_button_col);
    footer_flex.style.justifyContent = 'space-between';
    // don't fade footer items
    footer_flex.classList.add(gcaDontFadeThisClass);


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

    let colMd9 = returnSubClassSingletonElseStyleElement(body, 'col-md-9');
    colMd9.style.margin = '0px';
    colMd9.style.padding = '0px';
    colMd9.style.display = 'flex';
    colMd9.style.flexWrap = 'nowrap';
    colMd9.style.justifyContent = "center";
    colMd9.style.alignItems = "center";

    colMd9.style.width = 'fit-content';
    colMd9.style.flexShrink = '0';
    colMd9.style.flexGrow = '20';

    for (child of colMd9.children) {
        //console.log('child');
        //console.log(child);
        child.style.margin = '0px';
        child.style.padding = '0px';
        addBorder(child, 'blue');
        for (grandchild of child.children) {
            //console.log('grandchild');
            //console.log(grandchild);
            grandchild.style.margin = '0px';
            //grandchild.style.padding = '0px';
            addBorder(grandchild, 'purple');
        }
    }
    let searchForm = document.getElementById('search_form');
    searchForm.style.display = 'flex';
    searchForm.style.justifyContent = "center";
    searchForm.style.alignItems = "center";
    searchForm.style.gap = "5px";


    //let searchForm = document.getElementById('search_form');

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

function fullTopicPageIteration(db) {
    user_dict = db.user_dict;
    if (!user_dict) {
        user_dict = {}
    }

    bodyToFlex();

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
    cleanerNavBar();
    pageLinksToButtons();
    addExtensionFooterCitation();

    muteIteration();

    //console.log('FULL PAGE ITERATION!!!')
}
//////////// END TOPIC PAGE ONLY FUNCTIONS ////////////

//////////// BOARD PAGE ONLY FUNCTIONS ////////////

function boardPageContainerFunctions() {
    let containers = document.getElementsByClassName('container');
    let boardContainer = containers[1];
    boardContainer.style.display = 'flex';
    boardContainer.style.flexDirection = 'column';
    boardContainer.style.gap = '10px';
}

function moveInfoToSearchArea() {
    let rowDiv = returnSubClassSingletonElseStyleElement(body, 'row');
    rowDiv.style.display = "flex";
    rowDiv.style.justifyContent = "space-between";
    rowDiv.style.alignItems = "center";
    rowDiv.style.gap = "5px";
    rowDiv.id = "nice_gca_board_search_row";


    addBorder(rowDiv, 'red');
    let descriptionBoard = returnSubClassSingletonElseStyleElement(body, 'description_board')
    descriptionBoard.style.margin = '0px';
    descriptionBoard.style.padding = '5px';
    descriptionBoard.style.flexShrink = '3';
    descriptionBoard.style.flexWrap = 'wrap';


    rowDiv.appendChild(descriptionBoard);
}

function removeBackButton() {
    let centerTexts = document.getElementsByClassName('centertext');
    for (centerText of centerTexts) {
        //console.log(centerText)
        for (child of centerText.children) {
            //console.log('child');
            //console.log(child);
            //console.log(child.href);
            if (child.href.startsWith('javascript')) {
                centerText.style.display = 'none';
            }
        }
    }
}

function formatMutedLastpostAuthor(lastpost, muteLevel) {
    for (node of lastpost.childNodes) {
        if (node.nodeName == "#text") {
            if (node.textContent.trim()) {
                if (node.textContent.trim().startsWith('by')) {
                    node.textContent = '';
                }
            }
        }
    }
    let anchors = lastpost.getElementsByTagName('a');
    for (anchor of anchors) {
        if (anchor.href.includes('u=')) {
            anchor.classList.add('gca_muted_comment_author_anchor');
            anchor.textContent = `by ${anchor.textContent}`;
            anchor.style.textDecoration = 'none';
            anchor.style.color = greyOutStandardColor;
            anchor.style.cursor = 'default';
            if (muteLevel == maxMuteLevel) {
                anchor.style.opacity = '0%'
            }
        }
    }
}

function formatMutedBoardTableRow(boardTableRow, muteLevel) {
    // Here's my thinking, if not serious muting, do nothing
    // mild muting could just be to remove annoying colors, etc.
    if (muteLevel >= middleMuteLevel) {
        let lastpost = returnSubClassSingletonElseStyleElement(boardTableRow, 'lastpost');
        let lastpostImg = returnSubTagSingletonElseStyleElement(lastpost, 'img');
        if (muteLevel == maxMuteLevel) {
            lastpostImg.style.opacity = "4%"
        } else if (muteLevel >= middleMuteLevel) {
            lastpostImg.style.opacity = "40%"
        }
        formatMutedLastpostAuthor(lastpost, muteLevel);
    }

}

function formatBoardTableRowToUseTimeAgo(boardTableRow, timeAgo) {
    let lastpost = returnSubClassSingletonElseStyleElement(tableRow, 'lastpost');

    for (node of lastpost.childNodes) {
        if (node.nodeName == "#text") {
            if (node.textContent.trim()) {
                if (!node.textContent.trim().startsWith('by')) {
                    newSpan = document.createElement('span');
                    newSpan.textContent = timeAgo
                    newSpan.style.fontWeight = 'bold';
                    node.after(newSpan);
                    node.remove()
                    //lastpostClone.appendChild(newSpan)
                }
            }
        } else if (node.nodeName == "STRONG") {
            // do nothing
            node.textContent = '';
        }
    }
}

function allBoardPostsIteration() {
    let tBody = returnSubTagSingletonElseStyleElement(body, "tbody");
    for (tableRow of tBody.children) {
        if (tableRow.tagName == "TR") {
            let timeAgo = returnBoardTableRowTimeAgo(tableRow);
            formatBoardTableRowToUseTimeAgo(tableRow, timeAgo);
            let lastpost = returnSubClassSingletonElseStyleElement(tableRow, 'lastpost');
            let muteLevel = returnLastpostAuthorMuteLevel(lastpost);
            if (muteLevel) {
                formatMutedBoardTableRow(tableRow, muteLevel);
            }
        }
    }
}

function fullBoardPageIteration(db) {
    user_dict = db.user_dict;
    if (!user_dict) {
        user_dict = {}
    }

    bodyToFlex();
    hideFatalAndClearFix();
    replyListToHamburger();
    removeContainerHr();
    formatFirstRow();
    cleanerNavBar();

    boardPageContainerFunctions();
    moveInfoToSearchArea();
    removeBackButton();
    pageLinksToButtons();

    allBoardPostsIteration()

    addExtensionFooterCitation();
    //console.log('FULL PAGE ITERATION!!!')
}

//////////// END BOARD PAGE ONLY FUNCTIONS ////////////


//////////// LAUNCH EXTENSION ////////////
launchExtension();

//console.log('END Extension')


// WHAT?



// MOAR SPACE!



// MOAR!



// MOAR!



// END OF LINE