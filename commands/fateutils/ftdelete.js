exports.run = async (client, message, args, data) => {
  var user = message.author;

  if (args[0]) {
    user = message.guild.members.resolve(data.modules.id_parser(args[0]));

    if (!user) {
      message.channel.send("User aren't in the guild");
      return;
    }
  }

  if (user.id !== message.author.id) {
    let fatemaster = await data.database.query("SELECT * FROM discordbot.fate_master WHERE guild_id = ?", [message.guild.id]);

    if (fatemaster.length <= 0) {
      message.channel.send("You aren't the fate master");
      return;
    }

    let ftmaster = message.guild.members.resolve(fatemaster[0].user_id);

    if (!ftmaster) {
      await database.query("DELETE FROM discordbot.fate_master WHERE guild_id = ?", [guild.id]);
      message.channel.send("You aren't the fate master");
      return;
    }

    if (ftmaster.id !== message.author.id)  {
      message.channel.send("You aren't the fate master");
      return;
    }
  }

  let fatedata = await data.database.query("SELECT * FROM discordbot.fate_data WHERE guild_id = ? AND user_id = ?", [message.guild.id, user.id]);

  if (fatedata.length <= 0) {
    message.channel.send("User doesn't have a card registered");
    return;
  }

  await database.query("DELETE FROM discordbot.fate_data WHERE guild_id = ? AND user_id = ?", [guild.id, user.id]);
  message.channel.send("Fate card deleted with successful");
};

exports.help = {
  description: "Delete your fate card or the another people on the guild",
  usage: ["ftdelete", "ftdelete [mention]", "ftdelete [id]"],
  name: "ftdelete",
  permissions: "everyone"
};