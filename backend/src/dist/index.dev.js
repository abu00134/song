"use strict";

var _express = _interopRequireDefault(require("express"));

var _dotenv = _interopRequireDefault(require("dotenv"));

var _express2 = require("@clerk/express");

var _expressFileupload = _interopRequireDefault(require("express-fileupload"));

var _path = _interopRequireDefault(require("path"));

var _cors = _interopRequireDefault(require("cors"));

var _fs = _interopRequireDefault(require("fs"));

var _os = _interopRequireDefault(require("os"));

var _http = require("http");

var _nodeCron = _interopRequireDefault(require("node-cron"));

var _socket = require("./lib/socket.js");

var _db = require("./lib/db.js");

var _userRoute = _interopRequireDefault(require("./routes/user.route.js"));

var _adminRoute = _interopRequireDefault(require("./routes/admin.route.js"));

var _authRoute = _interopRequireDefault(require("./routes/auth.route.js"));

var _songRoute = _interopRequireDefault(require("./routes/song.route.js"));

var _albumRoute = _interopRequireDefault(require("./routes/album.route.js"));

var _statRoute = _interopRequireDefault(require("./routes/stat.route.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

_dotenv["default"].config();

var _dirname = _path["default"].resolve();

var app = (0, _express["default"])();
var PORT = process.env.PORT;
var httpServer = (0, _http.createServer)(app);
(0, _socket.initializeSocket)(httpServer);
app.use((0, _cors["default"])({
  origin: "http://localhost:3000",
  credentials: true
}));
app.use(_express["default"].json()); // to parse req.body

app.use((0, _express2.clerkMiddleware)()); // this will add auth to req obj => req.auth

app.use((0, _expressFileupload["default"])({
  useTempFiles: true,
  tempFileDir: _os["default"].tmpdir(),
  createParentPath: true,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB  max file size

  }
})); // cron jobs
// Removed cron job to avoid deleting system temp files

app.use("/api/users", _userRoute["default"]);
app.use("/api/admin", _adminRoute["default"]);
app.use("/api/auth", _authRoute["default"]);
app.use("/api/songs", _songRoute["default"]);
app.use("/api/albums", _albumRoute["default"]);
app.use("/api/stats", _statRoute["default"]);

if (process.env.NODE_ENV === "production") {
  app.use(_express["default"]["static"](_path["default"].join(_dirname, "../frontend/dist")));
  app.get("*", function (req, res) {
    res.sendFile(_path["default"].resolve(_dirname, "../frontend", "dist", "index.html"));
  });
} // error handler


app.use(function (err, req, res, next) {
  res.status(500).json({
    message: process.env.NODE_ENV === "production" ? "Internal server error" : err.message
  });
});
httpServer.listen(PORT, function () {
  console.log("Server is running on port " + PORT);
  (0, _db.connectDB)();
});
//# sourceMappingURL=index.dev.js.map
