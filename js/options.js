// Export
document.getElementById("export").addEventListener("click", exportData)

function exportData() {
  chrome.storage.local.get(null, function(items) {
    var _data = JSON.stringify(items, null, 4) //indentation in json format, human readable

    var vLink = document.createElement("a"),
      vBlob = new Blob([_data], { type: "octet/stream" }),
      vName = "listify_backup.json",
      vUrl = window.URL.createObjectURL(vBlob)
    vLink.setAttribute("href", vUrl)
    vLink.setAttribute("download", vName)
    vLink.click()
  })
}

// Import
var importFile = document.getElementById("importFile")
var importStatus = document.getElementById("importStatus")
importFile.addEventListener("change", importJob)
document.getElementById("importBtn").onclick = function() {
  importFile.click()
}

function importJob(e) {
  var files = e.target.files,
    reader = new FileReader()
  reader.onload = _imp
  reader.readAsText(files[0])
}

function _imp() {
  const _myImportedData = JSON.parse(this.result)

  chrome.storage.local.get(function(data) {
    let groupsArr = data.groups.concat(_myImportedData.groups)
    groupsArr.map((group, index) => {
      group._id = index
      group.links.map(link => {
        link.groupId = index
      })
    })

    chrome.storage.local.set({ groups: groupsArr }, () => {
      importStatus.innerHTML = chrome.runtime.lastError
        ? chrome.runtime.lastError
        : "SUCCESS! Import finished."
    })
  })

  importFile.value = "" // clear input value after every import
}
