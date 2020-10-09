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
    MANIFEST: 1,
    TOKEN: "Discord Token",
    OWNER_ID: "Your ID",
    MARIADB: {
      HOST: "localhost",
      USER: "",
      PASSWORD: ""
    },
    UPDATER: {
      GIT_CMD: 'git',
      BRANCH: 'master'
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

logger.info("Testing if config are in new format...");
if (config.MANIFEST === null || config.MANIFEST === undefined) {
  logger.info("Recreating and updating config.json...");
  fs.writeFileSync(__dirname+"/config.json", JSON.stringify({
    MANIFEST: 1,
    TOKEN: config.TOKEN,
    OWNER_ID: config.OWNER_ID,
    MARIADB: {
      HOST: config.MARIADB.HOST,
      USER: config.MARIADB.USER,
      PASSWORD: config.MARIADB.PASSWORD
    },
    UPDATER: {
      GIT_CMD: 'git',
      BRANCH: 'master'
    },
    LIST: config.LIST,
    RESTART_ON_ERROR: config.RESTART_ON_ERROR,
    SHARDS: config.SHARDS
  }, null, 4));
  logger.info("Config.json rewrited, please restart");
  return;
}

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