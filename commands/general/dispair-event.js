exports.run = async (client, message, args, data) => {
  data.logger.info("Testing if message author are the bot owner...");

  if (message.author.id !== data.config.OWNER_ID) {
    data.logger.warn("Message author aren't the owner: "+message.author.id);
    message.channel.send("You aren't the bot owner");
    return;
  }

  data.logger.info("Analysing args and triggering server...");
  switch (args[0]) {
    case "guildMemberAdd":
      client.emit("guildMemberAdd", message.member);
      break;

    case "guildMemberRemove":
      client.emit("guildMemberRemove", message.member);
      break;
      
    default:
      data.logger.warn("Invalid event to trigger");
      message.channel.send("Invalid event to trigger");
      return;
  }

  data.logger.info("Event '"+args[0]+"' triggered");
  message.channel.send("Event triggered with success!");
};

exports.help = {
  description: "Dispair a event in the bot",
  usage: ["dispair-event [event]"],
  name: "dispair-event",
  permissions: "bot owner"
};