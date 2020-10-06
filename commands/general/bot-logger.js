const fs = require('fs');

exports.run = async (client, message, args, data) => {
  data.logger.info("Testing if message author are the bot owner...");

  if (message.author.id !== data.config.OWNER_ID) {
    data.logger.warn("Message author aren't the owner: "+message.author.id);
    message.channel.send("You aren't the bot owner");
    return;
  }

  data.logger.info("Reading latest.log...");
  let log = fs.readFileSync(__dirname + '/../../logs/latest.log', { encoding: 'utf8'});
  data.logger.info("Building lines list and inverting...");
  let lines = log.split('\n').reverse();
  var msg = "";
  data.logger.info("Creating msg limited in 2000 chars...");
  for(var i = 0;i < lines.length;i++) {
    if ((lines[i] + "\n" + msg).length > 2000) break;
    msg = lines[i] + "\n" + msg;
  }
  data.logger.info("Sending logger...");
  message.channel.send(msg);
};

exports.help = {
  description: "Read and send the logger data",
  usage: ["bot-logger"],
  name: "bot-logger",
  permissions: "bot owner"
};