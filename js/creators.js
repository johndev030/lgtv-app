/* eslint-disable no-unused-vars */
/* eslint-disable  no-undef */
var creatorsPage = {
  keys: {
    focusedPart: "searchBar",
    categorySelection: 0,
    creatorSelection: 0
  },
  isExpand: false,
  creatorsPerRow: 3,
  id: "#creators-container",
  searchKeyTimout: 400,
  searchKeyTimer: 0,
  lastQuery: "",
  isKeyPressed: false,
  creators: [],
  prevSelection: "",

  init: function () {
    currentRoute = "creators-page";
    this.hideHomeContents();
    $("#creators-container").removeClass("hidden");
    this.searchCreatorByAllCategory()
    this.initVariables();
    this.activeInput();
    this.showCategories();
  },

  resetQuery: function () {
    $(this.id + " .query-input").val("");
  },

  focusInput: function () {
    $(this.id + " .query-input").focus();
  },

  activeInput: function () {
    $(this.id + " .query-input").addClass("active");
  },

  blurInput: function () {
    $(this.id + " .query-input").blur();
    $(this.id + " .query-input").removeClass("active");
  },

  initVariables: function () {
    this.keys.categorySelection = 0;
    this.keys.creatorSelection = 0;
    this.keys.focusedPart = "searchBar";
    this.updateCreatorsTitle("All");
    this.creators = creators;
    this.resetQuery();

    $(this.id + " .media-grid-rows-container").css("top", 0);
    $(this.id + " .categories-grid-row").css(
      "margin-left",
      rowLeftMargin + "px"
    );
  },

  hideHomeContents: function () {
    pauseVideo();
    $("#media-grid-container").addClass("hidden");
    $("#playlist-episode-container").addClass("hidden");
    $("#video-container").addClass("hidden");
    $("#search-container").addClass("hidden");
  },

  showCategories: function () {
    var categoriesHTML = "";
    categories.map(function (category, index) {
      categoriesHTML +=
        '<div class="category-container' +
        (index === 0 ? " selected" : "") +
        '" index = "' +
        index +
        '"  onClick = "creatorsPage.clickCategory(' +
        index +
        ')" onmouseenter="creatorsPage.hoverCategory(' +
        index +
        ')">' +
        '<p class="category-title' +
        (index === 0 ? " selected" : "") +
        '">' +
        category.title +
        "</p>" +
        "</div>";
    });
    $(".categories-grid-row").html(categoriesHTML);
  },

  showCreators: function () {
    var data = [];
    var i = 0;
    var _this = this;
    console.log('_this.creators', _this.creators)
    while (i < _this.creators.length) {
      var row = [];
      while (i < _this.creators.length && row.length < 3) {
        row.push(_this.creators[i]);
        i++;
      }
      data.push({ content: row });
    }
    $(".creators-title").removeClass("hidden");
    $(this.id + " .media-grid-rows-container").html("");
    $(this.id + " .media-grid-rows-container").css("top", 0);
    this.keys.creatorSelection = 0
    if (data.length) {
      data.map(function (content, index) {
        var itemHTML = "";
        content.content.map(function (item, col) {
          var tTitle = item.channel_name;
          itemHTML +=
            '<div class="creator-container" onmouseenter="creatorsPage.hoverCreator(' +
            index +
            ", " +
            col +
            ')" onclick="creatorsPage.showCreatorPlaylist(\'' +
            item.oftv_handle +
            "')\">" +
            '<img src="' +
            item.featured_image +
            '"  onerror="this.src=\'' +
            defaultThumbnailUrl +
            '\'" class="creator-thumbnail" />' +
            '<p class="creator-title">' +
            tTitle +
            "</p>" +
            "</div>";
        });

        var mediaGridHTML =
          '<div class="media-grid-row-thumbnails" data-index="' +
          index +
          '">' +
          itemHTML +
          "</div>";

        $(_this.id + " .media-grid-rows-container").append(
          mediaGridHTML
        );
      });
      hideLoader()
    }


    else {
      $(".creators-title").addClass("hidden");
      var html = '<div class = "result">No Results - Try another search</div>';
      $(this.id + " .media-grid-rows-container").html(html);
    }
  },

  searchValueChange: function () {
    clearTimeout(this.searchKeyTimer);
    var _this = this;
    this.searchKeyTimer = setTimeout(function () {
      var searchValue = $(_this.id + " .query-input").val();
      if (searchValue !== "" && searchValue !== _this.lastQuery) {
        ZypeApiHelpers.searchCreators(searchValue).then(function (response) {
          _this.creators = response;
          _this.showCreators();
          $(_this.id + " .media-grid-rows-container").css("top", 0);
          $(_this.id + " .query-input").blur();
        });
      }
      _this.lastQuery = searchValue;
    }, this.searchKeyTimout);
  },

  unfocusCategories: function () {
    $(this.id + " .categories-title").removeClass("focused");
    $(this.id + " .category-container").removeClass("focused");
    $(this.id + " .category-title").removeClass("focused");
  },

  focusCategories: function () {
    var keys = this.keys;
    var currentCategory = $(this.id).find(" .category-container")[
      keys.categorySelection
    ];
    var currentTitle = $(this.id).find(" .category-title")[
      keys.categorySelection
    ];
    $(this.id + " .categories-title").addClass("focused");
    $(currentCategory).addClass("focused");
    $(currentTitle).addClass("focused");
  },

  setFocusedCategory: function () {
    this.unfocusCategories();
    this.focusCategories();
    this.moveCategoriesContainer();
  },

  focusedCategoryOffScreen: function () {
    var keys = this.keys;
    var category = $(this.id).find(" .category-container")[
      keys.categorySelection
    ];
    return $(category).offset().left < 0;
  },

  lastCategoryOffScreen: function () {
    var category = $(this.id).find(" .category-container")[
      categories.length - 1
    ];
    var htmlWidth = document.documentElement.clientWidth;
    var categoryRight = $(category).offset().left + $(category).width();
    return categoryRight > htmlWidth;
  },

  moveCategoriesContainer: function () {
    var keys = this.keys;
    if (this.focusedCategoryOffScreen() || this.lastCategoryOffScreen()) {
      var categoriesContainer = $(this.id + " .categories-grid-row")[0];
      var width = 0;
      var categories = $(this.id).find(" .category-container");
      for (var int = 0; int < keys.categorySelection; int++) {
        width += $(categories[int]).width() + 12;
      }
      var newLeft = window.innerWidth * 0.05677 - width;
      $(categoriesContainer).animate(
        {
          "margin-left": String(newLeft) + "px"
        },
        200
      );
    }
  },

  setFocusedCreator() {
    this.blurInput();
    this.unfocusCategories();
    this.unfocusCreators();
    this.focusCreators();
    this.moveCreatorsContainer();
  },

  unfocusCreators: function () {
    $(this.id + " .creators-title").removeClass("focused");
    $(this.id + " .creator-container").removeClass("focused");
    $(this.id + " .creator-title").removeClass("focused");
  },

  focusCreators: function () {
    var keys = this.keys;
    $(this.id + " .creators-title").addClass("focused");
    var currentCreator = $(this.id).find(" .creator-container")[
      keys.creatorSelection
    ];
    $(currentCreator).addClass("focused");
    var currentTitle = $(this.id).find(" .creator-title")[
      keys.creatorSelection
    ];
    $(currentTitle).addClass("focused");
  },

  moveCreatorsContainer: function () {
    var keys = this.keys;
    var rowIndex = Math.floor(keys.creatorSelection / this.creatorsPerRow);
    var creatorsContainer = $(this.id + " .media-grid-rows-container")[0];
    var creatorRow = $(creatorsContainer).find(
      " .media-grid-row-thumbnails"
    )[0];
    var height = $(creatorRow).outerHeight();
    var newTop = -(rowIndex * height);

    if (this.isKeyPressed) animationTime = 0;
    else animationTime = 200;

    $(creatorsContainer).animate(
      {
        top: String(newTop) + "px"
      },
      animationTime
    );
  },

  setFocusedNextRowCreator: function () {
    var keys = this.keys;
    if (this.creators[keys.creatorSelection + this.creatorsPerRow]) {
      keys.creatorSelection += this.creatorsPerRow;
      this.setFocusedCreator();
    } else {
      keys.creatorSelection = this.creators.length - 1;
    }
  },

  isFirstCreatorRow: function () {
    return this.keys.creatorSelection < this.creatorsPerRow;
  },

  setFocusedPrevRowCreator: function () {
    this.keys.creatorSelection -= this.creatorsPerRow;
    this.setFocusedCreator(this.keys.creatorSelection - this.creatorsPerRow);
  },

  focusNavigation: function (prevSelection) {
    this.prevSelection = prevSelection;
    this.blurInput();
    navPage.expand(currentRoute);
    this.isExpand = true;
    currentRoute = "nav-page";
  },

  unfocusNavigation: function () {
    navPage.collapse(currentRoute);
  },

  setSelectedCategory: function () {
    this.unselectCategories();
    this.selectCategories();
  },

  unselectCategories: function () {
    $(this.id + " .category-container").removeClass("selected");
    $(this.id + " .category-title").removeClass("selected");
  },

  selectCategories() {
    var keys = this.keys;
    var currentCategory = $(this.id).find(" .category-container")[
      keys.categorySelection
    ];
    var currentTitle = $(this.id).find(" .category-title")[
      keys.categorySelection
    ];
    $(currentCategory).addClass("selected");
    $(currentTitle).addClass("selected");
  },

  searchCreatorByAllCategory: function () {
    var _this = this;
    showLoader();
    getCreators()
      .then(
        response => {
          saveData("creators", response.data.creators);
          _this.creators = response.data.creators;
          _this.showCreators();
        });

  },

  searchCreatorsByCategory: function (selectedCategory) {
    var _this = this;
    searchCreatorsByCategory(selectedCategory).then(function (response) {
      _this.creators = response;
      _this.showCreators();
    });
  },

  showCreatorPlaylist: function (id) {
    if (currentRoute === "creators-page")
      $(this.id).addClass("hidden");
    else $("#search-container").addClass("hidden");
    showLoader();
    mediaGridPage.showEpisodeContents("#playlist-episode-container");
    $("#media-grid-container").addClass("hidden");
    var params = id;
    getEpisodes(params)
      .then(
        response_data => {
          var response = response_data.data.creator_playlist;
          var keys = mediaGridPage.keys;
          mediaGridPage.id = "#playlist-episode-container";
          mediaGridPage.keys.focusedPart = "episodeSelection";
          var pTitle = response_data.data.creator.channel_name;
          var episodes = response.items;
          if (episodes.length == 0) {
            showToast("Episode not found");
            hideLoader();
            this.goBack();
            return;
          }
          saveData("episodes", episodes);
          focusedVideo = episodes[0];
          keys.episodeSelection = 0;

          var itemHTML = "";
          episodes.map(function (item, index) {
            var tTitle = item.title;
            var creator = item.creator.channel_name;

            itemHTML +=
              '<div class="thumbnail-container" onclick="mediaGridPage.playVideo(2)">' +
              '<img src="' +
              item.thumbnail +
              '"  class="media-grid-thumbnail" />' +
              '<div class="video-title-container">' +
              '<p class="video-title ellipsis-text">' +
              tTitle +
              "</p>";

            itemHTML +=
              '<p class="video-description align-left ellipsis-text">' +
              creator +
              "</p>" +
              '<p class="video-duration align-right">' +
              formatDuration(item.duration) +
              "</p>" +
              "</div></div>";
          });

          var mediaGridHTML =
            '<div class="media-grid-row landscape" data-index="' +
            "index" +
            '">' +
            '<div class="media-grid-row-title-container">' +
            '<p class="media-grid-row-title dark-theme ellipsis-text">' +
            pTitle +
            "</p>" +
            "</div>" +
            '<div class="media-grid-row-thumbnails-container">' +
            '<div class = "swiper-prev-btn-container" onmouseleave="mediaGridPage.leaveNextButton()" onmouseenter="mediaGridPage.hoverNextButton(' + layout2 + ', -1)" onclick="mediaGridPage.clickNextButton(' + layout2 + ', -1, -1)"><div class="swiper-prev-button"><img src = "images/playlist-left-arrow-blue.svg"></div></div>' +
            '<div class="media-grid-row-thumbnails">' +
            itemHTML +
            "</div>" +
            '<div class = "swiper-next-btn-container" onmouseleave="mediaGridPage.leaveNextButton()" onmouseenter="mediaGridPage.hoverNextButton(' + layout2 + ', 1)" onclick="mediaGridPage.clickNextButton(' + layout2 + ', -1, 1)"><div class="swiper-next-button"><img src = "images/playlist-right-arrow-blue.svg"></div></div>' +
            "</div>" +
            "</div>";

          $("#playlist-episode-container .media-grid-rows-container").html(
            mediaGridHTML
          );
          $("#playlist-episode-container .media-grid-rows-container").css({
            top: "0px"
          });
          mediaGridPage.updateVideoContent();
          mediaGridPage.focusThumbnail();

          $(
            "#playlist-episode-container .focused-content-info-container"
          ).removeClass("inactive");

          $("#playlist-episode-container").removeClass("hidden");
          hideLoader();
        });
    mediaGridPage.prevRoute = currentRoute;
    currentRoute = "media-grid-page";
  },

  hoverCreator: function (row, col) {
    if (!isKeyboard) {
      var keys = this.keys;
      keys.creatorSelection = this.creatorsPerRow * row + col;
      keys.focusedPart = "creatorSelection";
      this.blurInput();
      this.unfocusCategories();
      this.blurInput();
      this.unfocusCreators();
      this.focusCreators();
    }
  },

  hoverSearchBar: function () {
    this.keys.focusedPart = "searchBar";
    this.unfocusCategories();
    this.unfocusCreators();
    this.activeInput();
  },

  hoverCategory: function (index) {
    if (!isKeyboard) {
      var keys = this.keys;
      keys.focusedPart = "categorySelection";
      keys.categorySelection = index;
      if (keys.categorySelection >= categories.length) {
        keys.categorySelection = categories.length - 1;
        return;
      } else if (keys.categorySelection < 0) {
        keys.categorySelection = 0;
        this.unfocusCategories();
        this.focusNavigation(keys.focusedPart);
        return;
      }
      this.unfocusCategories();
      this.focusCategories();
      this.blurInput();
      this.unfocusCreators();
    }
  },

  clickCategory: function (index) {
    var selectedCategory = categories[index];
    this.setSelectedCategory();
    if (selectedCategory.id == 0) {
      this.searchCreatorByAllCategory();
    } else {
      this.searchCreatorsByCategory(selectedCategory);
    }
    this.updateCreatorsTitle(selectedCategory.title);
    this.resetQuery();
  },

  updateCreatorsTitle: function (title) {
    $(".creators-title").text(title + " Creators");
  },

  leaveNextButton: function () {
    $(".category-prev-btn-container").removeClass("active");
    $(".category-next-btn-container").removeClass("active");
    this.keys.focusedPart = "creatorSelection";
  },

  hoverNextButton: function (increment) {
    if (!isKeyboard) {
      this.keys.focusedPart = "nextBtnSelection";
      $(".category-prev-btn-container").removeClass("active");
      $(".category-next-btn-container").removeClass("active");
      this.blurInput();
      this.unfocusCreators();
      if (increment === -1) {
        $(".category-prev-btn-container").addClass("active");
        this.nextBtnDom = $(".category-prev-btn-container");
      } else {
        $(".category-next-btn-container").addClass("active");
        this.nextBtnDom = $(".category-next-btn-container");
      }
    }
  },

  clickNextButton: function (increment) {
    var keys = this.keys;
    keys.categorySelection += increment;
    if (keys.categorySelection >= categories.length) {
      keys.categorySelection = categories.length - 1;
      return;
    } else if (keys.categorySelection < 0) {
      keys.categorySelection = 0;
      this.unfocusCategories();
      return;
    }
    this.setFocusedCategory();
  },

  goBack: function () {
    $(this.id).addClass("hidden");
    $("#media-grid-container").removeClass("hidden");
    currentRoute = "home-page";
    homePage.init();
  },

  handleMenuLeftRight: function (increment) {
    var keys = this.keys;
    switch (keys.focusedPart) {
      case "searchBar":
        if (!isKeyboard) {
          if (increment > 0) this.unfocusNavigation(keys.focusedPart);
          else this.focusNavigation(keys.focusedPart);
        }
        break;
      case "categorySelection":
        keys.categorySelection += increment;
        if (keys.categorySelection >= categories.length) {
          keys.categorySelection = categories.length - 1;
          return;
        } else if (keys.categorySelection < 0) {
          keys.categorySelection = 0;
          this.unfocusCategories();
          this.focusNavigation(keys.focusedPart);
          return;
        }
        this.setFocusedCategory();
        break;
      case "creatorSelection":
        if (keys.creatorSelection % this.creatorsPerRow == 0 && increment < 0) {
          this.unfocusCreators();
          this.focusNavigation(keys.focusedPart);
          return;
        }
        keys.creatorSelection += increment;
        if (keys.creatorSelection >= creators.length) {
          keys.creatorSelection = creators.length - 1;
          return;
        } else if (keys.creatorSelection < 0) {
          keys.creatorSelection = 0;
          this.unfocusCreators();
          this.focusNavigation(keys.focusedPart);
          return;
        }
        this.setFocusedCreator();
        break;
    }
  },

  handleMenuClick: function () {
    var keys = this.keys;
    switch (keys.focusedPart) {
      case "searchBar":
        this.focusInput();
        break;
      case "categorySelection":
        var selectedCategory = categories[keys.categorySelection];
        this.setSelectedCategory();
        if (selectedCategory.id == 0) {
          this.searchCreatorByAllCategory();
        } else {
          this.searchCreatorsByCategory(selectedCategory);
        }
        this.updateCreatorsTitle(selectedCategory.title);
        this.resetQuery();
        break;
      case "creatorSelection":
        var count = keys.creatorSelection;
        var row = Math.floor(count / 3);
        var col = count % 3;
        var currentRow = $(this.id + " .media-grid-row-thumbnails")[
          row
        ];
        var thumbnail = $(currentRow).find(".creator-container")[col];
        $(thumbnail).trigger("click");
        break;
      case "nextBtnSelection":
        $(this.nextBtnDom).trigger("click");
        break;
    }
  },

  handleMenusUpDown: function (increment) {
    var keys = this.keys;
    switch (keys.focusedPart) {
      case "searchBar":
        if (increment > 0) {
          this.blurInput();
          keys.focusedPart = "categorySelection";
          $(
            $(this.id + " .category-container")[keys.categorySelection]
          ).addClass("focused");
          $(
            $(this.id + " .category-title")[keys.categorySelection]
          ).addClass("focused");
        }
        break;
      case "categorySelection":
        if (increment < 0) {
          this.activeInput();
          keys.focusedPart = "searchBar";
          this.unfocusCategories();
        } else {
          keys.focusedPart = "creatorSelection";
          $(this.id + " .category-container").removeClass("focused");
          this.setFocusedCreator();
        }
        break;
      case "creatorSelection":
        if (increment > 0) this.setFocusedNextRowCreator();
        else {
          if (this.isFirstCreatorRow()) {
            keys.focusedPart = "categorySelection";
            this.setFocusedCategory();
            this.unfocusCreators();
          } else {
            this.setFocusedPrevRowCreator();
          }
        }
        break;
    }
  },

  HandleKey: function (e) {
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
};
