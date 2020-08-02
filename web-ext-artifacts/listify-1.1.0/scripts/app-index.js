'use strict';

var app = angular.module('app', ['ui.bootstrap']);

app.controller('MainCtrl', function($scope, getData, $uibModal) {
  getData().then(function(data) {
    if (Object.keys(data).length === 0) {
      // after install
      var defaults = {
        groups: [
          {
            id: 0,
            title: 'Default',
            links: [
              {
                url: 'https://wikipedia.org',
                title: 'Wikipedia',
                favicon: 'https://ru.wikipedia.org/static/favicon/wikipedia.ico'
              }
            ]
          }
        ]
      };
      $scope.groups = defaults.groups;
      chrome.storage.local.set({ groups: defaults.groups }, function() {
        // console.log('saved');
      });
    } else {
      $scope.groups = data.groups;
      // console.log(data);
    }
  });

  $scope.animationsEnabled = true;

  $scope.open = function(linkIndex, groupIndex) {
    var modalInstance = $uibModal.open({
      animation: $scope.animationsEnabled,
      ariaLabelledBy: 'modal-title',
      ariaDescribedBy: 'modal-body',
      templateUrl: 'editLinkModalContent.html',
      controller: 'ModalInstanceCtrl',
      scope: $scope,
      resolve: {
        linkIndex: linkIndex,
        groupIndex: groupIndex
      }
    });

    modalInstance.result.then(
      function(ret) {
        var links = $scope.groups[groupIndex]['links'];
        if (ret.doDelete) {
          links.splice(linkIndex, 1);
        } else {
          links['title'] = ret.link.title;
          links['url'] = ret.link.url;
        }
        chrome.storage.local.set({ groups: $scope.groups }, function() {
          // console.log('Saved');
        });
      },
      function() {
        // console.info('Modal dismissed at: ' + new Date());
      }
    );
  };

  $scope.openGroup = function(groupIndex) {
    var modalInstance = $uibModal.open({
      animation: $scope.animationsEnabled,
      ariaLabelledBy: 'modal-title',
      ariaDescribedBy: 'modal-body',
      templateUrl: 'editGroupModalContent.html',
      controller: 'GroupModalInstanceCtrl',
      scope: $scope,
      resolve: {
        groupIndex: groupIndex
      }
    });

    modalInstance.result.then(
      function(ret) {
        var groups = $scope.groups;
        if (ret.doDelete) {
          groups.splice(groupIndex, 1);
        } else {
          groups[groupIndex]['title'] = ret.group.title;
        }
        chrome.storage.local.set({ groups: $scope.groups }, function() {
          // console.log('Saved');
        });
      },
      function() {
        // console.info('Modal dismissed at: ' + new Date());
      }
    );
  };
});

app.factory('getData', function($timeout, $q) {
  return function() {
    var defer = $q.defer();

    chrome.storage.local.get(function(data) {
      defer.resolve(data);
    });

    return defer.promise;
  };
});

app.controller('ModalInstanceCtrl', function(
  $uibModalInstance,
  $scope,
  linkIndex,
  groupIndex
) {
  $scope.link = $scope.groups[groupIndex]['links'][linkIndex];

  $scope.save = function() {
    $uibModalInstance.close({
      link: $scope.link,
      doDelete: false
    });
  };

  $scope.delete = function() {
    $uibModalInstance.close({
      link: $scope.link,
      doDelete: true
    });
  };

  $scope.cancel = function() {
    $uibModalInstance.dismiss('cancel');
  };
});

app.controller('GroupModalInstanceCtrl', function(
  $uibModalInstance,
  $scope,
  groupIndex
) {
  $scope.group = $scope.groups[groupIndex];

  $scope.save = function() {
    $uibModalInstance.close({
      group: $scope.group,
      doDelete: false
    });
  };

  $scope.delete = function() {
    $uibModalInstance.close({
      group: $scope.group,
      doDelete: true
    });
  };

  $scope.cancel = function() {
    $uibModalInstance.dismiss('cancel');
  };
});
