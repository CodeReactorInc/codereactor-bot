const logger = require("../../libs/logger");

exports.run = (client, message, args, data) => {
  data.logger.info("Testing if message author are the bot owner...");

  if (message.author.id !== data.config.OWNER_ID) {
    data.logger.warn("Message author aren't the owner: "+message.author.id);
    message.channel.send("You aren't the bot owner");
    return;
  }

  message.channel.send("Bot are restarting now...");
  logger.info("NodeJS are restarting...");
  fs.writeFileSync(__dirname+'/../../random.id', Math.random().toString());
};

exports.help = {
  description: "Force bot to restart modifying a system file",
  usage: ["bot-restart"],
  name: "bot-restart",
  permissions: "bot owner"
};