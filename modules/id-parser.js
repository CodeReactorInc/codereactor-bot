module.exports = (mention) => {
  if (mention.startsWith("<@!") && mention.endsWith(">")) return mention.slice(3, mention.length - 1);
  if (mention.startsWith("<@&") && mention.endsWith(">")) return mention.slice(3, mention.length - 1);
  if (mention.startsWith("<@") && mention.endsWith(">")) return mention.slice(2, mention.length - 1);
  if (mention.startsWith("<#") && mention.endsWith(">")) return mention.slice(2, mention.length - 1);
  return mention;
};