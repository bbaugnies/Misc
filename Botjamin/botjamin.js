const login = require("facebook-chat-api");
var fs = require("fs");
//var regex = /^\/[rR](oll)?(\d+)d(\d+)( ?[+-]\d+)?(.*)/
var regex = /^\/[rR](oll)? ?(\d+)d(\d+)/

var debug = false
var override = false

var pwd = fs.readFileSync("./pwd.txt", "utf8")
pwd = pwd.substring(0, pwd.length - 1)


ids = {
    '740895416': "ben",
    '1440180349': "coco",
    '739582489': "finf",
    '1094374602': "gog"
}


var ben = '740895416'
var corentin = '1440180349'
var seraphin = '739582489'
var gauthier = '1094374602'

var warhammer = '1600281336648636'
var sw = '456732981199984'

top = {
    coco: null,
    finf: null,
    ben: null,
    gog: null
}


function runBot(msg) {
    login({email: "botgnies@gmail.com", password: pwd}, (err, api) => {
        if(err) {
            api.sendMessage("So... Cold...", ben);
            console.log(err);            
        }
        api.sendMessage(msg, ben);
        if (!debug){
            api.sendMessage(msg, warhammer);
            api.sendMessage(msg, sw);
        }
        
        api.listen((err, message) => {
            if (err) {
		    api.sendMessage("So... Cold...", ben);
		    setTimeout(function(){
                        process.exit();
                    }, 2000);
	    }
            else {
	            m = message.body.match(regex)
	            if (m != null) {
		            r = ""
		            n_dice = parseInt(m[2], 10)
		            s_dice = parseInt(m[3], 10)
                    if (n_dice > 100 || s_dice > 1000){
                        api.sendMessage("Bad Human!", message.threadID);
                    }
                    else {
                        if (top[ids[message.senderID]] != null && override && m[2] == top[ids[message.senderID]][1] && m[3] == top[ids[message.senderID]][2]) {
                            api.sendMessage(top[ids[message.senderID]][0], message.threadID);
                            top[ids[message.senderID]] = top[ids[message.senderID]][3]
                        }
                        else {
                            for (i = 0; i < n_dice; i++) {
		                    r += Math.floor((Math.random() * s_dice) + 1)
		                    r += ", "
     	                    }
	                        api.sendMessage(r.substring(0, r.length-2), message.threadID);
                        }
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
                        gog: null
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
	            
	            else if (message.body.match(/[gG]o to sleep Botjamin/) && message.senderID == ben) {
		            api.sendMessage("OK! Good night!", message.threadID);
		            setTimeout(function(){
                        process.exit();
                    }, 2000);
	            }
            }
        });
    });
}

runBot("Hello, humans!");
