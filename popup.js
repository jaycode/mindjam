let viewOptions = document.getElementById('viewOptions');
viewOptions.onclick = function(e) {
  chrome.runtime.openOptionsPage();
}
