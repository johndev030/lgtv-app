/* eslint-disable no-undef */
/* eslint-disable no-unused-vars  */
"use strict";

var authPage = {
  getApp: function () {
    var count = 0;
    var limit = 3;

    function getPlaylistChildren() {
      return new Promise(function (resolve, reject) {
        var params = {
          parent_id: appDefaults.rootPlaylistId,
          per_page: 50,
          sort: "priority",
          order: "dsc",
          page: 1
        };

        getPlaylists(params)
          .then(
            function (playlistsResp) {
              var playlistChildrenArray = [];

              console.log(playlistsResp);
              if (playlistsResp && playlistsResp.data.swimlanes.length > 0) {
                var playlists = playlistsResp.data.swimlanes;



                for (var i = 0; i < playlists.length; i++) {
                  var playlistChildrenArray = playlists[i].items;
                  var playlistChildrenArray = [];
                  /*  for (var i = 0; i < playlistChildrenArray.length; i++) {
                      if (playlists[i].type = "CREATORS") {
                       playlistChildrenArray.push({
                         id: playlists[i].playlist_id,
                         type: "videos",
                         title: playlists[i].title,
                         thumbnailLayout: playlists[i].thumbnail,
                         gridItemSelection: 0
                       });
  
                      }
                     
                    }*/
                  playlists[i].gridItemSelection = 0;

                  playlists[i].playlist_type = playlists[i].type;
                  //delete playlists[i].items;
                }
                console.log(playlists);
                resolve(playlists);
                /*  for (var i = 0; i < playlists.length; i++) {
                     if (playlists[i].type == "VIDEOS") {
                       if (playlists[i].items.length > 0) {
   
                         functionCallsArray.push([
                           getPlaylistVideos,
                           [playlists[i].unique_id, { per_page: 500 }]
                         ]);
                         playlistChildrenArray.push({
                           id: playlists[i].unique_id,
                           type: "videos",
                           title: playlists[i].title,
                           thumbnailLayout: playlists[i].thumbnail,
                           gridItemSelection: 0
                         });
   
                         console.log(playlists[i].unique_id);
   
                         console.log(functionCallsArray);
   
   
                       } else {
                         functionCallsArray.push([
                           getPlaylists,
                           [
                             {
                               parent_id: playlists[i].unique_id,
                               per_page: 500,
                               sort: "priority",
                               order: "desc"
                             }
                           ]
                         ]);
   
   
   
                         playlistChildrenArray.push({
                           id: playlists[i].unique_id,
                           type: "playlists",
                           title: playlists[i].title,
                           thumbnailLayout: playlists[i].thumbnail,
                           gridItemSelection: 0
                         });
                       }
   
                     }
                     console.log(functionCallsArray);
                   }
                   callMultiple(functionCallsArray)
                     .then(
                       function (resps) {
                         for (var i = 0; i < playlistChildrenArray.length; i++) {
                           playlistChildrenArray[i].content = resps[i].response;
                         }
   
                         resolve(playlistChildrenArray);
                       },
                       function (err) {
                         reject(err);
                       }
                     );*/
              }
            },
            function (err) {
              if (count <= limit) {
                count++;
                console.log("Retrying " + count + " of " + limit);
                getPlaylistChildren();
              } else {
                showToast(
                  "Maximum retries reached. Unable to fetch data.",
                  ""
                );
                reject(err);
              }
            }
          );
      });
    }

    function makeAjaxCallWithRetries(config) {
      return new Promise(function (resolve, reject) {
        config.tryCount = 0;
        config.retryLimit = 3;

        function ajaxCall() {
          $.ajax(config)
            .then(function (data) {
              resolve(data);
            })
            .catch(function (error) {
              console.error(
                "auth.js line 138 (ajax call) - Error occurred:",
                error,
                config
              );

              if (config.tryCount <= config.retryLimit) {
                if (error.statusText === "timeout") {
                  config.tryCount++;
                  console.log(
                    "Retrying " + config.tryCount + " of " + config.retryLimit
                  );
                  ajaxCall();
                } else {
                  showToast("API call failed. Retrying...", "");
                  config.tryCount++;
                  console.log(
                    "Retrying " + config.tryCount + " of " + config.retryLimit
                  );
                  ajaxCall();
                }
              } else {
                showToast(
                  "Maximum retries reached. Unable to fetch data.",
                  ""
                );
                reject(error);
              }
            });
        }

        ajaxCall();
      });
    }

    makeAjaxCallWithRetries({
      method: "GET",
      url: apiPrefixUrl + "app",
      headers: { "Content-Type": "application/json" },
      data: { app_key: appDefaults.appKey }
    })
      .then(function () {
        return makeAjaxCallWithRetries({
          method: "GET",
          url: "https://api.of.tv/v0/pages/home",
          headers: { "Content-Type": "application/json" }
        });
      })
      .then(function (data) {
        saveData("sliders", data.data.hero_slider.items);
        getSlidersThumbnail();

        return getPlaylistChildren();
      })
      .then(
        function (resp) {
          saveData("mediaContent", resp);
          homePage.init();
        },
        function (err) {
          console.error(
            "auth.js line 202 (sliders and media content) - Error occurred:",
            err
          );
        }
      )
      .then(function () {

        getCreators()
          .then(
            resp => {
              var categories = [];
              if (resp.data.genres && resp.data.genres.length > 0) {
                var genres = resp.data.genres;
                for (var i = 0; i < genres.length; i++) {
                  categories.push(new CategoryModel(genres[i]));
                }
              }
              var categoryAll = new categoryModel({ id: 0, name: "All" });
              var allCategories = [categoryAll].concat(categories);
              console.log(allCategories);
              saveData("categories", allCategories);
            },
            err => { // error. return empty array
              console.error(
                "auth.js line 216 (loading categories) - Error occurred:",
                err
              );
            }
          );
      })
      .catch(function (error) {
        console.error(
          "auth.js line 224 (API Calls fail) - Error occurred:",
          error
        );
        showToast("API calls failed. Unable to fetch data.", "");
      });
  },

  goBack: function () {
    window.close();
  },

  HandleKey: function (e) {
    switch (e.keyCode) {
      case lgKey.RETURN:
        this.goBack();
        break;
    }
  }
};
