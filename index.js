const { getLogger } = require('./libs/logger.js');
const fs = require('fs');
const streams = [ fs.createWriteStream(__dirname+'/logs/latest.log', { flags: 'a' }), process.stdout ];

const main_logger = getLogger("Discord Bot", streams);

const cache = new Map();

main_logger.info("Importing modules...");
const Discord = require('discord.js');
const DatabaseDriver = require('./libs/database-driver.js');

main_logger.info("Creating instance of DiscordJS...");
const client = new Discord.Client();

main_logger.info("Reading config.json...");
const CONFIG = JSON.parse(fs.readFileSync(__dirname+"/config.json"));

main_logger.info("Creating instance of Database Driver");
const database = new DatabaseDriver(CONFIG.MARIADB.HOST, CONFIG.MARIADB.USER, CONFIG.MARIADB.PASSWORD);

main_logger.info("Registering events...");
client.on('message', async (message) => {
  let event_logger = getLogger("Event 'message'", streams);

  event_logger.info("Verifying if message is from a guild...");
  if (!message.guild) {
    logger.warn("Message aren't from a guild");
    return;
  }

  event_logger.info("Loading guild config and data...");
  var server_config = (await database.get("SELECT * FROM discordbot.server_config WHERE id = ?", [message.guild.id]));

  if (!server_config) {
    event_logger.warn("Guild don't has data registered");
    event_logger.info("Creating data for the server...");
    await database.query("INSERT INTO discordbot.server_config (id) VALUES (?)", [message.guild.id]);
    server_config = await database.get("SELECT * FROM discordbot.server_config WHERE id = ?", [message.guild.id]);
  }

  if (message.author.bot) {
    event_logger.warn("Message author is a bot");
    return;
  }

  if (message.content.trim() === "<@!"+client.user.id+">" || message.content.trim() === "<@"+client.user.id+">" || message.content.trim() === "@"+client.user.tag) {
    message.channel.send("My prefix on '"+message.guild.name+"' are `"+server_config.prefix+"`");
    return;
  } 

  if (!message.content.startsWith(server_config.prefix)) return;

  let args = message.content.trim().slice(server_config.prefix.length).split(' ');
  let cmd = args.shift().toLowerCase();

  var data = {
    config: CONFIG,
    server_config: server_config,
    database: database,
    modules: {
      config: {
        setter: require('./modules/config-setter.js'),
        getter: require('./modules/config-getter.js')
      },
      fate_creator: require('./modules/fate-creator.js'),
      fate_viewer: require('./modules/fate-viewer.js'),
      id_parser: require('./modules/id-parser.js'),
      fate_editor: require('./modules/fate-editor.js'),
      help: require('./modules/help-module.js')
    },
    cache: cache
  };
  
  let cmd_logger = getLogger("Command Executor", streams);
  
  try {
    cmd_logger.info("Searching for commmand...");
    let cmd_path = require('./libs/command-finder.js')(cmd, server_config);
    if (cmd_path === null) {
      cmd_logger.warn("Command not found: '"+cmd+"'");
      return;
    }
    
    cmd_logger.info("Loading file...");
    let cmd_file = require(cmd_path);
    
    cmd_logger.info("Creating a logger...");
    data.logger = getLogger("Command '"+cmd+"'", streams);
    
    cmd_logger.info("Executing command...");
    cmd_file.run(client, message, args, data);
  } catch (e) {
    cmd_logger.error(e);
  }
});

client.on('guildMemberAdd', (member) => {
  let event_logger = getLogger("Event 'guildMemberAdd'", streams);
  try {
    event_logger.info("Starting and reloading module for event 'guildMemberAdd'...");
    require("./libs/guild-member.js")(member, database, event_logger, 'add');
  } catch (e) {
    event_logger.error(e);
  }
});

client.on('guildMemberRemove', (member) => {
  let event_logger = getLogger("Event 'guildMemberRemove'", streams);
  try {
    event_logger.info("Starting and reloading module for event 'guildMemberRemove'...");
    require("./libs/guild-member.js")(member, database, event_logger, 'remove');
  } catch (e) {
    event_logger.error(e);
  }
});

client.on('ready', () => {
  main_logger.info("Created connection with successful");
  
  if (CONFIG.LIST.length > 0) {
    let presence_logger = getLogger("Presence Updater", streams);
    presence_logger.info("Using list: "+JSON.stringify(CONFIG.LIST));
    
    let number = Math.floor(Math.random()*CONFIG.LIST.length);
    let presence = CONFIG.LIST[number].replace("%GUILDSIZE%", client.guilds.cache.size);
    
    presence_logger.info("First setting: '"+presence+"'");
    
    client.user.setPresence({ activity: { name: presence, type: 'PLAYING' }, status: 'online' });
    
    setInterval(() => {
      let number = Math.floor(Math.random()*CONFIG.LIST.length);
      let presence = CONFIG.LIST[number].replace("%GUILDSIZE%", client.guilds.cache.size);
      
      presence_logger.info("Setting: '"+presence+"'");
      
      client.user.setPresence({ activity: { name: presence, type: 'PLAYING' }, status: 'online' });
    }, 30000);
  } else {
    client.user.setPresence({ activity: { name: "Powered by Code Reactor", type: 'PLAYING' }, status: 'online' });
  }

  main_logger.info("Loading cache controller...");

  setInterval(() => {
    let cache_logger = getLogger("Cache Controller", streams);
    cache_logger.info("Clearing cache...");
    cache.forEach((value, key) => {
      cache_logger.info("Verifying '"+key+"'...");
      if (value.created + value.lifespan <= Date.now()) {
        cache_logger.info("Deleted '"+key+"'");
        cache.delete(key);
      }
    });
  }, 6*60*60*1000);
});

client.on('guildDelete', async (guild) => {
  main_logger.info("Deleting all data for server '"+guild.name+"'...");
  await database.query("DELETE FROM discordbot.fate_master WHERE guild_id = ?", [guild.id]);
  await database.query("DELETE FROM discordbot.fate_data WHERE guild_id = ?", [guild.id]);
  await database.query("DELETE FROM discordbot.guild_join WHERE guild_id = ?", [guild.id]);
  await database.query("DELETE FROM discordbot.guild_leave WHERE guild_id = ?", [guild.id]);
  await database.query("DELETE FROM discordbot.server_config WHERE id = ?", [guild.id]);
  main_logger.info("All data from '"+guild.name+"' are deleted!");
});

client.on('disconnect', (event) => {
  main_logger.warn("Client disconnected");
});

client.on('error', (error) => {
  main_logger.error(error);
});

client.on('reconnecting', () => {
  main_logger.warn("Reconnecting...");
});

client.on('resume', (n) => {
  main_logger.info("Connection resumed with "+n+" tries");
});

client.login(CONFIG.TOKEN)
  .catch((e) => {
    main_logger.error(e);
    if (CONFIG.RESTART_ON_ERROR) fs.writeFileSync('./random.id', Math.random().toString());
  });
  