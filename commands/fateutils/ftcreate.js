exports.run = async (client, message, args, data) => {
  data.logger.info("Verifying if user only has a fate card...");
  let cardold = await data.database.query("SELECT * FROM discordbot.fate_data WHERE user_id = ? AND guild_id = ?", [message.author.id, message.guild.id]);

  if (cardold.length > 0) {
    message.channel.send("You already has a fate card");
    return;
  }

  let locked = data.cache.get("ftlock-"+message.guild.id+"-"+message.author.id);
  if (locked) {
    message.channel.send("You already running the creator");
    return;
  }
  data.cache.set("ftlock-"+message.guild.id+"-"+message.author.id, true);
  
  data.logger.info("Starting fate card creator...");

  var card = {
    name: null,
    description: "",
    stunts: null,
    aspects: {
      concept: null,
      problem: null,
      free1: null,
      free2: null,
      free3: null
    },
    stats: null
  }

  var msg = await message.channel.send("Starting fate card creator...");
  msg = await msg.edit("Type the name of the caracter: (Limit 32 chars)");

  let name = await data.modules.fate_creator.collectString(32, message.channel, message.author);

  if (!name) {
    message.channel.send("Timeout, try again using '"+data.server_config.prefix+"ftcreator'");
    data.cache.delete("ftlock-"+message.guild.id+"-"+message.author.id);
    return;
  }

  card.name = name.content;
  await name.delete();
  await msg.delete();

  msg = await message.channel.send("Type your aspect concept: (Limit 256 chars)");

  let aspcon = await data.modules.fate_creator.collectString(256, message.channel, message.author);

  if (!aspcon) {
    message.channel.send("Timeout, try again using '"+data.server_config.prefix+"ftcreator'");
    data.cache.delete("ftlock-"+message.guild.id+"-"+message.author.id);
    return;
  }

  card.aspects.concept = aspcon.content;
  await aspcon.delete();
  await msg.delete();

  msg = await message.channel.send("Type your aspect problem: (Limit 256 chars)");

  let aspro = await data.modules.fate_creator.collectString(256, message.channel, message.author);

  if (!aspro) {
    message.channel.send("Timeout, try again using '"+data.server_config.prefix+"ftcreator'");
    data.cache.delete("ftlock-"+message.guild.id+"-"+message.author.id);
    return;
  }

  card.aspects.problem = aspro.content;
  await aspro.delete();
  await msg.delete();

  msg = await message.channel.send("Type your aspect free 1: (Limit 256 chars)");

  let asfre1 = await data.modules.fate_creator.collectString(256, message.channel, message.author);

  if (!asfre1) {
    message.channel.send("Timeout, try again using '"+data.server_config.prefix+"ftcreator'");
    data.cache.delete("ftlock-"+message.guild.id+"-"+message.author.id);
    return;
  }

  card.aspects.free1 = asfre1.content;
  await asfre1.delete();
  await msg.delete();

  msg = await message.channel.send("Type your aspect free 2: (Limit 256 chars)");

  let asfre2 = await data.modules.fate_creator.collectString(256, message.channel, message.author);

  if (!asfre2) {
    message.channel.send("Timeout, try again using '"+data.server_config.prefix+"ftcreator'");
    data.cache.delete("ftlock-"+message.guild.id+"-"+message.author.id);
    return;
  }

  card.aspects.free2 = asfre2.content;
  await asfre2.delete();
  await msg.delete();

  msg = await message.channel.send("Type your aspect free 3: (Limit 256 chars)");

  let asfre3 = await data.modules.fate_creator.collectString(256, message.channel, message.author);

  if (!asfre3) {
    message.channel.send("Timeout, try again using '"+data.server_config.prefix+"ftcreator'");
    data.cache.delete("ftlock-"+message.guild.id+"-"+message.author.id);
    return;
  }

  card.aspects.free3 = asfre3.content;
  await asfre3.delete();
  await msg.delete();

  msg = await message.channel.send("Type your stunts: (Limit 1024 chars)");

  let stunts = await data.modules.fate_creator.collectString(1024, message.channel, message.author);

  if (!stunts) {
    message.channel.send("Timeout, try again using '"+data.server_config.prefix+"ftcreator'");
    data.cache.delete("ftlock-"+message.guild.id+"-"+message.author.id);
    return;
  }

  card.stunts = stunts.content;
  await stunts.delete();
  await msg.delete();

  msg = await message.channel.send("You want a description? (yes/no)");

  let descbool = await data.modules.fate_creator.collectBool(message.channel, message.author);
  await msg.delete();
  if (descbool) {
    msg = await message.channel.send("Provide a description: (Limit 1024 chars)");
    let desc = await data.modules.fate_creator.collectString(1024, message.channel, message.author);
    if (!desc) {
      msg1 = await message.channel.send("Timeout, edit with '"+data.server_config.prefix+"ftedit' your fate card to add a description if you want");
      setTimeout(msg1.delete, 3000);
    } else {
      card.description = desc.content;
      await desc.delete();
      await msg.delete();
    }
  }

  msg2 = await message.channel.send("Starting skills collector...");
  setTimeout(msg2.delete, 3000);
  let skills = await data.modules.fate_creator.collectAspects(message.channel, message.author);

  if (!skills) {
    message.channel.send("Timeout or invalid skill value, try again using '"+data.server_config.prefix+"ftcreator'");
    data.cache.delete("ftlock-"+message.guild.id+"-"+message.author.id);
    return;
  } 

  card.stats = skills;
  msg = await message.channel.send("Saving values...");
  await data.database.query("INSERT INTO discordbot.fate_data (user_id, guild_id, name, stunts, description, aspect_concept, aspect_problem, aspect_free1, aspect_free2, aspect_free3, agile, careful, smart, stylish, power, sneaky) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", [message.author.id, message.guild.id, card.name, card.stunts, card.description, card.aspects.concept, card.aspects.problem, card.aspects.free1, card.aspects.free2, card.aspects.free3, card.stats.agile, card.stats.careful, card.stats.smart, card.stats.stylish, card.stats.power, card.stats.sneaky]);
  await msg.edit("Value saved!");
  data.cache.delete("ftlock-"+message.guild.id+"-"+message.author.id);
  data.logger.info("Fate creator has successful finalized and added new values");
};

exports.help = {
  description: "Create a fate card for you",
  usage: ["ftcreate"],
  name: "ftcreate",
  permissions: "everyone"
};