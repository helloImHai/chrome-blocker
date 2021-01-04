const KEY = "cblock-blacklisted"

function getBlacklist() {
    let blackList = localStorage.getItem(KEY);
  
    if (!blackList) {
        return []
    }
  
    if (!Array.isArray(JSON.parse(blackList))) {
        setBlackList([])
        return []
    }
  
    return JSON.parse(blackList);
}
  
chrome.webRequest.onBeforeSendHeaders.addListener(msg => {
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