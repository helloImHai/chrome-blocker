const BLACKLIST_KEY = "cblock-blacklisted"
const IS_ON_KEY = "cblock-ison"

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
    console.log(isOn)
    return isOn == "true"
}
  
chrome.webRequest.onBeforeSendHeaders.addListener(msg => {
    // Guard clause if turned off
    console.log(getIsOn())
    if (!getIsOn()) return;

    const blackList = getBlacklist()
    const {url} = msg
    for (let i = 0; i < blackList.length; i++) {
        const blockedSite = blackList[i]
        if (url.includes(blockedSite)) {
            return {cancel: true}
        }
    }
}, 
{
    urls: ["<all_urls>"]
},
["blocking"])