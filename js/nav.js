/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
var navPage = {
  keys: {
    focusedPart: "navSelection",
    navSelection: 1,
    navSelectedIndex: 1,
  },
  navigationDom: [],
  prevRoute: "",
  isExpand: "",
  init: function () {
    var navHTML = "";
    navData.map(function (nav, index) {
      navHTML +=
        '<div class="navigation-tab' +
        (index === 1 ? " selected" : "") +
        '" onmouseenter="navPage.hoverMenu(' +
        index +
        ')" onclick="navPage.clickNav(' +
        index +
        ')">' +
        '<img class="nav-tab-icon ' +
        (index === 1 ? " selected" : "") +
        '" src="' +
        nav.src +
        '" />' +
        '<p class="nav-tab-text hidden">' +
        nav.title +
        "</p>" +
        "</div>";
    });
    $(".navigation-tabs-inner-container").html(navHTML);
    this.keys.navSelectedIndex = 1;
    this.navigationDom = $(".navigation-tab");
  },

  expand: function (prevRoute) {
    this.prevRoute = prevRoute;
    this.isExpand = true;

    var _this = this;
    var keys = this.keys;
    mediaGridPage.keys.gridItemSelection = 0;
    $(_this.navigationDom[keys.navSelectedIndex]).removeClass("selected");
    $(_this.navigationDom[keys.navSelectedIndex])
      .find(".nav-tab-icon")
      .removeClass("selected");
    $(_this.navigationDom[keys.navSelectedIndex]).addClass("active");
    $(".navigation-tab.active .nav-tab-icon").attr(
      "src",
      "images/Menu_" + keys.navSelectedIndex + "_Hover.png"
    );
    $(".navigation-view .navigation-tabs-container").addClass("active");
    $(".navigation-view .nav-tab-text").removeClass("hidden");
    $(".navigation-view .navigation-logo-container").removeClass("hidden");
    $(".focused-content-info-desc-container").removeClass("focused");
    creatorsPage.unfocusCategories();
    creatorsPage.unfocusCreators();
    creatorsPage.blurInput();
    searchPage.unfocusVideos();
    searchPage.blurInput();
    homePage.unfocusSliders();
    homePage.hideLogo();
  },

  collapse: function (prevRoute) {
    this.isExpand = false;
    var keys = this.keys;
    keys.navSelection = keys.navSelectedIndex;
    $(this.navigationDom[keys.navSelectedIndex]).addClass("selected");
    $(this.navigationDom[keys.navSelectedIndex])
      .find(".nav-tab-icon")
      .addClass("selected");

    $(".navigation-view .navigation-logo-container, .navigation-view .nav-tab-text").addClass("hidden");
    $(".navigation-view .navigation-tab, .navigation-view .navigation-tabs-container").removeClass("active");

    homePage.showLogo();

    switch (prevRoute) {
      case "home-page":
        homePage.focusSlider();
        creatorsPage.prevSelection = ""
        currentRoute = prevRoute;
        homePage.keys.sliderSelection = 0;
        break;
      case "media-grid-page":
        currentRoute = prevRoute;
        creatorsPage.prevSelection = ""
        mediaGridPage.keys.gridItemSelection = 0;
        mediaGridPage.focusThumbnail();
        break;
      case "search-page":
        currentRoute = prevRoute;
        creatorsPage.prevSelection = ""
        if (searchPage.prevSelection === "searchBar") {
          searchPage.keys.focusedPart = "searchBar";
          searchPage.activeInput();
        } else if (searchPage.prevSelection === "videoSelection") {
          searchPage.keys.focusedPart = "videoSelection";
          searchPage.focusVideo();
        }
        break;
      case "creators-page":
        currentRoute = prevRoute;
        if (creatorsPage.prevSelection === "searchBar" || creatorsPage.prevSelection === "") {
          creatorsPage.keys.focusedPart = "searchBar";
          creatorsPage.activeInput();
        } else if (creatorsPage.keys.focusedPart === "categorySelection") {
          creatorsPage.keys.focusedPart = "categorySelection";
          creatorsPage.focusCategories();
        } else {
          keys.focusedPart = "creatorSelection";
          $("#creators-container .category-container").removeClass("focused");
          creatorsPage.setFocusedCreator();
        }
        break;
      case "description-modal":
        currentRoute = prevRoute;
        $(".focused-content-info-desc-container").addClass("focused");
        descriptionModal.focusedPart = "descriptionSelection";
        break;
    }
  },

  hidePrevPages: function () {
    $("#search-container").addClass("hidden");
    $("#creators-container").addClass("hidden");
    $("#playlist-episode-container").addClass("hidden");
  },

  clickNav: function (index) {
    if (this.isExpand) {
      var keys = this.keys;
      keys.navSelectedIndex = index;
      var pages = ["search-page", "home-page", "creators-page"];
      var selectedPage = pages[index];

      this.hidePrevPages();
      if (this.prevRoute !== selectedPage) {
        if (selectedPage === "search-page")
          searchPage.init();
        else if (selectedPage === "home-page")
          homePage.init();
        else
          creatorsPage.init();
      }
      this.collapse(selectedPage);
    }
  },

  hoverMenu: function (index) {
    if (this.isExpand) {
      this.keys.navSelection = index;
      $(this.navigationDom).removeClass("active").eq(this.keys.navSelection).addClass("active");
    }
  },

  hoverNav: function () {
    if (!isKeyboard) this.expand(currentRoute);
  },

  handleMenuLeftRight: function (increment) {
    if (increment > 0) {
      this.collapse(this.prevRoute);
    } else if (!this.isExpand) {
      var routesToExpand = ["home-page", "media-grid-page", "search-page", "creators-page"];
      var currentRoute = this.prevRoute;

      if (routesToExpand.includes(currentRoute)) {
        this.expand(currentRoute);
      }
    }
  },

  handleMenusUpDown: function (increment) {
    if (this.isExpand) {
      var keys = this.keys;
      var navLength = this.navigationDom.length;
      keys.navSelection = Math.max(0, Math.min(keys.navSelection + increment, navLength - 1));
      this.hoverMenu(keys.navSelection);
    }
  },

  handleMenuClick: function () {
    var keys = this.keys;
    keys.navSelectedIndex = keys.navSelection;
    $(this.navigationDom[keys.navSelectedIndex]).trigger("click");
  },

  goBack: function () {
    var _this = this;
    this.collapse(_this.prevRoute);
  },

  HandleKey: function (e) {
    if (!this.is_drawing) {
      switch (e.keyCode) {
        case lgKey.RIGHT:
          this.handleMenuLeftRight(1);
          break;
        case lgKey.LEFT:
          this.handleMenuLeftRight(-1);
          break;
        case lgKey.DOWN:
          this.handleMenusUpDown(1);
          break;
        case lgKey.UP:
          this.handleMenusUpDown(-1);
          break;
        case lgKey.ENTER:
          this.handleMenuClick();
          break;
        case lgKey.RETURN:
          this.goBack();
          break;
      }
    }
  }
};
