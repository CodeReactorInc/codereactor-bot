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
  logger.info("Setting 'smart' in "+915+"x"+525);
  ctx.fillText("+"+fatedata.smart, 915, 525);
  logger.info("Setting 'stylish' in "+915+"x"+581);
  ctx.fillText("+"+fatedata.stylish, 915, 581);
  logger.info("Setting 'power' in "+915+"x"+637);
  ctx.fillText("+"+fatedata.power, 915, 637);
  logger.info("Setting 'sneaky' in "+915+"x"+694);
  ctx.fillText("+"+fatedata.sneaky, 915, 694);

  ctx.font = '26px dejavusans';
  logger.info("Setting 'aspect_concept' in "+90+"x"+414);
  ctx.fillText(fatedata.aspect_concept, 90, 414);
  logger.info("Setting 'aspect_problem' in "+90+"x"+481);
  ctx.fillText(fatedata.aspect_problem, 90, 481);
  logger.info("Setting 'aspect_free1' in "+90+"x"+546);
  ctx.fillText(fatedata.aspect_free1, 90, 546);
  logger.info("Setting 'aspect_free2' in "+90+"x"+613);
  ctx.fillText(fatedata.aspect_free2, 90, 613);
  logger.info("Setting 'aspect_free3' in "+90+"x"+681);
  ctx.fillText(fatedata.aspect_free3, 90, 681);

  logger.info("Setting 'consequence_smooth' in "+522+"x"+1429);
  ctx.fillText(fatedata.consequence_smooth, 522, 1429);
  logger.info("Setting 'consequence_moderate' in "+522+"x"+1496);
  ctx.fillText(fatedata.consequence_moderate, 522, 1496);
  logger.info("Setting 'consequence_heavy' in "+522+"x"+1562);
  ctx.fillText(fatedata.consequence_heavy, 522, 1562);

  ctx.font = '80px dejavusans-bold';
  logger.info("Processing stress: "+fatedata.stress);
  switch(fatedata.stress) {
    case 1:
      logger.info("Setting 'stress'-1 in "+108+"x"+1463);
      ctx.fillText("X", 108, 1463);
      break;
    case 2:
      logger.info("Setting 'stress'-2 in "+241+"x"+1463);
      ctx.fillText("X", 241, 1463);
      break;
    case 3:
      logger.info("Setting 'stress'-3 in "+369+"x"+1463);
      ctx.fillText("X", 369, 1463);
      break;
  }

  ctx.font = '26px dejavusans';
  let stuntLines = [];
  let stuntLine = "";
  for(let i = 0;i < fatedata.stunts.length;i++) {
    let char = fatedata.stunts[i];
    if (char === "\n") {
      stuntLines.push(stuntLine);
      stuntLine = "";
    } else if (ctx.measureText(stuntLine + char).width > 958) {
      stuntLines.push(stuntLine);
      stuntLine = "";
    } else {
      stuntLine += char;
    }
  }

  stuntLines.push(stuntLine);
  stuntLine = "";
  let lastStuntsValue = 794;
  let stuntSize = 0;

  logger.info("Stunts has "+stuntLines.length+" lines");
  for(let i = 0;i < stuntLines.length && i < 100000;i++) {
    logger.info("Setting 'stunts' in "+84+"x"+lastStuntsValue);
    ctx.fillText(stuntLines[i], 84, lastStuntsValue);
    lastStuntsValue += 25;
    stuntSize += stuntLines[i].length;
  }
  logger.info("Stunts char size is: "+stuntSize);
  return canvas.toBuffer();
};