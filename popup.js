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

function setBlackList(blackList) {
  localStorage.setItem(KEY, JSON.stringify(blackList))
}

$(document).ready(function() {
    /**
     * Generates the list
     */
    const refreshListItems = () => {
      const blackList = getBlacklist().reverse()

      let lstStr = ""
      for (let i = 0; i < blackList.length; i++) {
        lstStr +=`<div class="list-group-item">${blackList[i]}</div>`;
      }
  
      $('#blocked-sites-list').html(lstStr);
      setShowClearButton(blackList.length != 0)
    }
    refreshListItems()

    /**
     * Functionality of buttons
     */

    function handleAddSite() {
      const site = $('#site-input').val().trim()
      $("#site-input").val("")
      if (site == "") return

      const blackList = getBlacklist()
      blackList.push(site)
      setBlackList(blackList)
      refreshListItems()
    }

    function setShowClearButton(isShowing) {
      if (isShowing) {
        $("#site-clear-btn").show()
      } else {
        $("#site-clear-btn").hide()
      }
      
    }

    $("#site-input").on('keyup', (e) => {
      if (e.key === 'Enter' || e.keyCode === 13) {
        handleAddSite()
      }
    })

    $('#site-add-btn').click(() => {
      handleAddSite()
    })

    $('#site-clear-btn').click(() => {
      setBlackList([])
      refreshListItems()
    })

});