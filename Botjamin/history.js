const login = require("facebook-chat-api");
const fs = require("fs");
const path = require("path");
const os = require("os");

var exec = require('child_process').exec, child;

var regex = /([\s\S]*?)\/[rR](oll)? ?(\d+)[dD](\d+) ?([as]|[ou]\d+)?/g

var debug = true
var override = false

var pwd = fs.readFileSync("./pwd.txt", "utf8")
pwd = pwd.substring(0, pwd.length - 1)


var warhammer = '1600281336648636'
var sw = '456732981199984'

timestamp = 1523907387944
count = 2

function loadNextThreadHistory(api, c) {

        api.getThreadHistoryGraphQL(warhammer, 5000, timestamp, (err, history) => {
            console.log(history == undefined);
            if(err)  console.error(err);
            
            if(timestamp != undefined) history.pop();
            
            for (var m in history) {
                if (history[m].type == "event") {
                    c = c - 1
                    console.log(history[m].snippet)
                    console.log(history[m].timestamp)
                }
            }
                
            
        });

}

function runBot(msg) {
    login({email: "botgnies@gmail.com", password: pwd}, (err, api) => {
        if(err) {
            console.log(err);            
        }
        if (!debug){
            api.sendMessage(msg, warhammer);
        }
       
        loadNextThreadHistory(api, count);
        
        
        
    }); // end login
}
    
runBot("Boo!");
