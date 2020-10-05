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

  data.logger.info("Colleting fate data...");
  let fatedata = await data.database.query("SELECT * FROM discordbot.fate_data WHERE guild_id = ? AND user_id = ?", [message.guild.id, user.id]);

  if (fatedata.length <= 0) {
    data.logger.warn("Fate card doesn't exists");
    message.channel.send("User doesn't have a card registered");
    return;
  }

  await message.channel.send(
    "**Select a option:**\n"+
    "0 - Name\n"+
    "1 - Description\n"+
    "2 - Recharge\n"+
    "3 - Destiny points\n"+
    "4 - Aspect concept\n"+
    "5 - Aspect problem\n"+
    "6 - Aspect free 1\n"+
    "7 - Aspect free 2\n"+
    "8 - Aspect free 3\n"+
    "9 - Approaches\n"+
    "10 - Stunts\n"+
    "11 - Stress\n"+
    "12 - Smooth consequence\n"+
    "13 - Moderate consequence\n"+
    "14 - Heavy consequence"
  );
  let op = await data.modules.fate_editor.collectOperation(message.channel, message.author);
  
  data.logger.info("Processing operation: "+op);
  switch (op) {
    case "0":
      await message.channel.send("Type the name of your character: (Limit 32 chars)");
      let name = await data.modules.fate_editor.collectString(32, message.channel, message.author);
      if (!name) {
        message.channel.send("User doesn't have provided a value");
        return;
      }
      await data.database.query("UPDATE discordbot.fate_data SET name = ? WHERE user_id = ? AND guild_id = ?", [name, user.id, message.guild.id]);
      message.channel.send("Value saved with successful");
      break;
    case "1":
      await message.channel.send("Type your description: (Limit 165 chars)");
      let desc = await data.modules.fate_editor.collectString(165, message.channel, message.author);
      if (!desc) {
        message.channel.send("User doesn't have provided a value");
        return;
      }
      await data.database.query("UPDATE discordbot.fate_data SET description = ? WHERE user_id = ? AND guild_id = ?", [desc, user.id, message.guild.id]);
      message.channel.send("Value saved with successful");
      break;
    case "2":
      await message.channel.send("Type your recharge value: (0-99)");
      let recharge = await data.modules.fate_editor.collectInt(message.channel, message.author);
      if (!recharge) {
        message.channel.send("User doesn't have provided a valid value");
        return;
      }
      await data.database.query("UPDATE discordbot.fate_data SET recharge = ? WHERE user_id = ? AND guild_id = ?", [recharge, user.id, message.guild.id]);
      message.channel.send("Value saved with successful");
      break;
    case "3":
      await message.channel.send("Type your destiny points value: (0-99)");
      let points = await data.modules.fate_editor.collectInt(message.channel, message.author);
      if (!points) {
        message.channel.send("User doesn't have provided a valid value");
        return;
      }
      await data.database.query("UPDATE discordbot.fate_data SET destiny_points = ? WHERE user_id = ? AND guild_id = ?", [points, user.id, message.guild.id]);
      message.channel.send("Value saved with successful");
      break;
    case "4":
      await message.channel.send("Type your aspect concept: (Limit 28 chars)");
      let concept = await data.modules.fate_editor.collectString(28, message.channel, message.author);
      if (!concept) {
        message.channel.send("User doesn't have provided a value");
        return;
      }
      await data.database.query("UPDATE discordbot.fate_data SET aspect_concept = ? WHERE user_id = ? AND guild_id = ?", [concept, user.id, message.guild.id]);
      message.channel.send("Value saved with successful");
      break;
    case "5":
      await message.channel.send("Type your aspect problem: (Limit 28 chars)");
      let problem = await data.modules.fate_editor.collectString(28, message.channel, message.author);
      if (!problem) {
        message.channel.send("User doesn't have provided a value");
        return;
      }
      await data.database.query("UPDATE discordbot.fate_data SET aspect_problem = ? WHERE user_id = ? AND guild_id = ?", [problem, user.id, message.guild.id]);
      message.channel.send("Value saved with successful");
      break;
    case "6":
      await message.channel.send("Type your aspect free 1: (Limit 28 chars)");
      let free1 = await data.modules.fate_editor.collectString(28, message.channel, message.author);
      if (!free1) {
        message.channel.send("User doesn't have provided a value");
        return;
      }
      await data.database.query("UPDATE discordbot.fate_data SET aspect_free1 = ? WHERE user_id = ? AND guild_id = ?", [free1, user.id, message.guild.id]);
      message.channel.send("Value saved with successful");
      break;
    case "7":
      await message.channel.send("Type your aspect free 2: (Limit 28 chars)");
      let free2 = await data.modules.fate_editor.collectString(28, message.channel, message.author);
      if (!free2) {
        message.channel.send("User doesn't have provided a value");
        return;
      }
      await data.database.query("UPDATE discordbot.fate_data SET aspect_free2 = ? WHERE user_id = ? AND guild_id = ?", [free2, user.id, message.guild.id]);
      message.channel.send("Value saved with successful");
      break;
    case "8":
      await message.channel.send("Type your aspect free 3: (Limit 28 chars)");
      let free3 = await data.modules.fate_editor.collectString(28, message.channel, message.author);
      if (!free3) {
        message.channel.send("User doesn't have provided a value");
        return;
      }
      await data.database.query("UPDATE discordbot.fate_data SET aspect_free3 = ? WHERE user_id = ? AND guild_id = ?", [free3, user.id, message.guild.id]);
      message.channel.send("Value saved with successful");
      break;
    case "9":
      let approach = await data.modules.fate_editor.collectApproach(message.channel, message.author, fatedata[0]);
      if (!approach) {
        message.channel.send("User doesn't have provided a value");
        return;
      }
      await data.database.query("UPDATE discordbot.fate_data SET agile = ?, careful = ?, smart = ?, stylish = ?, power = ?, sneaky = ? WHERE user_id = ? AND guild_id = ?", [approach.agile, approach.careful, approach.smart, approach.stylish, approach.power, approach.sneaky, user.id, message.guild.id]);
      message.channel.send("Value saved with successful");
      break;
    case "10":
      await message.channel.send("Type your stunts: (Limit 1100 chars)");
      let stunts = await data.modules.fate_editor.collectString(1100, message.channel, message.author);
      if (!stunts) {
        message.channel.send("User doesn't have provided a value");
        return;
      }
      await data.database.query("UPDATE discordbot.fate_data SET stunts = ? WHERE user_id = ? AND guild_id = ?", [stunts, user.id, message.guild.id]);
      message.channel.send("Value saved with successful");
      break;
    case "11":
      await message.channel.send("Type your stress: (0-3)");
      let stress = await data.modules.fate_editor.collectStress(message.channel, message.author);
      if (!stress) {
        message.channel.send("User doesn't have provided a value");
        return;
      }
      await data.database.query("UPDATE discordbot.fate_data SET stress = ? WHERE user_id = ? AND guild_id = ?", [stress, user.id, message.guild.id]);
      message.channel.send("Value saved with successful");
      break;
    case "12":
      await message.channel.send("Type your smooth consequence: (Limit 27 chars)");
      let cons = await data.modules.fate_editor.collectString(27, message.channel, message.author);
      if (!cons) {
        message.channel.send("User doesn't have provided a value");
        return;
      }
      await data.database.query("UPDATE discordbot.fate_data SET consequence_smooth = ? WHERE user_id = ? AND guild_id = ?", [cons, user.id, message.guild.id]);
      message.channel.send("Value saved with successful");
      break;
    case "13":
      await message.channel.send("Type your moderate consequence: (Limit 27 chars)");
      let conm = await data.modules.fate_editor.collectString(27, message.channel, message.author);
      if (!conm) {
        message.channel.send("User doesn't have provided a value");
        return;
      }
      await data.database.query("UPDATE discordbot.fate_data SET consequence_moderate = ? WHERE user_id = ? AND guild_id = ?", [conm, user.id, message.guild.id]);
      message.channel.send("Value saved with successful");
      break;
    case "14":
      await message.channel.send("Type your heavy consequence: (Limit 27 chars)");
      let conh = await data.modules.fate_editor.collectString(27, message.channel, message.author);
      if (!conh) {
        message.channel.send("User doesn't have provided a value");
        return;
      }
      await data.database.query("UPDATE discordbot.fate_data SET consequence_heavy = ? WHERE user_id = ? AND guild_id = ?", [conh, user.id, message.guild.id]);
      message.channel.send("Value saved with successful");
      break;
    default:
      message.channel.send("You selected a invalid option");
      break;
  }
};

exports.help = {
  description: "Edit your fate card or the another people in the guild",
  usage: ["ftedit", "ftedit [mention]", "ftedit [id]"],
  name: "ftedit",
  permissions: "everyone"
};