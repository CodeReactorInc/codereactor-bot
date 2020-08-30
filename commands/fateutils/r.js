const alias = require('./roll.js');
exports.run = alias.run;
exports.help = alias.help;

exports.help.usage = ["r [dice]"];
exports.help.name = "r";