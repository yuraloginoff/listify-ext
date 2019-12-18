"use strict"

/**
 * Get all items from Chrome storage
 *
 * @returns Promise
 */
const findAll = () => {
  return new Promise(resolve =>
    chrome.storage.local.get(null, data => {
      resolve(data)
    })
  )
}

/**
 * Get the group by ID from Chrome storage
 *
 * @returns Promise
 */
const findGroup = id => {
  id = parseInt(id, 10)

  return new Promise(resolve =>
    chrome.storage.local.get(null, data => {
      const group = data.groups.find(item => item._id === id)
      resolve({
        _id: group._id,
        title: group.title
      })
    })
  )
}

const editGroup = (id, title) => {
  id = parseInt(id, 10)

  chrome.storage.local.get(null, data => {
    data.groups.map(item => {
      if (item._id === id) {
        data.groups[id]["title"] = title
      }
    })

    chrome.storage.local.set(data, function() {
      console.info("Saved")
    })
  })
}

const deleteGroup = id => {
  id = parseInt(id, 10)

  chrome.storage.local.get(null, data => {
    data.groups.map((item, i) => {
      if (item._id === id) {
        data.groups.splice(i, 1)
      }
    })

    chrome.storage.local.set(data, function() {
      console.info("Deleted")
    })
  })
}

export { findAll, findGroup, editGroup, deleteGroup }

/*
chrome.storage.local.get(null, data => {
  data.groups.push({
    _id: data.groups.length + 1,
    title: "Default ",
    links: []
  })

  chrome.storage.local.set(data, function() {
    console.log("Saved")
  })
})
*/
