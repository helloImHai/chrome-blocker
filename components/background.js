async function get_is_on() {
    return (await chrome.storage.sync.get("cb_is_on")).cb_is_on;
}

async function get_blacklist() {
    return (await chrome.storage.sync.get('cb_blacklist')).cb_blacklist;
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
            console.log(`[cb] should block ${hostname} for rule ${blockedSite}`);
            return blockedSite;
        }
    }
    return null;
}

function set_icon(is_on) {
    let iconPath = is_on ? "../icon128.png" : "../icon128_bw.png";
    chrome.action.setIcon({ path: iconPath });
}

async function check_and_block(tabId, tab) {
    let rule = await blockedByRule(tab.url)
    if (rule) {
        block(tabId, rule)
    }
}

async function check_block_current_tab() {
    if (!await get_is_on()) return;
    chrome.tabs.query({ active: true, currentWindow: true }, async function (tabs) {
        // since only one tab should be active and in the current window at once
        // the return variable should only have one entry
        var tab = tabs[0];
        await check_and_block(tab.id, tab)
    });
}

async function setup() {
    set_icon(await get_is_on())

    chrome.tabs.onUpdated.addListener(check_block_current_tab);
    chrome.tabs.onActivated.addListener(check_block_current_tab);
    chrome.storage.sync.onChanged.addListener(async function(changes) {
        await check_block_current_tab()
        if (!changes.cb_is_on) return;
        set_icon(changes.cb_is_on.newValue)
    });
}

setup();
