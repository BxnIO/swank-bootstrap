/* globals showdown */
(function(angular) {
  'use strict';

  function LoDashFactory($window, $log) {
    try {
      if (!$window._) {
        throw new Error('LoDash library not found');
      }
      return $window._;
    } catch (err) {
      $log.error(err);
    }
  }
  LoDashFactory.$inject = ['$window', '$log'];

  function SwankParseMDFilter($log) {
    return function(content) {
      try {
        if (!_.isObject(showdown)) {
          throw new Error('Showdown library not found.');
        }
        showdown.setOption('tables', true);
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

  function SwankBootstrapController(Swank) {
    angular.extend(this, {
      api: new Swank(this.api)
    });
  }
  SwankBootstrapController.$inject = ['Swank'];

  function SwankTagsController($log, _) {

  }
  SwankTagsController.$inject = ['$log', '_'];

  var SwankBootstrapComponent = {
    bindings: {api: '<'},
    controller: SwankBootstrapController,
    template: [
      '<div class="container">',
        '<div class="row">',
          '<div class="col-12">',
            '<swank-info></swank-info>',
          '</div>',
          '<div class="col-12">',
            '<swank-paths></swank-paths>',
          '</div>',
          '<div class="col-12">',
            '<div class="row">',
              '<swank-tags></swank-tags>',
            '</div>',
        '</div>',
      '</div>',
    '</div>'
    ].join('\n')
  };

  var SwankInfoBlockComponent = {
    require: {swank: '^swankBootstrap'},
    template: [
      '<div class="panel panel-default">',
        '<div class="panel-heading">',
          '<h3 class="panel-title">{{$ctrl.swank.api.doc.info.title}} <small>Version {{$ctrl.swank.api.doc.info.version}}</h3>',
        '</div>',
        '<div class="panel-body">',
          '<div ng-if="$ctrl.swank.api.doc.info.description">',
            '<h3>Description</h3>',
            '<div ng-bind-html="$ctrl.swank.api.doc.info.description | parseMD"></div>',
          '</div>',
          '<div ng-if="$ctrl.swank.api.doc.info.termsOfService">',
            '<h3>Description</h3>',
            '<div ng-bind-html="$ctrl.swank.api.doc.info.termsOfService | parseMD"></div>',
          '</div>',
        '</div>',
      '</div>'
    ].join('\n')
  };

  var SwankPathsComponent = {
    require: {swank: '^swankBootstrap'},
    template: [
      '<div class="panel-group" id="pathslist" role="tablist" aria-multiselectable="true">',
        '<div class="panel panel-primary" ng-repeat="(route, path) in $ctrl.swank.api.doc.paths">',
          '<swank-path route="route" path="path"></swank-path>',
        '</div>',
      '</div>'
    ].join('\n')
  };

  var SwankPathComponent = {
    require: {paths: '^swankPaths'},
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
          '<swank-operation></swank-operation>',
          // '<pre>{{$ctrl.path | json}}</pre>',
        '</div>',
      '</div>',
    ].join('\n')
  };

  var SwankOperationComponent = {
    require: {path: '^swankPath'},
    template: [
      '<div class="panel panel-default" ng-repeat="(method,operation) in $ctrl.path.path track by $index">',
        '<div class="panel-heading"><h3 class="panel-title">',
          '<span class="label label-default">{{method}}</span> {{$ctrl.path.route}} <span class="pull-right">{{operation.summary}}</span>',
        '</h3></div>',
        '<div class="panel-body">',
          '<h4>Implementation Notes</h4>',
          '<div ng-bind-html="operation.description | parseMD"></div>',
          '<h4 ng-if="operation.parameters.length > 0">Parameters</h4>',
          '<swank-parameters ng-if="operation.parameters.length > 0" parameters="operation.parameters">',
          '</swank-parameters>',
          '<h4>Response Messages</h4>',
          '<swank-responses responses="operation.responses">',
          '</swank-responses>',
        '</div>',
      '</div>'
    ].join('\n')
  };

  var SwankParametersComponent = {
    bindings: {parameters: '<'},
    transclude: true,
    template: [
    '<table class="table">',
      '<tr>',
        '<th>Parameter</th>',
        '<th>Description</th>',
        '<th>Parameter Type</th>',
        '<th>Data Type</th>',
      '</tr>',
      '<tr ng-repeat="parameter in $ctrl.parameters" parameter="parameter">',
        '<td>{{parameter.name}}</td>',
        '<td>{{parameter.description}}</td>',
        '<td>{{parameter.in}}</td>',
        '<td>{{parameter.type}}</td>',
      '</tr>',
    '</table>'
    // '<div><swank-parameter ng-repeat="parameter in $ctrl.parameters" parameter="parameter"></swank-parameter></div>'
    ].join('\n')
  };

  var SwankResponsesComponent = {
    bindings: {responses: '<'},
    template: [
      '<table class="table">',
      '<tr>',
        '<th>HTTP Status Code</th>',
        '<th>Reason</th>',
        '<th>Response Model</th>',
        '<th>Headers</th>',
      '</tr>',
      '<tr ng-repeat="(number,response) in $ctrl.responses">',
        '<td>{{number}}</td>',
        '<td>{{response.description}}</td>',
        '<td>{{response.schema}}</td>',
        '<td>{{response.headers}}</td>',
      '</tr>',
    '</table>'
    ].join('\n')
  };

  var SwankTagsComponent = {
    require: {swank: '^swankBootstrap'},
    controller: SwankTagsController,
    template: [
      '<div><pre>{{$ctrl.swank|json}}</pre></div>'
    ].join('\n')
  };

  angular.module('swank.bootstrap', ['swank'])
    .factory('_', LoDashFactory)
    .filter('parseMD', SwankParseMDFilter)
    .filter('selectify', SwankSelectify)
    .component('swankBootstrap', SwankBootstrapComponent)
    // .component('swankInfo', SwankInfoBlockComponent)
    .component('swankTags', SwankTagsComponent)
    .component('swankPaths', SwankPathsComponent)
    .component('swankPath', SwankPathComponent)
    .component('swankOperation', SwankOperationComponent)
    .component('swankParameters', SwankParametersComponent)
    .component('swankResponses', SwankResponsesComponent);
})(angular);
