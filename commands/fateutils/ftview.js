const Discord = require('discord.js');

exports.run = async (client, message, args, data) => {
  var user = message.author;

  if (args[0]) {
    user = message.guild.members.resolve(data.modules.id_parser(args[0]));

    if (!user) {
      message.channel.send("User aren't in the guild");
      return;
    }
  }

  let fatedata = await data.database.query("SELECT * FROM discordbot.fate_data WHERE guild_id = ? AND user_id = ?", [message.guild.id, user.id]);

  if (fatedata.length <= 0) {
    message.channel.send("User doesn't have a card registered");
    return;
  }

 var msg = await message.channel.send("Generating card...");
 let img = await data.modules.fate_viewer(fatedata[0]);
 msg = await msg.edit("Sending image...");
 await message.channel.send(new Discord.MessageAttachment(img));
 msg.delete();
};

exports.help = {
  description: "View your fate card or the another people on the guild",
  usage: ["ftview", "ftview [mention]",  "ftview [id]"],
  name: "ftview",
  permissions: "everyone"
};