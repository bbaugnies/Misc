const login = require("facebook-chat-api");
const fs = require("fs");
const path = require("path");
const os = require("os");
const unirest = require("unirest");
const request = require("request");

var exec = require('child_process').exec, child;

var regex = /([\s\S]*?)\/[rR](oll)? ?(\d+)[dD](\d+) ?([as]|[ou]\d+)?/g

var debug = true 
var override = false

var pwd = fs.readFileSync("./pwd.txt", "utf8")
pwd = pwd.substring(0, pwd.length - 1)


var ben = '740895416'
var corentin = '1440180349'
var seraphin = '739582489'
var gauthier = '1094374602'
var thomas = '1215263738'

ids = {
    '740895416': "ben",
    '1440180349': "coco",
    '739582489': "finf",
    '1094374602': "gog",
    '1215263738': "thomas"
}



var warhammer = '1600281336648636'
var sw = '456732981199984'
stats = {
    coco:   {
                "rolls d6": 0,
                "avg d6": 0,
                "total d6": 0,
                "detail": [0, 0, 0, 0, 0, 0]
            },
    finf:   { 
                "rolls d6": 0,
                "avg d6": 0,
                "total d6": 0,
                "detail": [0, 0, 0, 0, 0, 0]
            },
    ben:    {
                "rolls d6": 0,
                "avg d6": 0,
                "total d6": 0,
                "detail": [0, 0, 0, 0, 0, 0]
            },
    gog:    {
                "rolls d6": 0,
                "avg d6": 0,
                "total d6": 0,
                "detail": [0, 0, 0, 0, 0, 0]
            },
    thomas: {
                "rolls d6": 0,
                "avg d6": 0,
                "total d6": 0,
                "detail": [0, 0, 0, 0, 0, 0]
            }
}


top = {
    coco: null,
    finf: null,
    ben: null,
    gog: null,
    thomas: null
}


//get all the unit files
var prefix = path.join(os.homedir(), 'git/Warhammer-8th-Simulator/')
var units = {}

function updateUnits() {
    dirs = fs.readdirSync(prefix)
        .map(file => path.join(prefix, file))
        .filter(path => fs.statSync(path).isDirectory())
        .filter(path => ! path.match(/\/\./))
        
    for (d in dirs) {
        unitlist = fs.readdirSync(dirs[d])
        for (u in unitlist) {
            units[unitlist[u].replace(".whs", "").replace(/_/g, " ")] = path.join(dirs[d], unitlist[u])
        }
    }
}

var download = function(uri, filename, callback){
  request.head(uri, function(err, res, body){
    request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
  });
};


function update_stats(n, values, sender) {
    stats[sender]["rolls d6"] += n
    for (i = 0; i < values.length; i ++) {
        stats[sender]["total d6"] += values[i]
        stats[sender]["detail"][values[i]-1] += 1
    }
    stats[sender]["avg d6"] = stats[sender]["total d6"]/stats[sender]["rolls d6"]
}

function process(values, mod) {
    switch(mod[0]){
        case "a":
            t = 0
            for (i = 0; i < values.length; i++) {
                t += values[i]
            }
            return "avg: " + t/values.length
        case "s":
            t = 0
            for (i = 0; i < values.length; i++) {
                t += values[i]
            }
            return "sum: " + t
        case "o":
            t = parseInt(mod.substring(1, mod.length))
            c = 0
            for (i = 0; i < values.length; i++) {
                if(values[i] >= t) c++
            }
            return "over " + t + ": " + c
        case "u":
            t = parseInt(mod.substring(1, mod.length))
            c = 0
            for (i = 0; i < values.length; i++) {
                if(values[i] <= t) c++
            }
            return "under " + t + ": " + c
    }
}

