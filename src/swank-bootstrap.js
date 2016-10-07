/* globals showdown */
(function(angular) {
  'use strict';

  /**
   * LoDashFactory - makes lodash injectable.
   * Throws an error if it can't be found
   * @param {object} $window angular window object
   * @param {object} $log    angular log object
   */
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

  /**
   * SwankParseMDFilter - filter for parsing markdown to HTML
   * @param {object} $log angular log object
   */
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

  /**
   * SwankSelectify - formats input to produce a unique ID
   */
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

  /**
   * SwankBootstrapController - root controller
   * @param {object} Swank swank object from swank core
   */
  function SwankBootstrapController(Swank) {
    angular.extend(this, {
      api: new Swank(this.api),
      debug: true
    });
    var groupBy = this.groupBy || 'tag';
    this.api.groupPaths(groupBy);
  }
  SwankBootstrapController.$inject = ['Swank'];

  var SwankBootstrapComponent = {
    bindings: {api: '<', groupBy: '@?'},
    controller: SwankBootstrapController,
    templateUrl: 'src/views/swank-bootstrap.html'
  };

  var SwankInfoBlockComponent = {
    require: {swank: '^swankBootstrap'},
    templateUrl: 'src/views/swank-info-block.html'
  };

  var SwankPathsComponent = {
    require: {swank: '^swankBootstrap'},
    bindings: {tag: '<?'},
    templateUrl: 'src/views/swank-paths.html'
  };

  var SwankPathComponent = {
    require: {paths: '^?swankPaths'},
    bindings: {route: '<', path: '<'},
    templateUrl: 'src/views/swank-path.html'
  };

  var SwankOperationComponent = {
    require: {path: '^swankPath'},
    templateUrl: 'src/views/swank-operation.html'
  };

  var SwankParametersComponent = {
    bindings: {parameters: '<'},
    transclude: true,
    templateUrl: 'src/views/swank-parameters.html'
  };

  var SwankResponsesComponent = {
    bindings: {responses: '<'},
    templateUrl: 'src/views/swank-responses.html'
  };

  var SwankTagsComponent = {
    require: {swank: '^swankBootstrap'},
    templateUrl: 'src/views/swank-tags.html'
  };

  var SwankTagComponent = {
    require: {tags: '^?swankTags'},
    bindings: {tag: '<', path: '<'},
    templateUrl: 'src/views/swank-tag.html'
  };

  angular.module('swank.bootstrap', ['swank'])
    .factory('_', LoDashFactory)
    .filter('parseMD', SwankParseMDFilter)
    .filter('selectify', SwankSelectify)
    .component('swankBootstrap', SwankBootstrapComponent)
    // .component('swankInfo', SwankInfoBlockComponent)
    .component('swankTags', SwankTagsComponent)
    .component('swankTag', SwankTagComponent)
    .component('swankPaths', SwankPathsComponent)
    .component('swankPath', SwankPathComponent)
    .component('swankOperation', SwankOperationComponent)
    .component('swankParameters', SwankParametersComponent)
    .component('swankResponses', SwankResponsesComponent);
})(angular);
