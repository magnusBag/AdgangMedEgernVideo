document.getElementById('btn_to_turn_on_123123').addEventListener('click', function() {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        var activeTab = tabs[0];
        const btn = document.getElementById('btn_to_turn_on_123123');
        let span = btn.children[0];
        toggleDisableOnOtherBtn(btn);
        chrome.tabs.sendMessage(activeTab.id, {"action": span.innerHTML == 'Tænd' ?"LookForWords":"RemoveLookForWords"}, function(response) {
            span.innerHTML = span.innerHTML === 'Tænd' ? 'Sluk' : 'Tænd';
        });
    });
});

document.getElementById('btn_to_turn_on_egern').addEventListener('click', function() {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        var activeTab = tabs[0];
        const btn = document.getElementById('btn_to_turn_on_egern');
        let span = btn.children[0];
        toggleDisableOnOtherBtn(btn);
        chrome.tabs.sendMessage(activeTab.id, {"action": span.innerHTML == 'Tænd Egern Mode' ?"LookForWordsEgern":"RemoveLookForWords"}, function(response) {
            span.innerHTML = span.innerHTML === 'Tænd Egern Mode' ? 'Sluk' : 'Tænd Egern Mode';
        });
    });
});

function toggleDisableOnOtherBtn(btn) {
    const otherBtn = btn.id === 'btn_to_turn_on_123123' ? document.getElementById('btn_to_turn_on_egern') : document.getElementById('btn_to_turn_on_123123');
    otherBtn.disabled = !otherBtn.disabled;
}