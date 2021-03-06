const Discord = require('discord.js');

exports.run = async (client, message, args, data) => {
  var user = message.author;

  data.logger.info("Checking args...");
  if (args[0]) {
    data.logger.info("Resolving args to a guild member...");
    user = message.guild.members.resolve(data.modules.id_parser(args[0]));

    if (!user) {
      data.logger.warn("Guild member doesn't exists");
      message.channel.send("User aren't in the guild");
      return;
    }
  }

  data.logger.info("Verifying if need load fate master...");
  if (user.id !== message.author.id) {
    data.logger.info("Loading fate master...");
    let fatemaster = await data.database.query("SELECT * FROM discordbot.fate_master WHERE guild_id = ?", [message.guild.id]);

    data.logger.info("Testing size of fate master list...");
    if (fatemaster.length <= 0) {
      data.logger.warn("Fate master aren't registered");
      message.channel.send("You aren't the fate master");
      return;
    }

    data.logger.info("Resolving fate master to a guild member...");
    let ftmaster = message.guild.members.resolve(fatemaster[0].user_id);

    data.logger.info("Testing if fate master exists...");
    if (!ftmaster) {
      data.logger.warn("Fate master is a link to a unknown member....");
      await database.query("DELETE FROM discordbot.fate_master WHERE guild_id = ?", [guild.id]);
      message.channel.send("You aren't the fate master");
      return;
    }

    data.logger.info("Testing if fate master is the author...");
    if (ftmaster.id !== message.author.id)  {
      data.logger.warn("Fate master aren't the user author");
      message.channel.send("You aren't the fate master");
      return;
    }
  }

  data.logger.info("Checking if user want delete...");
  message.channel.send("You want delete your fate card? (Yes/No)");
  let deleteft = await yesOrNo(message.channel, message.author);
  if (deleteft) {
    data.logger.info("Collecting fate card...");
    let fatedata = await data.database.query("SELECT * FROM discordbot.fate_data WHERE guild_id = ? AND user_id = ?", [message.guild.id, user.id]);

    data.logger.info("Verifying fate card size...");
    if (fatedata.length <= 0) {
      data.logger.warn("Fate card doesn't exists");
      message.channel.send("User doesn't have a card registered");
      return;
    }

    data.logger.info("Deleting fate card...");
    await data.database.query("DELETE FROM discordbot.fate_data WHERE guild_id = ? AND user_id = ?", [message.guild.id, user.id]);
    message.channel.send("Fate card deleted with successful");
  } else {
    data.logger.warn("User don't has accept the confirmation");
    message.channel.send("Fate card aren't deleted, user has recused");
  }
};

exports.help = {
  description: "Delete your fate card or the another people on the guild",
  usage: ["ftdelete", "ftdelete [mention]", "ftdelete [id]"],
  name: "ftdelete",
  permissions: "everyone"
};

function yesOrNo(channel, author) {
  return new Promise(async (resolve) => {
    let collector = new Discord.MessageCollector(channel, (m) => (m.content.toLowerCase() === "yes" || m.content.toLowerCase() === "no") && m.author.id === author.id, {
      time: 120000,
      max: 1
    });
    collector.on("end", (collected) => {
      if (collected.size === 0) {
        resolve(null);
      } else {
        resolve(collected.first().content === "yes");
      }
    });
  });
}