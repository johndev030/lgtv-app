/* eslint-disable no-undef */

var init = function () {
  $(document).ready(function () {
    authPage.getApp();
  })
  window.onwheel = function () {
    return true;
  }
};

function keyboardVisibilityChange(event) {
  var visibility = event.detail.visibility;
  if (visibility) {
    isKeyboard = true;
  }
  else {
    isKeyboard = false;
    $('input').blur();
  }
}

document.addEventListener(
  "keyboardStateChange",
  keyboardVisibilityChange,
  false
);

document.addEventListener('keyboardStateChange', keyboardVisibilityChange, false);

window.onload = init;
