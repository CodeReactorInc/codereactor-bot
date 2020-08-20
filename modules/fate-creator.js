const Discord = require('discord.js');

function collectString(size, channel, author) {
  return new Promise(async (resolve) => {
    let collector = new Discord.MessageCollector(channel, (m) => m.content.length < size && m.author.id === author.id, {
      time: 30000,
      max: 1
    });
    collector.on("end", (collected) => {
      if (collected.size === 0) {
        resolve(null);
      } else {
        resolve(collected.first());
      }
    });
  });
}

function yesOrNo(channel, author) {
  return new Promise(async (resolve) => {
    let collector = new Discord.MessageCollector(channel, (m) => (m.content.toLowerCase() === "yes" || m.content.toLowerCase() === "no") && m.author.id === author.id, {
      time: 30000,
      max: 1
    });
    collector.on("end", (collected) => {
      if (collected.size === 0) {
        resolve(null);
      } else {
        resolve(collected.first().content === "yes");
      }
    });
  });
}

async function collectAspects(channel, author) {
  return new Promise(async (resolve) => {
    allocate(channel, author, {
      agile: null,
      careful: null,
      smart: null,
      stylish: null,
      power: null,
      sneaky: null,
      free: ["3", "2", "2", "1", "1", "0"]
    }, resolve);
  });
}

async function allocate(channel, author, cache, call) {
  channel.send(
    "1. Allocate\n"+
    "2. Deallocate\n"+
    "3. Done"
  )
  let collector = new Discord.MessageCollector(channel, (m) => (m.content === "1" || m.content === "2" || m.content === "3") && m.author.id === author.id, {
    time: 30000,
    max: 1
  });
  collector.on("end", (collected) => {
    if (collected.size === 0) {
      call(null);
    } else {
      switch(collected.first().content) {
        case "1":
          selector(channel, author, cache, 0, call);
          break;
        case "2":
          selector(channel, author, cache, 1, call);
          break;
        case "3": 
          if (cache.agile === null) call(null);
          if (cache.careful === null) call(null);
          if (cache.smart === null) call(null);
          if (cache.stylish === null) call(null);
          if (cache.power === null) call(null);
          if (cache.sneaky === null) call(null);
          call(cache);
          break;
      }
    }
  });
} 

function selector(channel, author, cache, mode, call) {
  channel.send(
    "1. Agility\n"+
    "2. Careful\n"+
    "3. Smart\n"+
    "4. Stylish\n"+
    "5. Power\n"+
    "6. Sneaky\n"+
    "7. Done"
  );
  let collector = new Discord.MessageCollector(channel, (m) => (m.content === "1" || m.content === "2" || m.content === "3" || m.content === "4" || m.content === "5" || m.content === "6" || m.content === "7") && m.author.id === author.id, {
    time: 30000,
    max: 1
  });
  collector.on("end", (collected) => {
    if (collected.size === 0) {
      call(null);
    } else {
      switch(collected.first().content) {
        case "1":
          if (mode === 0) {
            allocator(channel, author, "agile", cache, call);
          } else {
            deallocator(channel, author, "agile", cache, call);
          }
          break;
        case "2":
          if (mode === 0) {
            allocator(channel, author, "careful", cache, call);
          } else {
            deallocator(chanel, author, "careful", cache, call);
          }
          break;
        case "3":
          if (mode === 0) {
            allocator(channel, author, "smart", cache, call);
          } else {
            deallocator(channel, author, "smart", cache, call);
          }
          break;
        case "4":
          if (mode === 0) {
            allocator(channel, author, "stylish", cache, call);
          } else {
            deallocator(channel, author, "stylish", cache, call);
          }
          break;
        case "5":
          if (mode === 0) {
            allocator(channel, author, "power", cache, call);
          } else {
            deallocator(channel, author, "power", cache, call);
          }
          break;
        case "6":
          if (mode === 0) {
            allocator(channel, author, "sneaky", cache, call);
          } else {
            deallocator(channel, author, "sneaky", cache, call);
          }
          break;
        case "7":
          allocate(channel, author, cache, call);
          break;
      }
    }
  });
}

function allocator(channel, author, stat, cache, call) {
  channel.send(
    "1. 0 ("+count("0", cache)+")\n"+
    "2. 1 ("+count("1", cache)+")\n"+
    "3. 2 ("+count("2", cache)+")\n"+
    "4. 3 ("+count("3", cache)+")\n"
  );
  let collector = new Discord.MessageCollector(channel, (m) => (m.content === "1" || m.content === "2" || m.content === "3" || m.content === "4") && m.author.id === author.id, {
    time: 30000,
    max: 1
  });
  collector.on("end", (collected) => {
    if (collected.size === 0) {
      call(null);
    } else {
      switch(collected.first().content) {
        case "1":
          if (!cache.free.includes("0")) {
            channel.send("Aspect value aren't free");
          } else {
            cache[stat] = 0;
          }
          selector(channel, author, cache, 0, call);
          break;
        case "2":
          if (!cache.free.includes("1")) {
            channel.send("Aspect value aren't free");
          } else {
            cache[stat] = 1;
          }
          selector(channel, author, cache, 0, call);
          break;
        case "3":
          if (!cache.free.includes("2")) {
            channel.send("Aspect aren't free");
          } else {
            cache[stat] = 2;
          }
          selector(channel, author, cache, 0, call);
          break;
        case "4":
          if (!cache.free.includes("3")) {
            channel.send("Aspect aren't free");
          } else {
            cache[stat] = 3;
          }
          selector(channel, author, cache, 0, call);
          break;
      }
    }
  });
}

function deallocator(channel, author, stat, cache, call) {
  let value = cache[stat];
  switch(value) {
    case 0:
      cache.free.push("0");
      cache[stat] = null;
      channel.send("Aspect value cleared");
      selector(channel, author, cache, 1, call);
      break;
    case 1:
      cache.free.push("1");
      cache[stat] = null;
      channel.send("Aspect value cleared");
      selector(channel, author, cache, 1, call);
      break;
    case 2:
      cache.free.push("2");
      cache[stat] = null;
      channel.send("Aspect value cleared");
      selector(channel, author, cache, 1, call);
      break;
    case 3:
      cache.free.push("3");
      cache[stat] = null;
      channel.send("Aspect value cleared");
      selector(channel, author, cache, 1, call);
      break;
    case null:
      channel.send("Aspect value aren't allocated");
      selector(channel, author, cache, 1, call);
  }
}

function count(num, cache) {
  var result = 0;
  for(let i = 0;i < cache.free.length;i++) {
    if (cache.free[i] === num) result++;
  }
  return result;
}

module.exports = {
  collectString: collectString,
  collectBool: yesOrNo,
  collectAspects: collectAspects
};