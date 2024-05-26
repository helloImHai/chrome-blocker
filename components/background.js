// const BLACKLIST_KEY = "cblock-blacklisted-rewq";
// const IS_ON_KEY = "cblock-iso-rewq";
const WHITELIST = [
    "google",
    "maxcdn.bootstrapcdn",
    "cdn.jsdelivr.net",
    "fonts.gstatic",
];

function getBlacklist() {
    let blackList = localStorage.getItem(BLACKLIST_KEY);
    try {
        return JSON.parse(blackList);
    } catch (error) {
        return [];
    }
}

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

console.log("background code running..");

function injectScript(tabId) {
    chrome.scripting.executeScript({
      target: { tabId: tabId },
      files: ['components/block.js']
    });
}

function checkUrl(url) {
    console.log(`[chrome-blocker] url: ${url}`)
    if (!Utils.getIsOn() || !getBlacklist()) return;

    const blackList = getBlacklist();
    const hostname = extractHostname(url);
    for (let i = 0; i < blackList.length; i++) {
        const blockedSite = blackList[i];
        if (hostname.includes(blockedSite)) {
            console.log(`[cb] should block ${blockedSite} for rule ${hostname}`);
            return false;
        }
    }
    return true;
}

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    if (changeInfo["status"] == null) return;
    if (checkUrl(tab.url)) {
        return;
    }
    injectScript(tabId);
});

// chrome.webRequest.onBeforeSendHeaders.addListener(
//     (msg) => {
//         console.log("hello");
//         // Guard clause if turned off or no blacklist
//         if (!Utils.getIsOn() || !getBlacklist()) return;

        
//         // Check if hostname is whitelisted
//         if (whitelisted(hostname)) {
//             return;
//         }

//         // console.log(`Blocked request to ${hostname}`);

//         
//     },
//     {
//         urls: ["https://*/*"],
//         types: ["main_frame"],
//     },
//     ["blocking"]
// );
