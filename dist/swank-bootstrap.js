/* globals showdown */
(function(angular) {
  'use strict';

  // function LoDashFactory($window) {
  //   if ($window._) {
  //     var _ = $window._;
  //     delete($window._);
  //     console.log(_);
  //     return _;
  //   }
  // }
  // LoDashFactory.$inject = ['$window'];

  function SwankParseMDFilter($log) {
    return function(content) {
      try {
        if (!_.isObject(showdown)) {
          throw new Error('Showdown library not found.');
        }
        var converter = new showdown.Converter();
        return converter.makeHtml(content);
      } catch (err) {
        $log.error(err);
        return;
      }
    };
  }
  SwankParseMDFilter.$inject = ['$log'];

  function SwankSelectify() {
    return function(slug) {
      slug = slug.replace('{', '/');
      slug = slug.replace('}', '');
      var parts = slug.split('/');
      var result = '';
      angular.forEach(parts, function(word) {
        result += word.substring(0, 1).toUpperCase() + word.substring(1);
      });
      return result;
    };
  }
  SwankSelectify.$inject = [];

  function SwankTagsController($log) {
    var vm = this;
    $log(vm.swank);

  }
  SwankTagsController.$inject = ['$log'];

  var SwankInfoBlockComponent = {
    bindings: {swank: '<'},
    template: [
      '<div class="panel panel-default">',
        '<div class="panel-heading">',
          '<h3 class="panel-title">{{$ctrl.swank.doc.info.title}} <small>Version {{$ctrl.swank.doc.info.version}}</h3>',
        '</div>',
        '<div class="panel-body">',
          '<div ng-if="$ctrl.swank.doc.info.description">',
            '<h3>Description</h3>',
            '<div ng-bind-html="$ctrl.swank.doc.info.description | parseMD"></div>',
          '</div>',
          '<div ng-if="$ctrl.swank.doc.info.termsOfService">',
            '<h3>Description</h3>',
            '<div ng-bind-html="$ctrl.swank.doc.info.termsOfService | parseMD"></div>',
          '</div>',
        '</div>',
      '</div>'
    ].join('\n')
  };

  var SwankPathsComponent = {
    bindings: {swank: '<'},
    template: [
      '<div class="panel-group" id="pathslist" role="tablist" aria-multiselectable="true">',
        '<div class="panel panel-primary" ng-repeat="(route, path) in $ctrl.swank.doc.paths">',
          '<swank-path route="route" path="path"></swank-path>',
        '</div>',
      '</div>'
    ].join('\n')
  };

  var SwankPathComponent = {
    require: '^swankPaths',
    bindings: {route: '<', path: '<'},
    template: [
      '<div class="panel-heading" role="tab" id="{{$ctrl.route | selectify}}">',
        '<h4 class="panel-title">',
          '<a role="button" data-toggle="collapse" data-parent="#pathslist" href="#collapse{{$ctrl.route | selectify}}" aria-expanded="false" aria-controls="collapse{{$ctrl.route | selectify}}">',
            '{{$ctrl.route}}',
          '</a>',
        '</h4>',
      '</div>',
      '<div id="collapse{{$ctrl.route | selectify}}" class="panel-collapse collapse" role="tabpanel" aria-labelledby="{{$ctrl.route | selectify}}">',
        '<div class="panel-body">',
          '<pre>{{$ctrl.path | json}}</pre>',
        '</div>',
      '</div>',
    ].join('\n')
  };

  var SwankTagsComponent = {
    bindings: {swank: '<'},
    // controller: SwankTagsController,
    template: [
      '<div><pre>{{$ctrl|json}}</pre></div>'
    ].join('\n')
  };

  angular.module('swank.bootstrap', ['swank'])
    // .factory('_', LoDashFactory)
    .filter('parseMD', SwankParseMDFilter)
    .filter('selectify', SwankSelectify)
    .component('swankInfo', SwankInfoBlockComponent)
    .component('swankTags', SwankTagsComponent)
    .component('swankPaths', SwankPathsComponent)
    .component('swankPath', SwankPathComponent);
})(angular);
