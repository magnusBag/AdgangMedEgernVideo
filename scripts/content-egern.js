
const specialWords = ["Egern","egern"];

// When receiving a message from the popup
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === "LookForWords") {
        findWordsInBody();
    }
});
function findWordsInBody() {
    // List of specific words to look for
    let activeIframe = null;
    // Start traversal from the document body
    traverseNodes(document.body);

    // Attach event handlers to the span elements
    const specialWordElements = document.querySelectorAll('.special-word');
    specialWordElements.forEach(element => {
        element.addEventListener('mouseenter', handleSpecialWordHover);
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



// Helper function to traverse DOM nodes recursively
function traverseNodes(node) {
    if (node.nodeType === Node.TEXT_NODE) {
        let parent = node.parentNode;
        let text = node.nodeValue.trim();
        let replacedText = text;

        for (const word of specialWords) {
            replacedText = replacedText.replace(new RegExp(`\\b${word}\\b`, 'g'), `<span class="special-word" style="background-color:pink;">${word}</span>`);
        }

        if (replacedText !== text) {
            const div = document.createElement('div');
            div.innerHTML = replacedText;
            while (div.firstChild) {
                parent.insertBefore(div.firstChild, node);
            }
            parent.removeChild(node);
        }
    }

    for (const childNode of Array.from(node.childNodes)) {
        traverseNodes(childNode);
    }
}

 // Event handler function for special words
 function handleSpecialWordHover(event) {
    if (document.getElementsByClassName("tegnPlayer").length !== 0) {
        return;
    }
    // Create an iframe
    const iframe = document.createElement('iframe');
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
