$(function(){ $('#on-off-switch').bootstrapToggle() });

let isSetup = true;

$(document).ready(function() {
    const setup = () => {
      const isOn = Utils.getIsOn();
      isSetup = true;
      if (isOn) {
        $('#on-off-switch').bootstrapToggle('on')
      } else {
        $('#on-off-switch').bootstrapToggle('off')
      }
      reloadPopup()
    }
    /**
     * Generates the list
     */
    const reloadPopup = () => {
      showContents(Utils.getIsOn())
      const blackList = Utils.getBlacklist().reverse()
      
      let lstStr = ""
      for (let i = 0; i < blackList.length; i++) {
        lstStr +=`<div class="list-group-item"><div>${blackList[i]}</div>
            <button id="icon-remove-${i}"class="btn btn-sm"><i class="fa fa-close"></i></button>
          </div>`;
      }
  
      $('#blocked-sites-list').html(lstStr);
      setupIconRemoveButtons(blackList)
      setShowClearButton(blackList.length != 0)
    }

    function setupIconRemoveButtons(blackList) {
      for (let i = 0; i < blackList.length; i++) {
        $(`#icon-remove-${i}`).unbind()
        $(`#icon-remove-${i}`).click(() => {
          removeFromBlackList(blackList.length - i - 1)
        })
      }
    }

    function removeFromBlackList(index) {
      let blackList = Utils.getBlacklist();
      if (index < 0 || index >= blackList.length) {
        return;
      }
      blackList.splice(index, 1);
      Utils.setBlackList(blackList);
      reloadPopup();
    }

    /**
     * Functionality of buttons
     */
    function handleAddSite() {
      const site = $('#site-input').val().trim()
      $("#site-input").val("")
      if (site == "") return

      const blackList = Utils.getBlacklist()
      blackList.push(site)
      Utils.setBlackList(blackList)
      reloadPopup()
    }

    function setShowClearButton(isShowing) {
      if (isShowing) {
        $("#site-clear-btn").show()
      } else {
        $("#site-clear-btn").hide()
      } 
    }

    function showContents(isShowing) {
      if (isShowing) {
        $("#main-content-block").show();
      } else {
        $("#main-content-block").hide();
      }
    }

    $("#on-off-switch").change(() => {
      if (isSetup) {
        isSetup = false;
        return;
      }
      Utils.setIsOn(!Utils.getIsOn());
      reloadPopup()
    })

    $("#site-input").on('keyup', (e) => {
      if (e.key === 'Enter' || e.keyCode === 13) {
        handleAddSite()
      }
    })

    $('#site-add-btn').click(() => {
      handleAddSite()
    })

    $('#site-clear-btn').click(() => {
      Utils.setBlackList([]);
      reloadPopup();
    })

    setup();
});