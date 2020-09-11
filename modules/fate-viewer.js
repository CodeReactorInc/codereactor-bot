const { createCanvas, loadImage, registerFont } = require('canvas');

registerFont(__dirname+"/../bin/DejaVuSans.ttf", { family: 'dejavusans'});
module.exports = async (fatedata) => {
  const canvas = createCanvas(1080, 1620);
  const ctx = canvas.getContext('2d');
  ctx.drawImage((await loadImage(__dirname+'/../bin/ftbackground.png')), 0, 0);
  ctx.font = '26px dejavusans';
  ctx.fillStyle = '#fffff2';
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
    } else if (i === (fatedata.description.length - 1)) {
      descLines.push(descLine);
      descLine = "";
    } else {
      descLine += char;
    }
  }
  let lastDescValue = 158;
  for(let i = 0;i < descLines.length;i++) {
    if (ctx.measureText(descLines[i]).height < 136) {
      ctx.fillText(descLines[i], 84, lastDescValue);
      lastDescValue += ctx.measureText(descLines[i]).height;
    }
  }
  return canvas.toBuffer();
};