async function get_is_on() {
    return (await chrome.storage.sync.get("cb_is_on")).cb_is_on;
}

async function get_blacklist() {
    return (await chrome.storage.sync.get('cb_blacklist')).cb_blacklist;
}

const WHITELIST = [
    "google",
    "maxcdn.bootstrapcdn",
    "cdn.jsdelivr.net",
    "fonts.gstatic",
];

function extractHostname(url) {
    var hostname;
    //find & remove protocol (http, ftp, etc.) and get hostname

    if (url.indexOf("//") > -1) {
        hostname = url.split("/")[2];
    } else {
        hostname = url.split("/")[0];
    }

    //find & remove params (after ?) 
    hostname = hostname.split("?")[0];

    return hostname;
}

function whitelisted(hostname) {
    for (let i = 0; i < WHITELIST.length; i++) {
        if (hostname.includes(WHITELIST[i])) {
            return true;
        }
    }
    return false;
}

function block(tabId, rule) {
    chrome.scripting.executeScript({
      target: { tabId: tabId },
      files: ['components/block.js']
    }, function () {
        chrome.tabs.sendMessage(tabId, rule);
    });
}

async function blockedByRule(url) {
    console.log(`[cb] url: ${url}`)
    if (!(await get_is_on())) return;
    let blackList = await get_blacklist();
    const hostname = extractHostname(url);
    for (let i = 0; i < blackList.length; i++) {
        const blockedSite = blackList[i];
        if (hostname.includes(blockedSite)) {
            console.log(`[cb] should block ${blockedSite} for rule ${hostname}`);
            return blockedSite;
        }
    }
    return null;
}

chrome.tabs.onUpdated.addListener(async function(tabId, changeInfo, tab) {
    if (changeInfo["status"] == null) return;
    let rule = await blockedByRule(tab.url)
    if (rule) {
        block(tabId, rule)
    }
});
