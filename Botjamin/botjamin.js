const login = require("facebook-chat-api");
var fs = require("fs");
var regex = /^\/[rR](oll)?(\d+)d(\d+)/

var pwd = fs.readFileSync("./pwd.txt", "utf8")
pwd = pwd.substring(0, pwd.length - 1)

var ben = '740895416'
var corentin = '1440180349'
var seraphin = '739582489'
var gauthier = '1094374602'

var warhammer = '1600281336648636'
var sw = '456732981199984'

function runBot(msg) {
    login({email: "botgnies@gmail.com", password: pwd}, (err, api) => {
        if(err) { console.log(err); }
        api.sendMessage(msg, ben);
        api.sendMessage(msg, warhammer);
        api.sendMessage(msg, sw);
        
        api.listen((err, message) => {
            if (err) { console.log(err); }
            else {
                console.log(message.senderID)
	            m = message.body.match(regex)
	            if (m != null) {
		            r = ""
		            n_dice = parseInt(m[2], 10)
		            s_dice = parseInt(m[3], 10)

		            for (i = 0; i < n_dice; i++) {
			            r += Math.floor((Math.random() * s_dice) + 1)
			            r += ", "
		            }
		            api.sendMessage(r.substring(0, r.length-2), message.threadID);
	            }
	            else if (message.body.match(/^[gG]ood bot/)) {
		            api.sendMessage("Thank you, human", message.threadID);
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
