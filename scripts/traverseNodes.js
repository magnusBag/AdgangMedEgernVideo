// function traverseNodes(node, specialWords) {
//     if (node.nodeType === Node.TEXT_NODE) {
//         let parent = node.parentNode;
//         let text = node.nodeValue.trim();
//         let replacedText = text;

//         for (const word of specialWords) {
//             replacedText = replacedText.replace(new RegExp(`\\b${word}\\b`, 'g'), `<span class="special-word" style="background-color:pink;">${word}</span>`);
//         }

//         if (replacedText !== text) {
//             const div = document.createElement('div');
//             div.innerHTML = replacedText;
//             while (div.firstChild) {
//                 parent.insertBefore(div.firstChild, node);
//             }
//             parent.removeChild(node);
//         }
//     }

//     for (const childNode of Array.from(node.childNodes)) {
//         traverseNodes(childNode);
//     }
// }

export function traverseNodes(node, specialWords) {
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

export function reverseTraverseNodes(node) {
    if (node.nodeType === Node.ELEMENT_NODE && node.classList.contains('special-word')) {
        const textNode = document.createTextNode(node.textContent);
        node.parentNode.replaceChild(textNode, node);
    } else {
        Array.from(node.childNodes).forEach(childNode => reverseTraverseNodes(childNode));
    }
}
