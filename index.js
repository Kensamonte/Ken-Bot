const fs = require("fs");
const http = require('https');
const login = require("fca-unofficial");
const axios = require("axios");
const cron = require('node-cron');
const YoutubeMusicAPI = require('youtube-music-api');



let vips = ['100002428934209'];
let gcs =['5120904847995697', '24532681893043609']
let msgs = {};
let command = {};
let status = {
    body:""
};
let prefix = "!";
let admin_prefix = "~";
let vips_reaction = "😘";
let user_reaction = "😆";
let off = "🔴";
let on = "🟢";
let reaction = off;
let wiki = on;
let stat = 'normal';
login({ appState: JSON.parse(process.env['STATE']) }, (err, api) => {
    if (err) return console.error(err);
    api.setOptions({ listenEvents: true, selfListen: true});
    cron.schedule('30 7 * * MON-FRI', ()=>{
        api.sendMessage("Goodmorning have a nice day.\n\n-KenBot", '24532681893043609')
    },{
        scheduled: true,
        timezone: "Asia/Manila"
    })
    cron.schedule('0 2 * * *', ()=>{
        api.sendMessage("9:30 na mga bobo tulog na.\n\n-KenBot", '24532681893043609')
    },{
        scheduled: true,
        timezone: "Asia/Manila"
    })
    //api.sendMessage(`Bot is now online.\n\nPrefix: ${prefix}\nType ${prefix}help to get list of avilable commands`, '24532681893043609');
    //api.sendMessage(`Bot is now online.\n\nPrefix: ${prefix}\nType ${prefix}help to get list of avilable commands`, '5120904847995697');
    let bot_id = api.getCurrentUserID();
    console.log("Bot is now online...")

    var listenEmitter = api.listen((err, event) => {
        if (err) return console.error(err);
        switch (event.type) {
            case "message_reply":
                if (reaction == on){
                    if (vips.includes(event.senderID)) {
                        api.setMessageReaction(vips_reaction, event.messageID, (err) => {
                        }, true);
                    }
                    else {
                        api.setMessageReaction(reaction, event.messageID, (err) => {
                        }, true);
                    } 
                } else {/*NO RESPONSE*/}
                let msgid = event.messageID
                msgs[msgid] = event.body;
                break;
            case "message":
                if (reaction == on){
                    if (vips.includes(event.senderID)) {
                        api.setMessageReaction(vips_reaction, event.messageID, (err) => {
                        }, true);
                    }
                    else {
                        api.setMessageReaction(reaction, event.messageID, (err) => {
                        }, true);
                    }   
                } else {/*NO RESPONSE*/}
                if (event.attachments.length != 0) {
                    if (event.attachments[0].type == "photo") {
                        msgs[event.messageID] = ['img', event.attachments[0].url]
                    }
                    else if (event.attachments[0].type == "video") {
                        msgs[event.messageID] = ['vid', event.attachments[0].url]
                    }
                    else if (event.attachments[0].type == "audio") {
                        msgs[event.messageID] = ['vm', event.attachments[0].url]
                    }
                    else if (event.attachments[0].type == "animated_image") {
                        msgs[event.messageID] = ['gif', event.attachments[0].url]
                    }
                    else if (event.attachments[0].type == "sticker") {
                        msgs[event.messageID] = ['sticker', event.attachments[0].url]
                    }
                    else if (event.attachments[0].type == "file") {
                        msgs[event.messageID] = ['file', event.attachments[0].url]
                    }

                } else {
                    msgs[event.messageID] = event.body
                }
                if (event.body != null){
                    let input = event.body;
                    if (input.startsWith(admin_prefix)){
                        if (vips.includes(event.senderID)){
                            if (input.toLowerCase().startsWith(admin_prefix + "off-reaction")){
                                if (reaction == off){
                                    api.sendMessage("Message Reactions are already disabled", event.threadID, event.messageID);
                                } else {
                                    reaction = off
                                    api.sendMessage("Message Reactions have been disabled successfully", event.threadID, event.messageID);
                                }
                            }
                            else if (input.toLowerCase().startsWith(admin_prefix + "on-reaction")){
                                if (reaction == on){
                                    api.sendMessage("Message Reactions are already enabled", event.threadID, event.messageID);
                                } else {
                                    reaction = on
                                    api.sendMessage("Message Reactions have been enabled successfully", event.threadID, event.messageID);
                                }
                            } 
                            else if (input.toLowerCase().startsWith(admin_prefix + "setmode-busy")){
                                if (stat == 'away'){
                                    api.sendMessage("Busy mode is already enabled", event.threadID, event.messageID);
                                } else {
                                    stat = 'away'
                                    api.sendMessage("Busy mode is now enabled", event.threadID, event.messageID);
                                }
                            }
                        else if (input.toLowerCase().startsWith(admin_prefix + "setmode-normal")){
                                if (stat == 'normal'){
                                    api.sendMessage("Nornal mode is already enabled", event.threadID, event.messageID);
                                } else {
                                    stat = 'normal'
                                    api.sendMessage("Normal mode is now enabled", event.threadID, event.messageID);
                                }
                            }
                            else {
                                api.sendMessage("Unknown VIP command", event.threadID, event.messageID);
                                api.setMessageReaction('😒', event.messageID, (err) => {
                                }, true);
                            }
                        } else {api.sendMessage("Di ka vip bonak", event.threadID, event.messageID)}
                    } 
                    else if (input.startsWith(prefix)){
                        if (stat == 'away'){
                            api.getThreadInfo(event.threadID, (err, data) => {
        if(data.isGroup){
            api.sendMesssage("Hellon\n-Kenbot", event.threadID, event.messageID);
        } 
        else {
            api.sendMesssage("Vip is currently busy", event.threadID, event.messageID);
        }
    })
                        } else {
                            if (input.toLowerCase().startsWith(prefix + "status")){
                            status.body = "🛠️🤖 KenBot Status 🤖🛠️\n",
                            status.body += `🔰Message Reaction: ${reaction}`
                            api.sendMessage(status, event.threadID)
                        } 
                        else if (input.toLowerCase().startsWith(prefix + "wiki")){
                            if (wiki == on) {
                                if (wiki == 'cooldown'){console.log('Cooldown')} else {let ai = input.substring(6);
                                    let data  = input.split(" ");
                                    if (data.length == 1){
                                        api.sendMessage("Invalid Query", event.threadID);
                                    } else {
                                        console.log(ai)
                                        axios.get(`https://en.wikipedia.org/api/rest_v1/page/summary/${ai}`).then((response) => {console.log(response)
                                        if (response === 'undefined' || response.title === 'undefined'){
                                            api.sendMessage(`⚠️ Wikipedia did not find the word: '${ai}'`, event.threadID, event.messageID)
                                        } else {
                                            let info = response.data.extract
                                            console.log(response.data.extract)
                                            let definition = `📖 Definition of '${response.data.title || ai}':\n\n`;
                                            definition += `💡 Timestamp: \n  ${response.data.timestamp}\n\n`;
                                            definition += `💡 Desription: \n  ${response.data.description}\n\n`;
                                            definition += `💡 Info: \n  ${info}\n\n`;
                                            definition += 'Source: https://en.wikipedia.org';
                                            let hasImage = (response.data.originalimage !== undefined) && (response.data.originalimage.source !== undefined);
                                            let msg = {body: definition}
                                            api.sendMessage(msg, event.threadID)
                                            wiki = "cooldown"
                                            setTimeout(() => {
                                                wiki = on
                                              }, "30000")
                                            }
                                        })
                                        .catch((error) => {
                                            api.sendMessage(`${error}`, event.threadID, event.messageID);
                                        })
                                    }}
                            }
                            else if (wiki == off) {
                                console.log('Someone is trying to use wiki while disabled')
                            }
                        }
                            
                    
                }
                break;
            case "message_unsend":
                if (!vips.includes(event.senderID)) {
                    let d = msgs[event.messageID];
                    if (typeof (d) == "object") {
                        api.getUserInfo(event.senderID, (err, data) => {
                            if (err) return console.error(err);
                            else {
                                if (d[0] == "img") {
                                    var file = fs.createWriteStream("photo.jpg");
                                    var gifRequest = http.get(d[1], function (gifResponse) {
                                        gifResponse.pipe(file);
                                        file.on('finish', function () {
                                            console.log('finished downloading photo..')
                                            var message = {
                                                body: data[event.senderID]['name'] + " unsent this photo: \n",
                                                attachment: fs.createReadStream(__dirname + '/photo.jpg')
                                            }
                                            api.sendMessage(message, event.threadID);
                                        });
                                    });
                                }
                                else if (d[0] == "vid") {
                                    var file = fs.createWriteStream("video.mp4");
                                    var gifRequest = http.get(d[1], function (gifResponse) {
                                        gifResponse.pipe(file);
                                        file.on('finish', function () {
                                            console.log('finished downloading video..')
                                            var message = {
                                                body: data[event.senderID]['name'] + " unsent this video: \n",
                                                attachment: fs.createReadStream(__dirname + '/video.mp4')
                                            }
                                            api.sendMessage(message, event.threadID);
                                        });
                                    });
                                }// GIF unsent test
                                else if (d[0] == "gif") {
                                    var file = fs.createWriteStream("animated_image.gif");
                                    var gifRequest = http.get(d[1], function (gifResponse) {
                                        gifResponse.pipe(file);
                                        file.on('finish', function () {
                                            console.log('finished downloading gif..')
                                            var message = {
                                                body: data[event.senderID]['name'] + " unsent this GIF: \n",
                                                attachment: fs.createReadStream(__dirname + '/animated_image.gif')
                                            }
                                            api.sendMessage(message, event.threadID);
                                        });
                                    });
                                }
                            
                                else if (d[0] == "sticker") {
                                    var file = fs.createWriteStream("sticker.png");
                                    var gifRequest = http.get(d[1], function (gifResponse) {
                                        gifResponse.pipe(file);
                                        file.on('finish', function () {
                                            console.log('finished downloading gif..')
                                            var message = {
                                                body: data[event.senderID]['name'] + " unsent this Sticker: \n",
                                                attachment: fs.createReadStream(__dirname + '/sticker.png')
                                            }
                                            api.sendMessage(message, event.threadID);
                                        });
                                    });
                                }

                                else if (d[0] == "vm") {
                                    var file = fs.createWriteStream("vm.mp3");
                                    var gifRequest = http.get(d[1], function (gifResponse) {
                                        gifResponse.pipe(file);
                                        file.on('finish', function () {
                                            console.log('finished downloading audio..')
                                            var message = {
                                                body: data[event.senderID]['name'] + " unsent this audio: \n",
                                                attachment: fs.createReadStream(__dirname + '/vm.mp3')
                                            }
                                            api.sendMessage(message, event.threadID);
                                        });
                                    });
                                }
                            }
                        });
                    }
                    else {
                        api.getUserInfo(event.senderID, (err, data) => {
                            if (err) return console.error("Error: files are"+err);
                            
                            else {
                                api.sendMessage(data[event.senderID]['name'] + " unsent this: \n" + msgs[event.messageID], event.threadID);
                            }
                        });
                    }
                    break;
                }
        }
    });
});
