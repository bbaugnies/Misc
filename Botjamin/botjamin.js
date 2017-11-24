const login = require("facebook-chat-api");
var fs = require("fs");
var regex = /^\/[rR](oll)?(\d+)d(\d+)/

var pwd = fs.readFileSync("./pwd.txt", "utf8")
pwd = pwd.substring(0, pwd.length - 1)
 
login({email: "botgnies@gmail.com", password: pwd}, (err, api) => {
    if(err) return console.error(err);

 
    api.listen((err, message) => {
	if (err) { }
	else {
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
		else if (message.body.match(/[gG]o to sleep Botjamin/)) {
			api.sendMessage("OK! Good night!", message.threadID);
			setTimeout(function(){
                process.exit();
            }, 2000);
		}
	}
    });
});
