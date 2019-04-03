const colors = require("colors");
const fs   = require("fs");
const path = require("path");
const Signal = require("signals");

module.exports = class Generator {
    constructor() {
        this._dployCompleted = new Signal();
        this._dployCompleted.add(this._completed);
        
        console.log("Installing ".yellow + "DPLOY".bold.yellow + "...".yellow);
        
        this._generateConfig();
    }
    
    _generateConfig() {
        const fileName = "dploy.yaml";
        
        if (!fs.existsSync(fileName)) {
            // If the file does not exist, copy the generator example to user's folder
            fs.createReadStream(path.resolve(__dirname, "../generator/dploy.yaml")).pipe(fs.createWriteStream(fileName));
        }
        
        return this._dployCompleted.dispatch();
    }
    
    _completed() {
        let code;
        console.log("Done!".bold.green + " Your project is ready to ".green + "DEPLOY".green.bold + " :) ".green);
        return process.exit(code=0);
    }
};