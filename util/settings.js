const fs = require("fs");

exports.botAPIToken = fs.readFileSync("api_token").toString().split("\n", 1)[0];
exports.botServerUrl = "http://localhost:60245";

