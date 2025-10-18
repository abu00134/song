"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.checkAdmin = exports.deleteAlbum = exports.createAlbum = exports.deleteSong = exports.createSong = void 0;

var _songModel = require("../models/song.model.js");

var _albumModel = require("../models/album.model.js");

var _cloudinary = _interopRequireDefault(require("../lib/cloudinary.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// helper function for cloudinary uploads
var uploadToCloudinary = function uploadToCloudinary(file) {
  var result;
  return regeneratorRuntime.async(function uploadToCloudinary$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return regeneratorRuntime.awrap(_cloudinary["default"].uploader.upload(file.tempFilePath, {
            resource_type: "auto"
          }));

        case 3:
          result = _context.sent;
          return _context.abrupt("return", result.secure_url);

        case 7:
          _context.prev = 7;
          _context.t0 = _context["catch"](0);
          console.log("Error in uploadToCloudinary", _context.t0);
          throw new Error("Error uploading to cloudinary: ".concat(_context.t0.message));

        case 11:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 7]]);
};

var createSong = function createSong(req, res, next) {
  var _req$body, title, artist, albumId, duration, audioFile, imageFile, audioUrl, imageUrl, song;

  return regeneratorRuntime.async(function createSong$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;

          if (!(!req.files || !req.files.audioFile || !req.files.imageFile)) {
            _context2.next = 3;
            break;
          }

          return _context2.abrupt("return", res.status(400).json({
            message: "Please upload all files"
          }));

        case 3:
          _req$body = req.body, title = _req$body.title, artist = _req$body.artist, albumId = _req$body.albumId, duration = _req$body.duration;
          audioFile = req.files.audioFile;
          imageFile = req.files.imageFile;
          _context2.next = 8;
          return regeneratorRuntime.awrap(uploadToCloudinary(audioFile));

        case 8:
          audioUrl = _context2.sent;
          _context2.next = 11;
          return regeneratorRuntime.awrap(uploadToCloudinary(imageFile));

        case 11:
          imageUrl = _context2.sent;
          song = new _songModel.Song({
            title: title,
            artist: artist,
            audioUrl: audioUrl,
            imageUrl: imageUrl,
            duration: duration,
            albumId: albumId || null
          });
          _context2.next = 15;
          return regeneratorRuntime.awrap(song.save());

        case 15:
          if (!albumId) {
            _context2.next = 18;
            break;
          }

          _context2.next = 18;
          return regeneratorRuntime.awrap(_albumModel.Album.findByIdAndUpdate(albumId, {
            $push: {
              songs: song._id
            }
          }));

        case 18:
          res.status(201).json(song);
          _context2.next = 25;
          break;

        case 21:
          _context2.prev = 21;
          _context2.t0 = _context2["catch"](0);
          console.log("Error in createSong", _context2.t0);
          next(_context2.t0);

        case 25:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 21]]);
};

exports.createSong = createSong;

var deleteSong = function deleteSong(req, res, next) {
  var id, song;
  return regeneratorRuntime.async(function deleteSong$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          id = req.params.id;
          _context3.next = 4;
          return regeneratorRuntime.awrap(_songModel.Song.findById(id));

        case 4:
          song = _context3.sent;

          if (!song.albumId) {
            _context3.next = 8;
            break;
          }

          _context3.next = 8;
          return regeneratorRuntime.awrap(_albumModel.Album.findByIdAndUpdate(song.albumId, {
            $pull: {
              songs: song._id
            }
          }));

        case 8:
          _context3.next = 10;
          return regeneratorRuntime.awrap(_songModel.Song.findByIdAndDelete(id));

        case 10:
          res.status(200).json({
            message: "Song deleted successfully"
          });
          _context3.next = 17;
          break;

        case 13:
          _context3.prev = 13;
          _context3.t0 = _context3["catch"](0);
          console.log("Error in deleteSong", _context3.t0);
          next(_context3.t0);

        case 17:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 13]]);
};

exports.deleteSong = deleteSong;

var createAlbum = function createAlbum(req, res, next) {
  var _req$body2, title, artist, releaseYear, imageFile, imageUrl, album;

  return regeneratorRuntime.async(function createAlbum$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;

          if (!(!req.files || !req.files.imageFile)) {
            _context4.next = 3;
            break;
          }

          return _context4.abrupt("return", res.status(400).json({
            message: "Please upload an image file"
          }));

        case 3:
          _req$body2 = req.body, title = _req$body2.title, artist = _req$body2.artist, releaseYear = _req$body2.releaseYear;
          imageFile = req.files.imageFile;
          _context4.next = 7;
          return regeneratorRuntime.awrap(uploadToCloudinary(imageFile));

        case 7:
          imageUrl = _context4.sent;
          album = new _albumModel.Album({
            title: title,
            artist: artist,
            imageUrl: imageUrl,
            releaseYear: releaseYear
          });
          _context4.next = 11;
          return regeneratorRuntime.awrap(album.save());

        case 11:
          res.status(201).json(album);
          _context4.next = 18;
          break;

        case 14:
          _context4.prev = 14;
          _context4.t0 = _context4["catch"](0);
          console.log("Error in createAlbum", _context4.t0);
          next(_context4.t0);

        case 18:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[0, 14]]);
};

exports.createAlbum = createAlbum;

var deleteAlbum = function deleteAlbum(req, res, next) {
  var id;
  return regeneratorRuntime.async(function deleteAlbum$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          id = req.params.id;
          _context5.next = 4;
          return regeneratorRuntime.awrap(_songModel.Song.deleteMany({
            albumId: id
          }));

        case 4:
          _context5.next = 6;
          return regeneratorRuntime.awrap(_albumModel.Album.findByIdAndDelete(id));

        case 6:
          res.status(200).json({
            message: "Album deleted successfully"
          });
          _context5.next = 13;
          break;

        case 9:
          _context5.prev = 9;
          _context5.t0 = _context5["catch"](0);
          console.log("Error in deleteAlbum", _context5.t0);
          next(_context5.t0);

        case 13:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[0, 9]]);
};

exports.deleteAlbum = deleteAlbum;

var checkAdmin = function checkAdmin(req, res, next) {
  return regeneratorRuntime.async(function checkAdmin$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          res.status(200).json({
            admin: true
          });

        case 1:
        case "end":
          return _context6.stop();
      }
    }
  });
};

exports.checkAdmin = checkAdmin;
//# sourceMappingURL=admin.controller.dev.js.map
