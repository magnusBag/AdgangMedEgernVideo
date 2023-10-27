
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === "LookForWords") {
        findWordsInBody();
    }
});
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === "RemoveLookForWords") {
        reverseTraverseNodes(document.body);
    }
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === "LookForWordsEgern") {
        console.log("LookForWordsEgern");
        findWordsInBody(["Egern","egern"]);
    }
});

function findWordsInBody(wordsToFind) {
    // List of specific words to look for
    let activeIframe = null;
    if (wordsToFind) {
        specialWords = wordsToFind;
    }
    // Start traversal from the document body
    traverseNodes(document.body, specialWords);

    // Attach event handlers to the span elements
    const specialWordElements = document.querySelectorAll('.special-word');
    specialWordElements.forEach(element => {
        element.addEventListener('mouseenter', wordsToFind ? handleSpecialWordHoverEgern : handleSpecialWordHover);
        element.addEventListener('mouseout', function(event) {
            // find the bounding rect for the element, of the mouse is outside of the rect, remove the iframe, or the mouse is the in a 5px border around the iframe

            const rect = event.target.getBoundingClientRect();
            const isOutsideMinusBorder = event.clientX < rect.left + 5 || event.clientX > rect.right - 5 || event.clientY < rect.top + 5 || event.clientY > rect.bottom - 5;
            if (isOutsideMinusBorder) {
                const iframe = document.getElementById('tegnPlayer_#fff1234');
                if (iframe) {
                    iframe.remove();
                }
            }
        });
    });
}

 // Event handler function for special words
 function handleSpecialWordHover(event) {
    if (document.getElementsByClassName("tegnPlayer").length !== 0) {
        return;
    }
    // Create an iframe
    const iframe = document.createElement('video');
    //handle that word can also be a number and not a string
    const word = event.target.innerText;
    const id = wordList[word] ? wordList[word] : word;
    iframe.src = `https://adgang-med-egern.caspermb.dk/raw/${id}.mp4`;
    iframe.autoplay = true;
    iframe.loop = true;
    iframe.muted = true;
    iframe.style.width = '100%';
    iframe.style.height = '100%';
    iframe.style.position = 'fixed';
    iframe.id = 'tegnPlayer_#fff1234';
    iframe.classList.add('tegnPlayer');
    //add border to iframe
    iframe.style.border = '2px solid gray';
    iframe.style.borderRadius = '14px';

    // Position the iframe at the initial click position
   
    iframe.style.overflow = 'hidden';

    // Set iframe dimensions, feel free to adjust
    iframe.style.width = '165px';
    iframe.style.height = '124px';

    // Append the iframe to the body
    if (!document.getElementsByClassName("tegnPlayer").length > 0) 
        document.body.appendChild(iframe);
    // Assign the active iframe
    activeIframe = iframe;
    // Listen for mousemove events to move the iframe
    document.addEventListener('mousemove', moveIframe);
}

// Event handler function for special words
function handleSpecialWordHoverEgern(event) {
    if (document.getElementsByClassName("tegnPlayer").length !== 0) {
        return;
    }
    // Create an iframe
    const iframe = document.createElement('iframe');
    //handle that word can also be a number and not a string
    iframe.src = `https://asset.dr.dk/imagescaler/?protocol=https&server=www.dr.dk&file=%2Fimages%2Farticle%2F2017%2F04%2F12%2Fgraa_egern.jpg&scaleAfter=crop&quality=70&w=165&h=125`;
    iframe.style.width = '100%';
    iframe.style.height = '100%';
    iframe.style.position = 'fixed';
    iframe.id = 'tegnPlayer_#fff1234';
    iframe.classList.add('tegnPlayer');
    //add border to iframe
    iframe.style.borderRadius = '14px';

    // Position the iframe at the initial click position
   
    iframe.style.overflow = 'hidden';

    // Set iframe dimensions, feel free to adjust
    iframe.style.width = '166px';
    iframe.style.height = '126px';

    // Append the iframe to the body
    if (!document.getElementsByClassName("tegnPlayer").length > 0) 
        document.body.appendChild(iframe);
    // Assign the active iframe
    activeIframe = iframe;
    // Listen for mousemove events to move the iframe
    document.addEventListener('mousemove', moveIframe);
}
// Function to move the iframe
function moveIframe(event) {
    if (activeIframe) {
        const mouseX = event.clientX;
        const mouseY = event.clientY;

        // Adjusted position to place iframe above the mouse
        activeIframe.style.left = (mouseX - 80) + 'px'; // Half of iframe width to center
        activeIframe.style.top = (mouseY - 142) + 'px'; // Height of iframe plus some padding to place above

    }
}

function traverseNodes(node, specialWords) {
    if (node.nodeType === Node.TEXT_NODE) {
        const regex = new RegExp(`\\b(${specialWords.join('|')})\\b`, 'g');
        const replacedText = node.nodeValue.replace(regex, '<span class="special-word" style="background-color:pink;">$1</span>');
        
        if (replacedText !== node.nodeValue) {
            const div = document.createElement('div');
            div.innerHTML = replacedText;
            
            let parent = node.parentNode;
            while (div.firstChild) {
                parent.insertBefore(div.firstChild, node);
            }
            parent.removeChild(node);
        }
    } else {
        Array.from(node.childNodes).forEach(childNode => traverseNodes(childNode, specialWords));
    }
}

function reverseTraverseNodes(node) {
    if (node.nodeType === Node.ELEMENT_NODE && node.classList.contains('special-word')) {
        const textNode = document.createTextNode(node.textContent);
        node.parentNode.replaceChild(textNode, node);
    } else {
        Array.from(node.childNodes).forEach(childNode => reverseTraverseNodes(childNode));
    }
}
