"use strict"

/**
 * Get all items from Chrome storage
 *
 * @returns Promise
 */
const findAll = () => {
  return new Promise(resolve =>
    chrome.storage.local.get(data => resolve(data))
  )
}

const set = (data) => {
  chrome.storage.local.set(data, function () {
    console.log('Saved');
  });
}

export { findAll };


// chrome.storage.local.get(null, (data) => {
//   data.groups.map((group, i) => {
//     delete group.id;
//     group._id = i
//     // group.links.map((link, ind) => {
//     //   link['id'] = ind
//     // })
//   })

//   chrome.storage.local.set(data, function () {
//     console.log('Saved');
//   });
// })