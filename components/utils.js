const Utils = (function () {
    async function get_is_on() {
        console.log((await chrome.storage.sync.get("cb_is_on")).cb_is_on)
        return (await chrome.storage.sync.get("cb_is_on")).cb_is_on;
    }
    async function set_is_on(isOn) {
        return await chrome.storage.sync.set({"cb_is_on": isOn});
    }
    async function get_blacklist() {
        data = await chrome.storage.sync.get('cb_blacklist')
        return data.cb_blacklist;
    }
    async function set_blacklist(blackList) {
        return await chrome.storage.sync.set({"cb_blacklist": blackList});
    }
    return {
        get_blacklist: get_blacklist,
        set_blacklist: set_blacklist,
        get_is_on: get_is_on,
        set_is_on: set_is_on,
    };
})();
