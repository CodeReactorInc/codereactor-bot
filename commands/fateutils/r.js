let alias = require('./roll.js');
exports.run = alias.run;
exports.help = {
  description: "Roll a dice for you",
  usage: ["r [dice]"],
  name: "r",
  permissions: "everyone"
};