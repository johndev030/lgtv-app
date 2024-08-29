(function (exports) {
  "use strict";

  var ZypeApiHelpers = function () {

    this.searchVideos = (query) => {
      console.log('query', query)
      return new Promise((resolve, reject) => {
        var params = {
          "q": query,
          "per_page": 125,
          "order": "desc",
          "sort": "updated_at"
        };

        getVideos(params)
          .then(
            resp => {
              var videos = resp.response;
              resolve(videos);
            },
            err => { // error. return empty array
              resolve([]);
            }
          );
      });
    };

    this.searchCreators = (query) => {
      return new Promise((resolve, reject) => {
        var params = {
          "q": query,
          "per_page": 125,
          "active": true,
          "category": "Creator Name",
          "order": "desc",
          "sort": "updated_at"
        };

        getPlaylists(params)
          .then(
            resp => {
              var filtered = [];
              var playlists = resp.response;
              for (var int = 0; int < playlists.length; int++) {
                var playlist = playlists[int];
                if (!(playlist.friendly_title.endsWith("-originals") ||
                  playlist.friendly_title.endsWith("-original") ||
                  playlist.friendly_title.endsWith("-featured") ||
                  playlist.friendly_title.endsWith("-feature") ||
                  playlist.friendly_title.endsWith("-mobile") ||
                  playlist.friendly_title.endsWith("-homepage"))) {
                  filtered.push(playlist._id);
                }
              }
              this.getCreators(filtered).then(creators => resolve(creators));
            },
            err => { // error. return empty array
              resolve([]);
            }
          );
      });
    };

    this.loadCategories = () => {
      return new Promise((resolve, reject) => {
        var params = {
          "per_page": 100,
          "orderby": "id",
          "order": "asc"
        };
        getCategories(params)
          .then(
            resp => {
              var categories = [];
              if (resp && resp.length > 0) {
                for (var i = 0; i < resp.length; i++) {
                  categories.push(new CategoryModel(resp[i]));
                }
              }
              resolve(categories);
            },
            err => { // error. return empty array
              resolve([]);
            }
          );
      });
    };

    this.getPlaylistChildren = (playlistId) => {
      return new Promise((resolve, reject) => {
        var params = {
          parent_id: playlistId,
          per_page: 50,
          sort: "priority",
          order: "dsc",
          page: 1
        };

        getPlaylists(params)
          .then(
            (playlistsResp) => {
              var playlistChildrenArray = [];

              if (playlistsResp && playlistsResp.response.length > 0) {
                var playlists = playlistsResp.response;

                var functionCallsArray = [];
                for (var i = 0; i < playlists.length; i++) {
                  if (playlists[i].playlist_item_count > 0) {
                    functionCallsArray.push([
                      getPlaylistVideos,
                      [playlists[i]._id, { per_page: 500 }]
                    ]);

                    playlistChildrenArray.push({
                      id: playlists[i]._id,
                      type: "videos",
                      title: playlists[i].title,
                      thumbnailLayout: playlists[i].thumbnail_layout,
                      gridItemSelection: 0
                    });
                  }
                  else {
                    functionCallsArray.push([
                      getPlaylists,
                      [{ parent_id: playlists[i]._id, per_page: 500, sort: "priority", order: "desc" }]
                    ]);

                    playlistChildrenArray.push({
                      id: playlists[i]._id,
                      type: "playlists",
                      title: playlists[i].title,
                      thumbnailLayout: playlists[i].thumbnail_layout,
                      gridItemSelection: 0
                    })
                  }
                }

                callMultiple(functionCallsArray)
                  .then(
                    (resps) => {
                      for (var i = 0; i < playlistChildrenArray.length; i++) {
                        playlistChildrenArray[i].content = resps[i].response;
                      }

                      resolve(playlistChildrenArray)
                    },
                    (err) => {
                      reject(err);
                    }
                  );

              }
              else {
                getPlaylist(playlistId, {})
                  .then(
                    (playlistResp) => {
                      var playlist = playlistResp.response;

                      getPlaylistVideos(playlistId, { per_page: 500 })
                        .then(
                          (resp) => {
                            playlistChildrenArray.push({
                              type: "videos",
                              title: playlist.title,
                              thumbnailLayout: playlist.thumbnail_layout,
                              content: resp.response,
                              gridItemSelection: 0
                            });

                            resolve(playlistChildrenArray);
                          },
                          (err) => { reject(err); }
                        );
                    },
                    (err) => { reject(err); }
                  );
              }
            },
            (err) => { reject(err); }
          );
      });
    };

    this.getCreators = (creatorIds) => {
      return new Promise((resolve, reject) => {
        var params = {
          "meta_key": "oftv_show-field--root_playlist_id",
          "meta_value": creatorIds,
          "per_page": creatorIds.length,
        };
        getCreator(params)
          .then(
            resp => {
              var creators = [];
              if (resp && resp.length > 0) {
                for (var i = 0; i < resp.length; i++) {
                  creators.push(new showModel(resp[i]));
                }
              }
              resolve(creators);
            },
            err => { // error.
              resolve([]);
            }
          );
      });
    };
  };

  exports.ZypeApiHelpers = new ZypeApiHelpers();
})(window);
