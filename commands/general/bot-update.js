const child_process = require('child_process');

exports.run = async (client, message, args, data) => {
  data.logger.info("Testing if message author are the bot owner...");

  if (message.author.id !== data.config.OWNER_ID) {
    data.logger.warn("Message author aren't the owner: "+message.author.id);
    message.channel.send("You aren't the bot owner");
    return;
  }

  message.channel.send("Preparing to start git... (Update branch: '"+data.config.UPDATER.BRANCH+"')");
  data.logger.warn("Bot are executing 'git pull'");
  data.logger.warn("Prepare for a possibly restart");

  let cwd = child_process.spawn(data.config.UPDATER.GIT_CMD, ['pull', 'origin', data.config.UPDATER.BRANCH], {
    cwd: __dirname+"/../../",
    detached: true,
    stdio: 'ignore'
  });
  cwd.unref();

  data.logger.info("Git started with successful, waiting git exit...");
  message.channel.send("Git are started with successful");

  cwd.on('exit', (code) => {
    data.logger.info("Git has exited ("+code+")");
    if (code === 0) {
      message.channel.send("Git update finalized with successful");
    } else {
      message.channel.send("Git update finalized with exit code: "+code);
    }
  });
};

exports.help = {
  description: "Starts a git process with pull argment and update downloading data from GitHub",
  usage: ["bot-update"],
  name: "bot-update",
  permissions: "bot owner"
};