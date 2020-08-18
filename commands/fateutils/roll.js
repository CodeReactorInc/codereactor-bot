const { DiceRoll } = require('rpg-dice-roller');

exports.run = async (client, message, args, data) => {
  try {
    let notation = args.join(' ');
    let roller = new DiceRoll(notation);
    message.channel.send(roller.output);
  } catch (e) {
    message.channel.send("Invalid notation: '"+args.join(' ')+"'");
  }
};

exports.help = {
  description: "Roll a dice for you",
  usage: ["roll [dice]"],
  name: "roll",
  permissions: "everyone"
};