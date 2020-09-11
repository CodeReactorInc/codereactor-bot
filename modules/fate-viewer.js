const { createCanvas, loadImage, registerFont } = require('canvas');

registerFont(__dirname+"/../bin/DejaVuSans.ttf", { family: 'dejavusans'});
module.exports = async (fatedata) => {
  const canvas = createCanvas(1080, 1620);
  const ctx = canvas.getContext('2d');
  ctx.drawImage((await loadImage(__dirname+'/../bin/ftbackground.png')), 0, 0);
  ctx.font = '25px dejavusans';
  ctx.fillStyle = '#fffff2';
  ctx.fillText(fatedata.name, 84, 136);
  return canvas.toBuffer();
};