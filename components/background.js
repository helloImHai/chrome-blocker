const BLACKLIST_KEY = "cblock-blacklisted-rewq";
const IS_ON_KEY = "cblock-iso-rewq";
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

function getIsOn() {
    let isOn = localStorage.getItem(IS_ON_KEY);
    return isOn == "true";
}

function extractHostname(url) {
    var hostname;
    //find & remove protocol (http, ftp, etc.) and get hostname

    if (url.indexOf("//") > -1) {
        hostname = url.split("/")[2];
    } else {
        hostname = url.split("/")[0];
    }

    //find & remove port number
    hostname = hostname.split(":")[0];
    //find & remove "?"
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

chrome.webRequest.onBeforeSendHeaders.addListener(
    (msg) => {
        // Guard clause if turned off or no blacklist
        if (!getIsOn() || !getBlacklist()) return;

        const blackList = getBlacklist();
        const { url } = msg;
        const hostname = extractHostname(url);

        // Check if hostname is whitelisted
        if (whitelisted(hostname)) {
            return;
        }

        // console.log(`Blocked request to ${hostname}`);

        for (let i = 0; i < blackList.length; i++) {
            const blockedSite = blackList[i];
            if (hostname.includes(blockedSite)) {
                return { cancel: true };
            }
        }
    },
    {
        urls: ["https://*/*"],
        types: ["main_frame"],
    },
    ["blocking"]
);
