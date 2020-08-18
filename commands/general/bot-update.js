const child_process = require('child_process');

exports.run = (client, message, args, data) => {
  data.logger.info("Testing if message author are the bot owner...");

  if (message.author.id !== data.config.OWNER_ID) {
    data.logger.warn("Message author aren't the owner: "+message.author.id);
    message.channel.send("You aren't the bot owner");
    return;
  }

  message.channel.send("Preparing to start git detached...");
  data.logger.warn("Bot are executing 'git pull'");
  data.logger.warn("Prepare for a possibly restart");

  let cwd = child_process.spawn('git', ['pull', 'origin', 'master'], {
    cwd: __dirname+"/../../",
    detached: true,
    stdio: 'ignore'
  });
  cwd.unref();

  data.logger.info("Git started with successful");
  message.channel.send("Git started! Updating...");
};

exports.help = {
  description: "Starts a git process with pull argment and update downloading data from GitHub",
  usage: ["bot-update"],
  name: "bot-update",
  permissions: "bot owner"
};