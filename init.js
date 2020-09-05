console.log("Initializing logger...");

const { getLogger } = require('./libs/logger.js');
const fs = require('fs');

if (!fs.existsSync(__dirname+"/logs")) fs.mkdirSync(__dirname+"/logs");

const streams = [ fs.createWriteStream(__dirname+'/logs/latest.log'), process.stdout ];

const logger = getLogger("Bot Initializer", streams);

logger.info("Trying to read config.json...");
if (!fs.existsSync(__dirname+"/config.json")) {
  logger.warn("Config.json don't found, generating...");
  fs.writeFileSync(__dirname+"/config.json", JSON.stringify({
    TOKEN: "Discord Token",
    OWNER_ID: "Your ID",
    MARIADB: {
      HOST: "localhost",
      USER: "",
      PASSWORD: ""
    },
    LIST: [],
    RESTART_ON_ERROR: false,
    SHARDS: 1
  }, null, 4));
  return;
}

var shards = null;
logger.info("Loading config.json...");
const config = JSON.parse(fs.readFileSync(__dirname+"/config.json"));
logger.info("Config loaded");

logger.info("Importing Discord and creating manager...");

const Discord = require('discord.js');
const manager = new Discord.ShardingManager('./index.js');

logger.info("Spawning "+config.SHARDS+" shards...");

(async () => {
  shards = await manager.spawn(config.SHARDS);
})();

process.on('exit', (code) => {
  if (shards !== null) {
    shards.array().forEach(element => {
      element.kill();
    });
  }
});

logger.info("All ready");