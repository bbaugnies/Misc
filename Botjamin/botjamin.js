const login = require("facebook-chat-api");
var fs = require("fs");
var exec = require('child_process').exec, child;

var regex = /^\/[rR](oll)? ?(\d+)d(\d+) ?([as]|[ou]\d+)?/

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

var prefix = '/home/ubuntu/git/Warhammer-8th-Simulator/'

units = {
    "Doomfire Warlocks": prefix + "Dark_Elves/Doomfire_Warlocks.whs",
    "Dark Riders": prefix + "Dark_Elves/Dark_Riders.whs",
    "Dark Riders-shield": prefix + "Dark_Elves/Dark_Riders-shield.whs",
    "Cold One Knights": prefix + "Dark_Elves/Cold_One_Knights.whs",
    "Dreadspears": prefix + "Dark_Elves/Dreadspears.whs",
    "Bleakswords": prefix + "Dark_Elves/Bleakswords.whs",
    "Executioners": prefix + "Dark_Elves/Executioners.whs",
    "Sisters of Slaughter": prefix + "Dark_Elves/Sisters_of_Slaughter.whs",
    "Corsairs": prefix + "Dark_Elves/Corsairs.whs",
    "Black Guard": prefix + "Dark_Elves/Black_Guard.whs",
    "Witch Elves": prefix + "Dark_Elves/Witch_Elves.whs",
    "Cold One Knights-charge": prefix + "Dark_Elves/Cold_One_Knights-charge.whs",
    "Dark Riders-shield-charge": prefix + "Dark_Elves/Dark_Riders-shield-charge.whs",
    "Dark Riders-charge": prefix + "Dark_Elves/Dark_Riders-charge.whs",
    
    "Flesh Hounds": prefix + "Daemons_of_Chaos//Flesh_Hounds.whs",
    "Bloodcrushers": prefix + "Daemons_of_Chaos//Bloodcrushers.whs",
    "Bloodcrushers-charge": prefix + "Daemons_of_Chaos//Bloodcrushers-charge.whs",
    "Beast of Nurgle": prefix + "Daemons_of_Chaos//Beast_of_Nurgle.whs",
    "Bloodletters-charge": prefix + "Daemons_of_Chaos//Bloodletters-charge.whs",
    "Bloodletters": prefix + "Daemons_of_Chaos//Bloodletters.whs",
    "Plague Drone-proboscis": prefix + "Daemons_of_Chaos//Plague_Drone-proboscis.whs",
    "Pink Horrors": prefix + "Daemons_of_Chaos//Pink_Horrors.whs",
    "Flesh Hounds-charge": prefix + "Daemons_of_Chaos//Flesh_Hounds-charge.whs",
    "Plaguebearers": prefix + "Daemons_of_Chaos//Plaguebearers.whs",
    "Daemonettes": prefix + "Daemons_of_Chaos//Daemonettes.whs",
    "Plague Drone": prefix + "Daemons_of_Chaos//Plague_Drone.whs",

    "Hammerers":        prefix + "Dwarves/Hammerers.whs",
    "Iron Breakers":    prefix + "Dwarves/Iron_Breakers.whs",
    "Longbeards-gw":    prefix + "Dwarves/Longbeards-gw.whs",
    
    "Phoenix Guard":    prefix + "High_Elves/Phoenix_Guard.whs",
    "Swordmasters":     prefix + "High_Elves/Swordmaster.whs",
    "White Lions":      prefix + "Whites_Lions.whs",
    
    "Crypt Horrors":    prefix + 'Vampire_Counts/Crypt_Horrors.whs',
    "Skelettons-shield":prefix + "Vampire_Counts/Skelettons-shield.whs",
    "Skelettons-spear": prefix + "Vampire_Counts/Skelettons-speard.whs"    
}


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
	                m = message.body.match(regex)
	                if (m != null) {
		                n_dice = parseInt(m[2], 10)
		                s_dice = parseInt(m[3], 10)
                        if (n_dice > 100 || s_dice > 1000){
                            api.sendMessage("Bad Human!", message.threadID);
                        }
                        else {
                            res = []
                            if (top[ids[message.senderID]] != null && override && m[2] == top[ids[message.senderID]][1] && m[3] == top[ids[message.senderID]][2]) {
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
                            r = "[" + res.join(", ") + "]"
                            if (m[4]) {
                                r+= "\n\n" + process(res, m[4])
                            }
                            api.sendMessage(r, message.threadID);
                        }
	                }
	                else if (message.body.match(/^[gG]ood bot/)) {
		                api.sendMessage("Thank you, human "+ message.senderID, message.threadID);
	                }
	                else if (message.body.match(/\/niquetamere/)) {
		                api.sendMessage("Ma maman est un taille crayon electrique", message.threadID);
	                }
	                else if (message.body.match(/[hH]ello,? [bB]ot/)) {
		                api.sendMessage("Hello, human " + message.senderID, message.threadID);
	                }
	                else if (message.body.match(/[tT]hank( you|s),? [bB]ot/)) {
		                api.sendMessage("You are welcome, human " + message.senderID, message.threadID);
	                }
	                else if (message.body.match(/[yY]ou there,? [bB]ot\?/)) {
		                api.sendMessage("Yes, human", message.threadID);
	                }
	                else if (message.body.match(/🚀/)) {
		                api.sendMessage('🚀', message.threadID);
	                }
	                else if (message.body.match(/💩/)) {
		                api.sendMessage('💩', message.threadID);
	                }
                    else if (message.body.match(/[Pp]etite?/)) {
                        api.sendMessage('CTB', message.threadID);
                    }                    
                    else if (message.body.match(/\/stats/)) {
                        m = message.body.match(/\/stats ([a-z]*)/)
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
                        if (message.threadID == ben) {
                            r += stats[s]["detail"].join(', ')
                        }
                        api.sendMessage(r, message.threadID);
                    }

                    else if (message.body.match(/\/help/)) {
                        r =  "/help - this message\n"
                        r += "/r[x]d[y] - roll [x] dice of size [y]\n"
                        r += "      options:\n"
                        r += "              a - average\n"
                        r += "              s - sum\n"
                        r += "              o[n] - counts the dice that rolled over [n]\n"
                        r += "              u[n] - counts the dice that rolled under [n]\n"
                        r += "/stats - personal stats for d6 since last reboot"
                        r += "/listunits - name of units available for sim\n"
                        r += "/sim [unit1] size1 rank1 [unit2] size2 rank2\n"
                        r += "      - run a simulation
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
	                
	                else if (message.body.match(/^\/[Ss]im/)) {
	                    m = message.body.match(/^\/[Ss]im \[(.*)\] (\d+) (\d+) \[(.*)\] (\d+) (\d+)/)
	                    if(m) {
	                        if (m[1] in units && m[4] in units && m[3] < 11 && m[6] < 11 && m[2] < 51 && m[5] < 51) {
	                            res_text = ''
	                            command = 'python ' + prefix + 'sim.py --unit1 ' + units[m[1]] + ' --unit2 ' + units[m[4]] + ' --s1 ' + m[2] + ' --r1 ' + m[3]+' --s2 '+m[5]+' --r2 '+m[6]+' --iter 100'
	                            exec(command, function (error, stdout, stderr) {
	                                res_text = stdout
	                                api.sendMessage({body: res_text, attachment: fs.createReadStream("./foo.png")}, message.threadID);
                                    }

	                            });
	                        }
	                        else {
	                            api.sendMessage("Unit not found", message.threadID);
	                        }
	                    }	 
	                                       
	                }
	                else if (message.body.match(/^\/[lL]ist[uU]nits/)) {
	                    d = Object.keys(units).sort()
	                    r = ''
	                    for (i in d) { r += d[i] + "\n" }
	                    api.sendMessage(r, message.threadID);
	                }
	                
	                else if (message.body.match(/[gG]o to sleep Botjamin/) && message.senderID == ben) {
		                api.sendMessage("OK! Good night!", message.threadID);
		                setTimeout(function(){
                            process.exit();
                        }, 2000);
	                }
                } // end else (not err)
            }); //en api. listen
        } // end try
        
        catch(e) {
        
        }
    }); // end login
}

runBot("Hello, humans!");
