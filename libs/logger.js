var streamModule = require('stream');

var allLoggers = new Map();

function getLogger(name, stream) {
    let streams = [];
    
    if (stream && (stream instanceof streamModule.Writable || stream instanceof streamModule.Duplex || stream instanceof streamModule.Transform)) {
        streams.push(stream);
    } else if (stream && typeof stream === "object" && Array.isArray(stream)) {
        if (stream[0] && (stream[0] instanceof streamModule.Writable || stream[0] instanceof streamModule.Duplex || stream[0] instanceof streamModule.Transform)) {
            streams = stream;
        } else throw new Error("Invalid array of streams");
    } else {
        streams.push(process.stdout);
    } 
    
    if (!name || name === "" || typeof name !== "string") throw new Error("Invalid name for logger");
    if (!allLoggers.get(name)) {
        let logger = new Logger(name);
        streams.forEach((streamFE) => {
            logger.addStream(streamFE);
        });
        allLoggers.set(name, logger);
        return logger;
    } else {
        return allLoggers.get(name);
    }
}

function clearLoggers() {
    allLoggers.clear();
}

function removeLogger(name) {
    if (!name || name === "" || typeof name !== "string") throw new Error("Invalid name to logger");
    if (!allLoggers.has(name)) throw new Error("Invalid logger, don't have a logger with this name");
    allLoggers.delete(name);
}

function hasLogger(name) {
    if (!name || name === "" || typeof name !== "string") throw new Error("Invalid name to logger");
    return allLoggers.has(name);
}
    
function toString(object) {
    if (object instanceof Error) {
        return object.name + " - " + object.message;
    } else if (typeof object === "object") {
        return object.toString();
    } else if (typeof object === "string") {
        return object;
    } else {
        return JSON.stringify(object);
    }
}

class Logger {
    constructor(name) {
        if (!name || name === "" || typeof name !== "string") throw new Error("Invalid name for logger");
        
        this._name = name;
        this._streams = [];
    }
    
    info(message) {
        this.send(this.format("INFO", new Date(), toString(message)));
    }
    
    warn(message) {
        this.send(this.format("WARN", new Date(), toString(message)));
    }
    
    error(message) {
        this.send(this.format("ERROR", new Date(), toString(message)));
    }
    
    send(message) {
        this._streams.forEach((stream) => {
            stream.write(message);
        });
    }
    
    addStream(stream) {
        if (stream && (stream instanceof streamModule.Writable || stream instanceof streamModule.Duplex || stream instanceof streamModule.Transform)) {
            if (this._streams.includes(stream)) throw new Error("Already has the stream in the logger");
            this._streams.push(stream);
        } else throw new Error("Invalid stream to add");
    }
    
    removeStream(stream) {
        if (stream && (stream instanceof streamModule.Writable || stream instanceof streamModule.Duplex || stream instanceof streamModule.Transform)) {
            if (!this._streams.includes(stream)) throw new Error("Don't has the stream in the logger");
            let index = this._streams.indexOf(stream);
            this._streams.splice(index, 1);
        } else throw new Error("Invalid stream to remove");
    }
    
    clearStreams() {
        this._streams = [];
    }
    
    setStreams(streams) {
        if (streams && typeof streams === "object" && Array.isArray(streams)) {
            if (streams[0] && (streams[0] instanceof streamModule.Writable || streams[0] instanceof streamModule.Duplex || streams[0] instanceof streamModule.Transform)) {
                this._streams = streams;
            } else throw new Error("Invalid array of streams");
        } else throw new Error("Invalid arrar of streams");
    }

    format(level, time, message) {
        return "["+time.getHours()+":"+time.getMinutes().toLocaleString('pt-BR', { minimumIntegerDigits: 2, useGrouping:false })+":"+time.getSeconds().toLocaleString('pt-BR', { minimumIntegerDigits: 2, useGrouping:false })+"] ["+this._name+"/"+level+"]: "+message+"\n";
    }
}

module.exports = {
    util: {
        toString: toString
    },
    Logger: Logger,
    getLogger: getLogger,
    hasLogger: hasLogger,
    removeLogger: removeLogger,
    clearLoggers: clearLoggers
}