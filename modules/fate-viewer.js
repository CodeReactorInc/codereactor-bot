const { createCanvas, loadImage, registerFont } = require('canvas');

registerFont(__dirname+"/../bin/DejaVuSans.ttf", { family: 'dejavusans'});
module.exports = (fatedata) => {
  const canvas = createCanvas(1080, 1620);
  const ctx = canvas.getContext('2d');
  ctx.drawImage(await loadImage(__dirname+'/../bin/ftbackground.png'), 0, 0);
  ctx.font = '12px dejavusans';
  ctx.fillText(fatedata.name, 10, 10);
  return canvas.toBuffer();
};