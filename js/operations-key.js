/* eslint-disable no-undef */
"use strict";

document.addEventListener("keydown", function (e) {
  if (e.keyCode === lgKey.EXIT) {
    e.preventDefault();
    return;
  }
  switch (currentRoute) {
    case "auth":
      authPage.HandleKey(e);
      break;
    case "home-page":
      homePage.HandleKey(e);
      break;
    case "description-modal":
      descriptionModal.HandleKey(e);
      break;
    case "video-player":
      videoPlayerVariables.HandleKey(e);
      break;
    case "turn-off-modal":
      turnOffModal.HandleKey(e);
      break;
    case "nav-page":
      navPage.HandleKey(e);
      break;
    case "media-grid-page":
      mediaGridPage.HandleKey(e);
      break;
    case "search-page":
      searchPage.HandleKey(e);
      break;
    case "creators-page":
      creatorsPage.HandleKey(e);
      break;
  }
});
