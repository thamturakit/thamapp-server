(function () {
  'use strict';

  // Campaigns controller
  angular
    .module('campaigns')
    .controller('CampaignsController', CampaignsController);

  CampaignsController.$inject = ['$scope', '$state', '$window', 'Authentication', 'campaignResolve'];

  function CampaignsController($scope, $state, $window, Authentication, campaign) {
    var vm = this;

    vm.authentication = Authentication;
    vm.campaign = campaign;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;
    vm.acceptcampaign = acceptcampaign;
    vm.addHis = addHis;

    

    // vm.acceptcampaign.listusercampaign = [];
    function addHis(campaign) {
      campaign.listusercampaign.push({
        status: campaign.arstatus,
        datestatus: new Date()
      });
    }

    function acceptcampaign() {
      // console.log(vm.identification);
      // campaign.identification = vm.identification;
      // vm.addHis(campaign);
      vm.campaign.listusercampaign.push({
        identification: vm.identification,
        status: 'accept',
        acceptcampaigndate: vm.acceptcampaigndate,
        facebook: vm.facebook,
        lineid: vm.lineid
      });
      vm.campaign.$update(successCallback, errorCallback);
      function successCallback(res) {

      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }

    if (vm.campaign.startdate) {
      vm.campaign.startdate = new Date(vm.campaign.startdate);
    }
    if (vm.campaign.enddate) {
      vm.campaign.enddate = new Date(vm.campaign.enddate);
    }
    // Remove existing Campaign
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.campaign.$remove($state.go('campaigns.list'));
      }
    }

    // Save Campaign
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.campaignForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.campaign._id) {
        vm.campaign.$update(successCallback, errorCallback);
      } else {
        vm.campaign.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('campaigns.list');
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
} ());
