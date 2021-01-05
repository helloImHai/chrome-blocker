const BLACKLIST_KEY = "cblock-blacklisted-zxcv";
const IS_ON_KEY = "cblock-iso-zxcv";

const Utils = (function () {
    function getBlacklist() {
        let blackList = localStorage.getItem(BLACKLIST_KEY);

        if (!blackList) {
            return [];
        }

        if (!Array.isArray(JSON.parse(blackList))) {
            setBlackList([]);
            return [];
        }

        return JSON.parse(blackList);
    }

    function setBlackList(blackList) {
        localStorage.setItem(BLACKLIST_KEY, JSON.stringify(blackList));
    }

    function getIsOn() {
        let isOn = localStorage.getItem(IS_ON_KEY);
        if (!isOn || !["true", "false"].includes(isOn)) {
            setIsOn(true);
            return true;
        }
        return isOn == "true";
    }

    function setIsOn(isOn) {
        const bool = isOn ? "true" : "false";
        localStorage.setItem(IS_ON_KEY, bool);
    }

    return {
        getBlacklist: getBlacklist,
        setBlackList: setBlackList,
        getIsOn: getIsOn,
        setIsOn: setIsOn,
    };
})();
