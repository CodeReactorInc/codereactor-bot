exports.run = async (client, message, args, data) => {
  data.logger.info("Generating Discord bot invite...");
  let link = await client.generateInvite(["KICK_MEMBERS", "BAN_MEMBERS", "ADD_REACTIONS", "VIEW_CHANNEL", "VIEW_CHANNEL", "SEND_MESSAGES", "MANAGE_MESSAGES", "EMBED_LINKS", "ATTACH_FILES", "READ_MESSAGE_HISTORY", "MENTION_EVERYONE", "USE_EXTERNAL_EMOJIS", "VIEW_GUILD_INSIGHTS", "MANAGE_WEBHOOKS"]);
  message.channel.send("**Bot invite:** <"+link+">\n**Server invite:** <https://discord.gg/Jja9n2H>");
};

exports.help = {
  description: "Invite the bot to your own server",
  usage: ["invite"],
  name: "invite",
  permissions: "everyone"
};