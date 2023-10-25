document.getElementById('btn_to_turn_on_123123').addEventListener('click', function() {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        var activeTab = tabs[0];
        chrome.tabs.sendMessage(activeTab.id, {"action": "LookForWords"}, function(response) {
            // Now, you have the content in the response.content
            console.log(response.content);
        });
    });
});