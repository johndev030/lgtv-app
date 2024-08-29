(function (exports) {
  "use strict";

  var CommonHelpers = function () {

    this.htmlDecode = (input) => {
      var doc = new DOMParser().parseFromString(input, "text/html");
      return doc.documentElement.textContent;
    };

    this.shuffle = (array) => {
      return Array(array.length).fill(null)
        .map((_, i) => [Math.random(), i])
        .sort(([a], [b]) => a - b)
        .map(([, i]) => array[i])
    };

  };

  exports.CommonHelpers = new CommonHelpers();
})(window);
