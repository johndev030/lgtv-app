/* eslint-disable no-undef */
document.addEventListener("DOMContentLoaded", function () {
  var navElement = document.getElementById("navigation-view");

  navElement.addEventListener("mouseleave", function () {
    navPage.collapse(currentRoute);
  });

  var mediaGridElement = document.querySelector(
    "#media-grid-container .media-grid-rows-container"
  );
  mediaGridElement.addEventListener("wheel", function (event) {
    var delta = Math.sign(event.deltaY);
    mediaGridPage.handleMenusUpDown(delta);
  });

  var creatorsElement = document.querySelector(
    "#creators-view .media-grid-rows-container"
  );
  creatorsElement.addEventListener("wheel", function (event) {
    var delta = Math.sign(event.deltaY);
    creatorsPage.handleMenusUpDown(delta);
  });

  var videosElement = document.querySelector(
    ".videos-container .media-grid-rows-container"
  );
  videosElement.addEventListener("wheel", function (event) {
    var delta = Math.sign(event.deltaY);
    searchPage.handleMenusUpDown(delta);
  });

  document.addEventListener("keyup", function () {
    if (
      currentRoute === "creators-page" &&
      creatorsPage.keys.focusedPart === "creatorSelection"
    ) {
      creatorsPage.isKeyPressed = false;
    }
    if (
      currentRoute === "search-page" &&
      searchPage.keys.focusedPart === "videoSelection"
    ) {
      searchPage.isKeyPressed = false;
    }
  });

  document.addEventListener("keydown", function () {
    if (
      currentRoute === "creators-page" &&
      creatorsPage.keys.focusedPart === "creatorSelection"
    ) {
      creatorsPage.isKeyPressed = true;
    }
    if (
      currentRoute === "search-page" &&
      searchPage.keys.focusedPart === "videoSelection"
    ) {
      searchPage.isKeyPressed = true;
    }
  });
});
