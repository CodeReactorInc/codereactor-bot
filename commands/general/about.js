exports.run = async (client, message, args, data) => {
  data.logger.info("Starting to create the message...");
  var msg = "**Dev info:**\n"+
    "Developer: Code Reactor\n"+
    "Runtime: NodeJS\n"+
    "Lang: JavaScript\n"+
    "Library: DiscordJS\n\n"
    "Bot version: "+require('../../package.json').version+"\n";
    "Update branch: master\n\n";

  data.logger.info("Collecting info from client...");
  msg += "**Client info:**\nClient ping: " + client.ws.ping + "ms\n";
  let date = new Date(client.uptime);
  msg += "Client uptime: "+date.getDay()+" days, "+date.getHours()+" hours, "+date.getMinutes()+" minutes, "+date.getSeconds()+" seconds\n";
  msg += "Client shards: "+client.ws.shards.size+" shards\n";
  msg += "Client version: "+require('../../package.json').dependencies["discord.js"].version+"\n";

  data.logger.info("Collection info from system...");
  let ndate = new Date(process.uptime);
  msg += "**System info:**\n"+
    "NodeJS Version: "+process.version+"\n"+
    "NodeJS Uptime: "+ndate.getDay()+" days, "+ndate.getHours()+" hours, "+ndate.getMinutes()+" minutes, "+ndate.getSeconds()+" seconds\n"+
    "Platform: "+process.platform+"\n"+
    "Arch: "+process.arch+"\n"+
    "CPU Usage: "+process.cpuUsage().user+"/"+process.cpuUsage().system+"\n"+
    "Memory Usage: "+process.memoryUsage().heapUsed+"/"+process.memoryUsage().heapTotal+"\n";

  data.logger.info("Sending final message...");
  message.channel.send(msg);
};

exports.help = {
  description: "Ban the mentioned user from server",
  usage: ["ban [id]", "ban [mention]", "ban [id] [message]", "ban [mention] [message]"],
  name: "ban",
  permissions: "ban members"
};