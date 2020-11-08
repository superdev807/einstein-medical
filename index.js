const fs = require("fs");
const readline = require("readline");
const fileName = "./config.txt";

const readInterface = readline.createInterface({
  input: fs.createReadStream(fileName),
  output: process.output,
  console: false,
});

const comments = [];
let configMap = {};

const isNumeric = (str) => {
  if (typeof str != "string") return false;
  return !isNaN(str) && !isNaN(parseFloat(str));
};

const booleanOrString = (str) => {
  if (["on", "yes", "true"].indexOf(str) >= 0) return true;
  if (["off", "no", "false"].indexOf(str) >= 0) return false;
  return str;
};

const validateConfigValue = (value) => {
  return isNumeric(value) ? parseFloat(value) : booleanOrString(value);
};

readInterface.on("line", function (orgline) {
  const line = orgline.replace(/\s/g, "");
  if (line) {
    if (line[0] === "#") comments.push(line);
    else {
      const configMapVal = line.split("=");
      if (configMapVal && configMapVal.length === 2) {
        const key = configMapVal[0];
        const configVal = configMapVal[1];
        configMap[key] = validateConfigValue(configVal);
        console.log(`${key}:${configMap[key]}`);
      }
    }
  }
});

readInterface.on("close", function () {
  console.log("------Comments-------");
  console.log(comments);
  console.log("------Config Values-------");
  console.log(configMap);
});