function runBot(msg) {
    login({email: "botgnies@gmail.com", password: pwd}, (err, api) => {
        if(err) {
            console.log(err);            
        }
        api.sendMessage(msg, ben);
        if (!debug){
            api.sendMessage(msg, warhammer);
            api.sendMessage(msg, sw);
        }
        try {
            api.listen((err, message) => {
                if (err) {
                        void(0);
	        }
                else {
                    if (message.body.match(regex)) {
                        r = ""
	                    while (m = regex.exec(message.body)){
	                        r += m[1]
		                    n_dice = parseInt(m[3], 10)
		                    s_dice = parseInt(m[4], 10)
                            if (n_dice > 100 || s_dice > 1000){
                                r += "Bad Human!\n"
                            }
                            else {
                                res = []
                                if (top[ids[message.senderID]] != null && override && m[3] == top[ids[message.senderID]][1] && m[4] == top[ids[message.senderID]][2]) {
                                    l = top[ids[message.senderID]][0].split(",")
                                    for (i = 0; i < l.length; i++) {
                                        l[i] = parseInt(l[i])
                                    }
                                    top[ids[message.senderID]] = top[ids[message.senderID]][3]
                                    res = l
                                }
                                else {
                                    for (i = 0; i < n_dice; i++) {
	                                    res.push(Math.floor((Math.random() * s_dice) + 1))
             	                    }
	                                
                                }
                                if (s_dice == 6) {
                                    update_stats(n_dice, res, ids[message.senderID])
                                }
                                r += "[" + res.join(", ") + "]"
                                if (m[5]) {
                                    r+= "\n\n" + process(res, m[5])
                                }                                
                            }                            
	                    }
	                    api.sendMessage(r, message.threadID);
	                }
	                else if (message.body.match(/^good bot/i)) {
		                api.sendMessage("Thank you, human "+ message.senderID, message.threadID);
	                }
	                else if (message.body.match(/\/niquetamere/i)) {
		                api.sendMessage("Ma maman est un taille crayon electrique", message.threadID);
	                }
	                else if (message.body.match(/hello,? bot/i)) {
		                api.sendMessage("Hello, human " + message.senderID, message.threadID);
	                }
	                else if (message.body.match(/thank( you|s),? bot/i)) {
		                api.sendMessage("You are welcome, human " + message.senderID, message.threadID);
	                }
	                else if (message.body.match(/you there,? bot\?/i)) {
		                api.sendMessage("Yes, human", message.threadID);
	                }
	                else if (message.body.match(/🚀/)) {
		                api.sendMessage('🚀', message.threadID);
	                }
	                else if (message.body.match(/💩/)) {
		                api.sendMessage('💩', message.threadID);
	                }
                    else if (message.body.match(/petite?/i)) {
                        api.sendMessage('CTB', message.threadID);
                    }
		    else if (message.body.match(/[0-3]?\d[\/ ](jan|f.v|mar|avr|mai|jui|ao.t|sep|oct|nob|d.c|\d[1-2])/i)) {
	   	    	api.sendMessage(message.body, ben)
		    }                    
                    else if (message.body.match(/\/stats/i)) {
                        m = message.body.match(/\/stats ([a-z]*)/i)
                        r = ""
                        s = null
                        if (m && m[1] in stats) {
                                s = m[1]
                        }
                        else {
                                s = ids[message.senderID]
                        }
                        r += "d6 rolls requested: " + stats[s]["rolls d6"] + "\n"
                        r += "Avg roll on d6: " + stats[s]["avg d6"] + "\n"
                        r += stats[s]["detail"].join(', ')
                        api.sendMessage(r, message.threadID);
                    }
                    else if (message.body.match(/\/resetstats/i)) {
                        stats[ids[message.senderID]] = {
                                                            "rolls d6": 0,
                                                            "avg d6": 0,
                                                            "total d6": 0,
                                                            "detail": [0, 0, 0, 0, 0, 0]
                                                        }
                    }

                    else if (message.body.match(/\/help/i)) {
                        r =  "/help - this message\n"
                        r += "/r[x]d[y] - roll [x] dice of size [y]\n"
                        r += "      options:\n"
                        r += "              a - average\n"
                        r += "              s - sum\n"
                        r += "              o[n] - counts the dice that rolled over [n]\n"
                        r += "              u[n] - counts the dice that rolled under [n]\n"
                        r += "/stats - personal stats for d6 since last reboot\n"
                        r += "/listunits - name of units available for sim\n"
                        r += "/sim [unit1] size1 rank1 [unit2] size2 rank2\n"
                        r += "      - run a simulation"
                        api.sendMessage(r, message.threadID);
                    }
	                
	                else if (message.body.match(/^\/getTop/) && message.threadID == ben) {
	                    api.sendMessage(override.toString(), ben);
	                    r = ""
	                    for (var p in top) {
	                        r += p
	                        if (top[p] != null) {
	                            r += top[p].toString()
                            }
                            r += "\n"
                        }
	                    api.sendMessage(r, ben);
	                }
	                else if (message.body.match(/^\/toggleOverride/) && message.threadID == ben) {
	                    override = !override
	                    api.sendMessage(override.toString(), ben);
	                }
	                else if (message.body.match(/^\/resetTop/) && message.threadID == ben) {
	                    top = {
                            coco: null,
                            finf: null,
                            ben: null,
                            gog: null,
                            thomas: null
                        }
	                }
	                else if (message.body.match(/^\/next .+/) && message.senderID == ben && message.threadID == ben){
	                    m = message.body.match(/^\/next ([a-z]+) ;([\d, ]+); (\d+) (\d+)/)
	                    if(m != null && m[1] in top) {
	                        if(top[m[1]] == null) {
	                            top[m[1]] = [m[2], m[3], m[4], null]
	                        }
	                        else {
	                            top[m[1]] = [m[2], m[3], m[4], top[m[1]]]
	                        }
                            api.sendMessage('Yes Sir !', message.threadID);	
	                    }                
	                }
	                
	                else if (message.body.match(/^\/sim/i)) {
	                    m = message.body.match(/^\/sim \[(.*)\] (\d+) (\d+) \[(.*)\] (\d+) (\d+)/i)
	                    if(m) {
	                        if (m[1] in units && m[4] in units && m[3] < 11 && m[6] < 11 && m[2] < 101 && m[5] < 101) {
	                            res_text = ''
	                            command = 'python ' + prefix + 'sim.py --unit1 ' + units[m[1]] + ' --unit2 ' + units[m[4]] + ' --s1 ' + m[2] + ' --r1 ' + m[3]+' --s2 '+m[5]+' --r2 '+m[6]
	                            command += ' --iter 100 -c'
	                            exec(command, function (error, stdout, stderr) {
	                                res_text = stdout
                                    //console.log(stdout)
                                    //console.log(stderr)
                                    //if (error) { console.log(error) }
                                    if (res_text != "") {
	                                    api.sendMessage({body: res_text, attachment: fs.createReadStream("./foo.png")}, message.threadID);
                                    }
                                    else {
	                                    api.sendMessage("Something went wrong", message.threadID);                                    
                                    }   
	                            });
	                        }
	                        else {
	                            api.sendMessage("Unit not found/unit size too large", message.threadID);
	                        }
	                    }	 
	                                       
	                }
	                else if (message.body.match(/^\/listunits/i)) {
	                    updateUnits()
	                    m = message.body.match(/^\/listunits ?(.*)/i)
	                    d = Object.keys(units).sort()
	                    r = ''
	                    for (i in d) {
	                        if (m[1]) {
	                            if (d[i].match(new RegExp(m[1], "i"))) {
	                                r += d[i] + "\n"
                                }
                            }
                            else { r += d[i] + "\n" }
	                    }
	                    api.sendMessage(r, message.threadID);
	                }
	                else if (message.body.match(/^\/getunit/i)) {
	                    m = message.body.match(/^\/getunit (.*)/i)
	                    if (m && m[1] && m[1] in units) {
	                        console.log(units[m[1]])
	                        res = fs.readFileSync(units[m[1]], "utf8")
	                        console.log(res)
	                        api.sendMessage(res, message.threadID);
	                    }
	                }
	                
	                else if (message.body.match(/go to sleep Botjamin/i) && message.senderID == ben) {
		                api.sendMessage("OK! Good night!", message.threadID);
		                setTimeout(function(){
                            process.exit();
                        }, 2000);
	                }
	                
	                else if (message.body.match(/po+u+e+t/i)) {
	                    unirest.get('http://thecatapi.com/api/images/get?type=gif&format=xml')
                        .headers({'Accept': 'application/json', 'Content-Type': 'application/json'})
                        .send()
                        .end(function (response) {
                            img = response.body.match(/<url>(.*)<\/url/)[1]
                            download(img, 'cat.gif', function(){
                                var msg = {
                                    body: "Are you bored human? Here is a cat GIF:",
                                    attachment: fs.createReadStream('cat.gif')
                                };
                                api.sendMessage(msg, message.threadID)
                            });
                        });  
	                }
                } // end else (not err)
            }); //en api. listen
        } // end try
        
        catch(e) {
        
        }
    }); // end login
}
    
command = 'cd ' + prefix + '&& git pull'
exec(command,
    function (error, stdout, stderr) {
        console.log('stdout: ' + stdout);
        console.log('stderr: ' + stderr);
        if (error !== null) {
             console.log('exec error: ' + error);
        }
    });
    
updateUnits()
runBot("Superbowl 03/02/2019! Réservez la date, bougez les annifs!");
