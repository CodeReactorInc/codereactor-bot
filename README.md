# Code Reactor Bot
Project by Kitsune IDK for Code Reactor

## Warn

This bot aren't created for self host, if want install and execute he, you need a MariaDB SQL Server and advanced knowledges of SQL and JavaScript, this repository are created for collab development

## How to install?

1. (OPTIONAL) Create a user for the bot and add privileges for he
2. Create a database named "discordbot"
3. Create all tables needed on your MariaDB Server, [more info](https://github.com/CodeReactorInc/codereactor-bot#mariadb-needed-tables)
4. Run after clone, run ``npm install`` to install declared dependencies
5. Run ``node init.js`` to generate config.json file
6. Configure the ``config.json``, insert MariaDB login info, Discord token and another things
7. And run it

## How to run?

Use ``npm start`` to run nodemon with correct arguments

## How to contribute?

1. Create a branch on GitHub
2. Add this repository as remote after git init on your local machine
3. Pull from your branch
4. Edit all you want
5. Push all data to your branch
6. Create a Pull request on GitHub
7. Wait the Code Reactor verify and approve your request

## MariaDB needed tables

### server_config

- id VARCHAR(20) NOT NULL
- prefix VARCHAR(5) DEFAULT '!'
- fateutils TINYINT(1) DEFAULT 0

### guild_join

- guild_id VARCHAR(20) NOT NULL
- message VARCHAR(256) DEFAULT ''
- user_id VARCHAR(20) NOT NULL

### guild_leave

- guild_id VARCHAR(20) NOT NULL
- message VARCHAR(256) DEFAULT ''
- user_id VARCHAR(20) NOT NULL

### fate_master

- user_id VARCHAR(20) NOT NULL
- guild_id VARCHAR(20) NOT NULL

### fate_data

- user_id VARCHAR(20) NOT NULL
- guild_id VARCHAR(20) NOT NULL
- name VARCHAR(32) NOT NULL
- stunts VARCHAR(256) NOT NULL
- description VARCHAR(160) DEFAULT ''
- recharge TINYINT(3) UNSIGNED DEFAULT 3
- destiny_points TINYINT(3) UNSIGNED ZEROFILL DEFAULT 3
- aspect_concept VARCHAR(256) NOT NULL
- aspect_problem VARCHAR(256) NOT NULL
- aspect_free1 VARCHAR(256) NOT NULL
- aspect_free2 VARCHAR(256) NOT NULL
- aspect_free3 VARCHAR(256) NOT NULL
- agile TINYINT(3) NOT NULL
- careful TINYINT(3) NOT NULL
- smart TINYINT(3) NOT NULL
- stylish TINYINT(3) NOT NULL
- sneaky TINYINT(3) NOT NULL
- stress TINYINT(3) DEFAULT 0
- consequence_smooth VARCHAR(128) DEFAULT ''
- consequence_moderate VARCHAR(128) DEFAULT ''
- consequence_heavy VARCHAR(128) DEFAULT ''

## License

This project has been created by Code Reactor with [GPL v3.0 license](https://github.com/CodeReactorInc/codereactor-bot/blob/master/LICENSE.txt) to you can modify, copy and recreate

## Bot info

- Name: Code Reactor Bot
- Main category: General
- Version: 0.0.1 Alpha
- Generation: 5
