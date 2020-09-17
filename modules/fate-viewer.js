const { createCanvas, loadImage, registerFont } = require('canvas');

const { getLogger } = require('../libs/logger.js');
const fs = require('fs');
const streams = [ fs.createWriteStream(__dirname+'/../logs/latest.log', { flags: 'a' }), process.stdout ];

const logger = getLogger("Fate Viewer", streams);

registerFont(__dirname+"/../bin/DejaVuSans.ttf", { family: 'dejavusans'});
registerFont(__dirname+"/../bin/DejaVuSans-Bold.ttf", { family: 'dejavusans-bold'});
module.exports = async (fatedata) => {
  logger.info("Creating canvas with 1080x1620...");
  const canvas = createCanvas(1080, 1620);
  logger.info("Getting a 2D context from canvas...");
  const ctx = canvas.getContext('2d');
  logger.info("Drawing image...");
  ctx.drawImage((await loadImage(__dirname+'/../bin/ftbackground.png')), 0, 0);
  logger.info("Setting style...");
  ctx.font = '26px dejavusans';
  ctx.fillStyle = '#fffff2';
  logger.info("Setting 'name' in "+84+"x"+136);
  ctx.fillText(fatedata.name, 84, 136);
  let descLines = [];
  let descLine = "";
  for(let i = 0;i < fatedata.description.length;i++) {
    let char = fatedata.description[i];
    if (char === "\n") {
      descLines.push(descLine);
      descLine = "";
    } else if (ctx.measureText(descLine + char).width > 608) {
      descLines.push(descLine);
      descLine = "";
    } else {
      descLine += char;
    }
  }
  descLines.push(descLine);
  descLine = "";
  let lastDescValue = 190;
  logger.info("Description has "+descLines.length+" lines");
  for(let i = 0;i < descLines.length && i < 5;i++) {
    logger.info("Setting 'description' in "+84+"x"+lastDescValue);
    ctx.fillText(descLines[i], 84, lastDescValue);
    lastDescValue += 25;
  }
  logger.info("Setting 'recharge' in "+740+"x"+265);
  ctx.font = '60px dejavusans-bold';
  ctx.fillText("+"+fatedata.recharge, 740, 265);
  let dpwidth = (943 + 21) - ((ctx.measureText(fatedata.destiny_points).width / 42)  * 21);
  logger.info("Setting 'destiny_points' in "+dpwidth+"x"+265);
  ctx.fillText(fatedata.destiny_points, dpwidth, 265);
  ctx.font = '38px dejavusans-bold';
  logger.info("Setting 'agile' in "+915+"x"+412);
  ctx.fillText("+"+fatedata.agile, 915, 412);
  logger.info("Setting 'careful' in "+915+"x"+469);
  ctx.fillText("+"+fatedata.careful, 915, 469);
  logger.info("Setting 'smart' in "+915+"x"+544);
  ctx.fillText("+"+fatedata.smart, 915, 544);
  logger.info("Setting 'stylish' in "+915+"x"+610);
  ctx.fillText("+"+fatedata.stylish, 915, 610);
  logger.info("Setting 'power' in "+915+"x"+676);
  ctx.fillText("+"+fatedata.power, 915, 676);
  logger.info("Setting 'sneaky' in "+915+"x"+742);
  ctx.fillText("+"+fatedata.sneaky, 915, 742);
  return canvas.toBuffer();
};