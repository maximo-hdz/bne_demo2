'use strict';

angular.module('bnePaymentsFrontApp')
  .controller('MainCtrl', ['$scope', '$http', '$timeout', function ($scope, $http, $timeout) {

    $scope.personalTab = true;
    $scope.thirdTab = false;
    $scope.accountSelection = true;
    $scope.dashboard = true;
    $scope.addingBeneficiary = false;
    $scope.challengeBeneficiary = false;
    $scope.payingAccounts = [];
    $scope.targetPersonalAccounts = [];
    $scope.targetThirdAccounts = [];

    $scope.rows = 20;
    $scope.pause = 200;
    $scope.searchPersonalAccounts = "";
    $scope.pagePersonalAccounts = 0;
    $scope.numPersonalAccounts = 0;
    $scope.busyPersonalAccounts = false;
    $scope.searchThirdAccounts = "";
    $scope.pageThirdAccounts = 0;
    $scope.numThirdAccounts = 0;
    $scope.busyThirdAccounts = false;

    $scope.hoursCombo = [
      {name: 'Ahora'},
      {name: '0:00'},
      {name: '0:30'},
      {name: '1:00'},
      {name: '1:30'},
      {name: '2:00'},
      {name: '2:30'},
      {name: '3:00'},
      {name: '3:30'},
      {name: '4:00'},
      {name: '4:30'},
      {name: '5:00'},
      {name: '5:30'},
      {name: '6:00'},
      {name: '6:30'},
      {name: '7:00'},
      {name: '7:30'},
      {name: '8:00'},
      {name: '8:30'},
      {name: '9:00'},
      {name: '9:30'},
      {name: '10:00'},
      {name: '10:30'},
      {name: '11:00'},
      {name: '11:30'},
      {name: '12:00'},
      {name: '12:30'},
      {name: '13:00'},
      {name: '13:30'},
      {name: '14:00'},
      {name: '14:30'},
      {name: '15:00'},
      {name: '15:30'},
      {name: '16:00'},
      {name: '16:30'},
      {name: '17:00'},
      {name: '17:30'},
      {name: '18:00'},
      {name: '18:30'},
      {name: '19:00'},
      {name: '19:30'},
      {name: '20:00'},
      {name: '20:30'},
      {name: '21:00'},
      {name: '21:30'},
      {name: '22:00'},
      {name: '22:30'},
      {name: '23:00'},
      {name: '23:30'},
      {name: '24:00'}
    ];

    $scope.url = "http://projects.anzen.com.mx:4567/"

    $scope.getTargetPersonalAccounts = function(query, page) {
      $scope.busyPersonalAccounts = true;

      $http.get($scope.url + 'api/ownaccounts?query=' + query + '&rows=' + $scope.rows + '&page=' + page).success(function(data, status, headers, config) {
        $scope.numPersonalAccounts = data.numFound;

        if(!$scope.searchPersonalAccounts) {
          $scope.targetPersonalAccounts = [];
          return;
        }

        for(var i = 0; i < data.docs.length; i++) {
          $scope.targetPersonalAccounts.push(data.docs[i]);
        }

        if($scope.numPersonalAccounts <= $scope.targetPersonalAccounts.length) {
          $scope.busyPersonalAccounts = true;
        } else {
          $scope.busyPersonalAccounts = false;
        }
      }).
        error(function(data, status, headers, config) {
          console.log("Error getting personal accounts");
        });
    };

    $scope.loadMorePersonalAccounts = function() {
      if($scope.busyPersonalAccounts) return;

      $scope.pagePersonalAccounts++;
      $scope.getTargetPersonalAccounts($scope.searchPersonalAccounts, $scope.pagePersonalAccounts);
      console.log("Trying to load more " + $scope.pagePersonalAccounts + " of " + $scope.numPersonalAccounts + "[current = " + $scope.targetPersonalAccounts.length + "]");
    };

    $scope.getTargetThirdAccounts = function(query, page) {
      $scope.busyThirdAccounts = true;

      $http.get($scope.url + 'api/otheraccounts?query=' + query + '&rows=' + $scope.rows).success(function(data, status, headers, config) {
        $scope.numThirdAccounts = data.numFound;

        if(!$scope.searchThirdAccounts) {
          $scope.targetThirdAccounts = [];
          return;
        }

        for(var i = 0; i < data.docs.length; i++) {
          $scope.targetThirdAccounts.push(data.docs[i]);
        }

        if($scope.numThirdAccounts <= $scope.targetThirdAccounts.length) {
          $scope.busyThirdAccounts = true;
        } else {
          $scope.busyThirdAccounts = false;
        }
      }).
        error(function(data, status, headers, config) {
          console.log("Error getting third accounts");
        });
    };

    $scope.loadMoreThirdAccounts = function() {
      if($scope.busyThirdAccounts) return;

      $scope.pageThirdAccounts++;
      $scope.getTargetThirdAccounts($scope.searchThirdAccounts, $scope.pageThirdAccounts);
      console.log("Trying to load more " + $scope.pageThirdAccounts + " of " + $scope.numThirdAccounts + "[current = " + $scope.targetThirdAccounts.length + "]");
    };
    $scope.getTargetPersonalAccounts('', 0);
    $scope.getTargetThirdAccounts('', 0);

    $scope.$watch('searchPersonalAccounts', function() {
      if($scope.searchTimer) {
        $timeout.cancel($scope.searchTimer);
      }

      $scope.searchTimer = $timeout(function() {
        $scope.pagePersonalAccounts = 0;
        $scope.targetPersonalAccounts = [];
        $scope.getTargetPersonalAccounts($scope.searchPersonalAccounts, $scope.pagePersonalAccounts);
        $scope.searchTimer = null;
      }, $scope.pause);
    }, true);

    $scope.$watch('searchThirdAccounts', function() {
      if($scope.searchTimer) {
        $timeout.cancel($scope.searchTimer);
      }

      $scope.searchTimer = $timeout(function() {
        $scope.pageThirdAccounts = 0;
        $scope.targetThirdAccounts = [];
        $scope.getTargetThirdAccounts($scope.searchThirdAccounts);
        $scope.searchTimer = null;
      }, $scope.pause);
    }, true);

    $scope.getDashboardData = function() {
      $http.get($scope.url + 'api/transactions').success(function(data, status, headers, config) {
        $scope.pending = data.pending;
        $scope.rejected = data.rejected;
        $scope.recurring = data.recurring;
        $scope.applied = data.applied;
      }).
        error(function(data, status, headers, config) {
          console.log("Error getting transactions");
        });
    };

    $scope.getDashboardData();

    $scope.updateRanking = function(id, target) {
      $http.post($scope.url + 'api/updateranking', {id: id, target: target}).success(function(data, status, headers, config) {
        console.log("Ranking updated");
      }).
        error(function(data, status, headers, config) {
        console.log("Error updating account ranking");
      });

    };

    $scope.$watch('originAccount', function() {
      if($scope.originAccount) {
          $scope.updateRanking($scope.originAccount.originalObject.id, 'source');
      }
    }, true);

    $scope.selectPersonalAccount = function(account) {
      if(account) {
        if($scope.getPayingAccountIndex(account.id) === -1) {
          account.date = $scope.getCurrentDateString();
          account.hourSelection = $scope.hoursCombo[0];
          $scope.payingAccounts.push(account);
          $scope.dashboard = false;
          $scope.paymentConfirmation = true;
          $scope.paymentApplied = false;
          $scope.challenge = false;
          $scope.updateRanking(account.id, 'target');

          $scope.targetAccount = null;
        } else {
          console.log("Error, account already added");
        }

      }
    };

    $scope.selectThirdAccount = function(account) {
      if(account) {
        if($scope.getPayingAccountIndex(account.id) === -1) {
          account.date = $scope.getCurrentDateString();
          account.hourSelection = $scope.hoursCombo[0];
          $scope.payingAccounts.push(account);
          $scope.dashboard = false;
          $scope.paymentConfirmation = true;
          $scope.paymentApplied = false;
          $scope.challenge = false;
          $scope.updateRanking(account.id, 'target');

          $scope.thirdAccount = null;
        } else {
          console.log("Error, account already added");
        }

      }
    };

    $scope.getPayingAccountIndex = function(accountId) {
      for(var i = 0; i < $scope.payingAccounts.length; i++) {
        if($scope.payingAccounts[i].id === accountId) {
          return i;
        }
      }

      return -1;
    };

    $scope.removePayingAccount = function(accountId) {
      var index = $scope.getPayingAccountIndex(accountId);

      if(index != -1) {
        $scope.payingAccounts.splice(index, 1);
      }

      if($scope.payingAccounts.length < 1) {
        $scope.paymentConfirmation = false;
        $scope.dashboard = true;
      }
    };

    $scope.processPayment = function() {
      $scope.dashboard = false;
      $scope.paymentConfirmation = false;
      $scope.paymentApplied = true;

      $scope.appliedPayments = [];
      $scope.pendingPayments = [];
      $scope.rejectedPayments = [];

      $scope.appliedPayments = $.grep($scope.payingAccounts, function(v) {
        return !v.pending;
      });

      $scope.pendingPayments = $.grep($scope.payingAccounts, function(v) {
        return v.pending;
      });

      $scope.rejectedPayments = $.grep($scope.payingAccounts, function(v) {
        return v.rejected;
      });

      $scope.payingAccounts = [];
    };

    $scope.addBeneficiary = function() {
      $scope.addedBeneficiary = true;
      $scope.addingBeneficiary = false;
      $scope.challengeBeneficiary = false;

      console.log($scope.benef);
    };

    $scope.getAuthNumber = function () {
      return Math.random().toString().slice(2, 7);
    };

    $scope.getTotalPayment = function () {
      var sum = 0;
      for(var i = 0; i < $scope.payingAccounts.length; i++) {
        var elem = $scope.payingAccounts[i].amount;
        if(elem && parseFloat(elem)) {
          sum += parseFloat(elem);
        }
      }

      return sum;
    };

    $scope.getTotalAppliedPayment = function () {
      var sum = 0;
      for(var i = 0; i < $scope.appliedPayments.length; i++) {
        var elem = $scope.appliedPayments[i].amount;
        if(elem && parseFloat(elem)) {
          sum += parseFloat(elem);
        }
      }

      return sum;
    };

    $scope.getCurrentDate = function () {
      return Date.now();
    };

    $scope.getCurrentDateString = function () {
      var today = new Date();
      var dd = today.getDate();
      var mm = today.getMonth()+1; //January is 0!
      var yyyy = today.getFullYear();

      if(dd<10) {
            dd='0'+dd
      }

      if(mm<10) {
            mm='0'+mm
      }

      today = dd+'/'+mm+'/'+yyyy;

      return today;
    };
  }]);
