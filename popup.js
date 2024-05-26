$(function () {
    $("#on-off-switch").bootstrapToggle();
});

let isSetup = true;

$(document).ready(function () {
    async function setup_data() {
        if (await Utils.get_is_on() == null) {
            await Utils.set_is_on(false);
        }
        if (await Utils.get_blacklist() == null) {
            await Utils.set_blacklist([]);
        }
    }

    const setup = async () => {
        await setup_data();
        if (await Utils.get_is_on()) {
            $("#on-off-switch").bootstrapToggle("on");
        } else {
            $("#on-off-switch").bootstrapToggle("off");
        }
        await reloadPopup();
    };
    /**
     * Generates the list
     */
    const reloadPopup = async () => {
        showContents(await Utils.get_is_on());
        let blackList = (await Utils.get_blacklist()).reverse();

        let lstStr = "";
        for (let i = 0; i < blackList.length; i++) {
            lstStr += `<div class="list-group-item"><div>${blackList[i]}</div>
            <button id="icon-remove-${i}"class="btn btn-sm"><i class="fa fa-close"></i></button>
            </div>`;
        }

        $("#blocked-sites-list").html(lstStr);
        setupIconRemoveButtons(blackList);
        setShowClearButton(blackList.length != 0);
    };

    function setupIconRemoveButtons(blackList) {
        for (let i = 0; i < blackList.length; i++) {
            $(`#icon-remove-${i}`).unbind();
            $(`#icon-remove-${i}`).click(() => {
                removeFromBlackList(blackList.length - i - 1);
            });
        }
    }

    async function removeFromBlackList(index) {
        let blackList = await Utils.get_blacklist();
        if (index < 0 || index >= blackList.length) {
            return;
        }
        blackList.splice(index, 1);
        await Utils.set_blacklist(blackList);
        await reloadPopup();
    }

    /**
     * Functionality of buttons
     */
    async function handleAddSite() {
        const site = $("#site-input").val().trim();
        $("#site-input").val("");
        if (site == "") return;

        const blackList = await Utils.get_blacklist();
        console.log(`blacklist=${blackList}`)
        blackList.push(site);
        await Utils.set_blacklist(blackList);
        await reloadPopup();
    }

    function setShowClearButton(isShowing) {
        if (isShowing) {
            $("#site-clear-btn").show();
        } else {
            $("#site-clear-btn").hide();
        }
    }

    function showContents(isShowing) {
        if (isShowing) {
            $("#main-content-block").show();
        } else {
            $("#main-content-block").hide();
        }
    }

    $("#on-off-switch").change(async () => {
        if (isSetup) {
            isSetup = false;
            return;
        }
        await Utils.set_is_on(!await Utils.get_is_on());
        await reloadPopup();
    });

    $("#site-input").on("keyup", (e) => {
        if (e.key === "Enter" || e.keyCode === 13) {
            handleAddSite();
        }
    });

    $("#site-add-btn").click(() => {
        handleAddSite();
    });

    $("#site-clear-btn").click(async () => {
        await Utils.set_blacklist([]);
        await reloadPopup();
    });

    setup();
});
