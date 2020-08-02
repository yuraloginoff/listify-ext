'use strict';

var popup = angular.module('popup', []);

popup.controller('popupCtrl', function($scope, dataStorage) {
  $scope.dataStorage = dataStorage;
  $scope.saved = false;
  $scope.error = null;

  $scope.$watch('dataStorage.data', function() {
    $scope.groups = $scope.dataStorage.data.groups;
  });

  $scope.dataStorage.findAll(function(data) {
    $scope.$apply(function() {
      $scope.groups = data.groups;
    });
  });

  $scope.saveToGroup = function(index) {
    dataStorage.saveToGroup(index, function(error) {
      $scope.$apply(function() {
        if (error) {
          $scope.error = error;
        } else {
          $scope.saved = !$scope.saved;
        }
      });
    });

    setTimeout(function() {
      window.close();
    }, 1000);
  };

  $scope.addGroup = function() {
    dataStorage.addGroup($scope.groupTitle);
    $scope.groupTitle = '';
  };
});

popup.service('dataStorage', function($q) {
  var _this = this;

  this.data = { groups: [] };
  this.error = null;

  this._sync = function() {
    chrome.storage.local.set({ groups: this.data.groups }, function() {
      if (chrome.runtime.lastError) {
        _this.error = chrome.runtime.lastError;
      }
    });
  };

  this._show = function() {
    chrome.storage.local.get(function(data) {
      console.log(data);
    });
  };

  this._saveFirstGroup = function() {
    var group = {
      id: 0,
      title: 'Default',
      links: [
        {
          url: 'https://wikipedia.org',
          title: 'Wikipedia',
          favicon: 'https://ru.wikipedia.org/static/favicon/wikipedia.ico'
        }
      ]
    };

    this.data.groups.push(group);
    this._sync();
  };

  this._getCurrentTabUrl = function(callback, index, callback2) {
    var queryInfo = {
      active: true,
      currentWindow: true
    };

    chrome.tabs.query(queryInfo, function(tabs) {
      var tab = tabs[0];
      var tabInfo = {
        url: tab.url,
        title: tab.title,
        favicon: tab.favIconUrl
      };

      callback(tabInfo, index, callback2); // _addLink
    });
  };

  this._addLink = function(tabInfo, index, callback2) {
    _this.data.groups[index]['links'].push(tabInfo);

    chrome.storage.local.set({ groups: _this.data.groups }, function() {
      if (chrome.runtime.lastError) {
        _this.error = chrome.runtime.lastError;
      }
      callback2(_this.error);
    });
  };

  this.saveToGroup = function(index, callback) {
    _this._getCurrentTabUrl(_this._addLink, index, callback);
  };

  this.findAll = function(callback) {
    chrome.storage.local.get(function(data) {
      if (Object.keys(data).length === 0) {
        _this._saveFirstGroup();
      } else {
        _this.data = data;
        callback(_this.data);
      }
    });
  };

  this.addGroup = function(title) {
    var id = this.data.groups.length;
    var group = {
      id: id,
      title: title,
      links: []
    };
    this.data.groups.push(group);
    this._sync();
  };

  // this.remove = function(todo) {
  //   this.data.splice(this.data.indexOf(todo), 1);
  //   this._sync();
  // }
  //
  // this.removeAll = function() {
  //   this.data = [];
  //   this._sync();
  // }
});
