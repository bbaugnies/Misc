const login = require("facebook-chat-api");
var fs = require("fs");
var regex = /^\/[rR](oll)?(\d+)d(\d+)( ?[+-]\d+)?(.*)/

var debug = false

var pwd = fs.readFileSync("./pwd.txt", "utf8")
pwd = pwd.substring(0, pwd.length - 1)

var ben = '740895416'
var corentin = '1440180349'
var seraphin = '739582489'
var gauthier = '1094374602'

var warhammer = '1600281336648636'
var sw = '456732981199984'

function processRes(res, g_mod, opt) {
    values = "[" + res.toString().replace(/,/g, ", ")+"]"
    options = opt.match(/-([a-zA-Z]*) ?([^ -]*)?/g)
    post = "\n\n"
    if (debug) console.log(g_mod);
    if (debug) console.log(options);
    for (i = 0; i<options.length; i++) {
        m = options[i].match(/-([a-zA-Z]*) ?([^ -]*)?/)
        if (debug) console.log(m);
        switch(m[1]) {
            case "sum":
                sum = res.reduce((t, n) => {return t+n})
                if (g_mod) {
                    if (g_mod[g_mod.length-2] == '+') sum += parseInt(g_mod[g_mod.length-1]);
                    else if (g_mod[g_mod.length-2] == '-') sum -= parseInt(g_mod[g_mod.length-1]);
                }
                post += "Sum: " + sum + "\n"
                break;
            case "avg":
                avg = res.reduce((t, n) => {return t+n})/res.length
                post += "Average: " + avg + "\n"
                break;
            case "over":
                if (m[2].match(/^\d+$/)) {
                    count_over = 0
                    for (i = 0; i < res.length; i++) {
                        if (res[i] > parseInt(m[2])) count_over ++;
                    }
                    post += "Rolls over " + m[2] +": " + count_over + "\n";
                }
                else { post += "You messed up, human\n"; }
                break;
            case "under":
                if (m[2].match(/^\d+$/)) {
                    count_over = 0
                    for (i = 0; i < res.length; i++) {
                        if (res[i] < parseInt(m[2])) count_over ++;
                    }
                    post += "Rolls over " + m[2] +": " + count_over + "\n";
                }
                else  { post += "You messed up, human\n"; }
                break;
            default:
                post += "You messed up, human\n";
        }
    }
    if (debug) console.log(values + post);
    return (values + post)
}

function runBot(msg) {
    login({email: "botgnies@gmail.com", password: pwd}, (err, api) => {
        if(err) { console.log(err); }
        api.sendMessage(msg, ben);
        if (!debug){
            api.sendMessage(msg, warhammer);
            api.sendMessage(msg, sw);
        }
        
        api.listen((err, message) => {
            console.log(message.senderID)
            if (err) { console.log(err); }
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
                        res = []
		                for (i = 0; i < n_dice; i++) {
			                res.push(Math.floor((Math.random() * s_dice) + 1))
		                }
		                r = processRes(res,m[4], m[5]);
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
