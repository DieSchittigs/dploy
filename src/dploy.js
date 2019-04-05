const colors = require("colors");
const Deploy = require("./deploy");

module.exports = class DPLOY {
    /*
    DPLOY
    If you set a custom config file for DPLOY
    It will use this config instead of trying to load a dploy.yaml file

    @param  config (optional)  Custom config file of a server to deploy at
    @param  completed (optional) Callback for when the entire proccess is completed
    */
    constructor(config, completed) {
        this.servers = [];
        this.connection = null;
        this.ignoreInclude = false;
        this.catchup = false;
        // DPLOY if there's a custom config
        this.config = config;
        this.completed = completed;
        if (this.config) {
            this.servers = [null];
            this.deploy();
        // Deploy
        } else {
            this.servers = process.argv.splice(2, process.argv.length);
            // Check if we should ignore the include parameter for this deploy
            this.ignoreInclude = (this.servers.indexOf("-i") >= 0) || (this.servers.indexOf("--ignore-include") >= 0);
            // Check if we should catchup with the server and only upload the revision file
            this.catchup = (this.servers.indexOf("-c") >= 0) || (this.servers.indexOf("--catchup") >= 0);
            // Filter the flags from the server names
            this.servers = this._filterFlags(this.servers, ["-i", "--ignore-include", "-c", "--catchup"]);
            // If you don't set any servers, add an empty one to upload the first environment only
            if (this.servers.length === 0) { this.servers.push(null); }
            this.deploy();
        }
    }

    deploy() {
        // Dispose the current connection
        if (this.connection) {
            this.connection.dispose();
            this.connection = null;
        }

        // Keep deploying until all servers are updated
        if (this.servers.length) {
            this.connection = new Deploy(this.config, this.servers[0], this.ignoreInclude, this.catchup);
            this.connection.completed.add(() => this.deploy);
            this.servers.shift();
        // Finish the process
        } else {
            console.log("All Completed :)".green.bold);
            if (this.completed) {
                this.completed.call(this);
            } else {
                let code;
                process.exit(code=0);
            }
        }
    }


    _filterFlags(servers, flags) {
        servers = servers.filter(function(value) {
            let valid = true;
            flags.forEach(function(flag) { if (flag === value) { return valid = false; } });
            return valid;
        });
        return servers;
    }
};