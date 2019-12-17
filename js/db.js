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
  return new Promise(resolve =>
    chrome.storage.local.get(null, data => {
      resolve({
        _id: data.groups[id]["_id"],
        title: data.groups[id]["title"]
      })
    })
  )
}

const editGroup = group => {
  chrome.storage.local.get(null, data => {
    data.groups[group._id]["title"] = group.title

    chrome.storage.local.set(data, function() {
      console.log("Saved")
    })
  })
}

export { findAll, findGroup, editGroup }
