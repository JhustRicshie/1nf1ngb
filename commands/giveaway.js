const Discord = require("discord.js");
const fs = require("fs");
let pastgiveaways = require("../pastgiveaways.json");
let timer;

module.exports.run = async (bot, message, args) => {
    function wrong(realmsg) {
        message.delete(O_o=>{});
        message.reply(realmsg).then(msg => {msg.delete(5000)});
    }

    if (args[0] === "start") {

        let giveaway_duration = parseInt(args[1]);
        if(!giveaway_duration) return wrong("You didnt specify a duration or you didnt writed a number in the duration's place!");
        let giveaway_numberof_winners = parseInt(args[2]);
        if(!giveaway_numberof_winners) return wrong("You didnt specify a number of winners or you didnt writed a number in the now's place!");
        let giveaway_title = args.slice(3).join(" ")
        if(!giveaway_title) return wrong("You didnt specify a title of the giveaway!"); 

        if(!pastgiveaways[giveaway_title]) {
            pastgiveaways[giveaway_title] = {
                duration: giveaway_duration,
                now: giveaway_numberof_winners,
                intimer: false
            };
            fs.writeFile("./pastgiveaways.json", JSON.stringify(pastgiveaways), (err) => {
                if (err) console.log(err);
            });
        } else {
            pastgiveaways[giveaway_title] = {
                duration: giveaway_duration,
                now: giveaway_numberof_winners,
                intimer: false
            };
            fs.writeFile("./pastgiveaways.json", JSON.stringify(pastgiveaways), (err) => {
                if (err) console.log(err);
            });
        }


        let apic = bot.user.displayAvatarURL;
        let annEmbed = new Discord.RichEmbed()
        .setDescription("A new giveaway has been started!")
        .setFooter("Infinity Giveaway Bot", apic)
        .addField("This giveaway consists of:   ", `${giveaway_title}`, true)
        .addBlankField(true)
        .addField("Duration", `${giveaway_duration} Day`, true)
        .addField("Number of winners", `${giveaway_numberof_winners}`, true)
        .addField("How to enter", "To enter, react with :tada: !", false)
        .setTimestamp(new Date());

        let annchannel = message.guild.channels.find("name", `giveaways`);
        if(!annchannel) return wrong("I cant find the giveaways channel.");
        annchannel.send("@everyone");
        annchannel.send(annEmbed).then(embedMsg => {
            embedMsg.react("🎉");
        });

        var inGiveawayPopol = [
            
        ];

        bot.on('messageReactionAdd', (reaction, user) => {
            if (reaction.emoji.name === "🎉") {
                inGiveawayPopol.push(user);
            }
        });

        var winners = [

        ];
        
        pastgiveaways[giveaway_title].intimer = true;
        timer = setTimeout(() => {
            if (inGiveawayPopol.length < giveaway_numberof_winners) {
                let annchannel = message.guild.channels.find("name", `giveaways`);
                if(!annchannel) wrong("I cant find the giveaways channel.");
                annchannel.bulkDelete(1);
                return annchannel.send(`:x: Cant start giveaway beacuse less than ${giveaway_numberof_winners} player joined.`).then(msg => {msg.delete(60000)});
            } else {
                pastgiveaways[giveaway_title].intimer = false;
                let finished = new Discord.RichEmbed()
                .setDescription(`:tada: The ***${giveaway_title}*** giveaway has ended! Picking winner(s)...`)
                .setColor("#efff42");
                annchannel.send(finished);
                var i;
                for(i = 0; i < giveaway_numberof_winners; i++) {
                    var randomNum = Math.floor(Math.random()*inGiveawayPopol.length);
                    winners.push(inGiveawayPopol[randomNum]);
                    var currentindex = i + 1;
                    let embed = new Discord.RichEmbed()
                    .setDescription(`Winner ${currentindex}: ${winners[i]}!`)
                    .setColor("#36d86c");
                    annchannel.send(embed);
                    let winneruser = winners[i];
                    winneruser.send(`:tada: Congratulations!You winned on the ***${giveaway_title}*** giveaway!The owner of the server will contact you soon!`);    
                    message.author.send(`Winner ${currentindex}: ${winners[i]}. Please contact with him/her!`);
                }
                let congembed = new Discord.RichEmbed()
                .setDescription("Congratulations to all winners! If you didnt win this time, maybe next time! :)")
                annchannel.send(congembed);
                var i2;
                for (i2 = 0; i2 < inGiveawayPopol.length; i++) {
                    inGiveawayPopol.pop();
                }
                return;
            }
        }, giveaway_duration * 36000000); //36000000  
    }
    if (args[0] === "redo") {
        let title = args.slice(1).join(" ");
        if(!title) return wrong("You didnt specify a title.");

        if(!pastgiveaways[title]) { return wrong(`Can't find ***${title}**** giveaway.`); }
        else {
            let duration = pastgiveaways[title].duration;
            let now = pastgiveaways[title].now;

            let apic = bot.user.displayAvatarURL;
            let annEmbed = new Discord.RichEmbed()
            .setDescription("A new giveaway has been started!")
            .setFooter("Infinity Giveaway Bot", apic)
            .addField("This giveaway consists of:   ", `${title}`, true)
            .addBlankField(true)
            .addField("Duration", `${duration} Day`, true)
            .addField("Number of winners", `${now}`, true)
            .addField("How to enter", "To enter, react with :tada: !", false)
            .setTimestamp(new Date())
            .setColor("#6b42f4");
    
            let annchannel = message.guild.channels.find("name", `giveaways`);
            if(!annchannel) return wrong("I cant find the giveaways channel.");
            annchannel.send("@everyone");
            annchannel.send(annEmbed).then(embedMsg => {
                embedMsg.react("🎉");
            });
    
            var inGiveawayPopol = [
                
            ];
    
            bot.on('messageReactionAdd', (reaction, user) => {
                if (reaction.emoji.name === "🎉") {
                    inGiveawayPopol.push(user);
                }
            });
    
            var winners = [
    
            ];
            
            pastgiveaways[title].intimer = true;
            timer = setTimeout(() => {
                if (inGiveawayPopol.length < now) {
                    let annchannel = message.guild.channels.find("name", `giveaways`);
                    if(!annchannel) wrong("I cant find the giveaways channel.");
                    annchannel.bulkDelete(1);
                    return annchannel.send(`:x: Cant start giveaway beacuse less than ${now} player joined.`).then(msg => {msg.delete(60000)});
                } else {
                    pastgiveaways[title].intimer = false;
                    let finished = new Discord.RichEmbed()
                    .setDescription(`:tada: The ***${title}*** giveaway has ended! Picking winner(s)...`)
                    .setColor("#efff42");
                    annchannel.send(finished);
                    var i;
                    for(i = 0; i < now; i++) {
                        var randomNum = Math.floor(Math.random()*inGiveawayPopol.length);
                        winners.push(inGiveawayPopol[randomNum]);
                        var currentindex = i + 1;
                        let embed = new Discord.RichEmbed()
                        .setDescription(`Winner ${currentindex}: ${winners[i]}!`)
                        .setColor("#36d86c");
                        annchannel.send(embed);
                        let winneruser = winners[i];
                        winneruser.send(`:tada: Congratulations!You winned on the ***${title}*** giveaway!The owner of the server will contact you soon!`);    
                        message.author.send(`Winner ${currentindex}: ${winners[i]}. Please contact with him/her!`);
                    }
                    var i2;
                    for (i2 = 0; i2 < inGiveawayPopol.length; i++) {
                        inGiveawayPopol.pop();
                    }
                    return;
                }
            }, duration * 36000000); //36000000  
        }
    }
    if (args[0] === "stop") {
        let title = args.join(" ").slice(5);
        let intim = pastgiveaways[title].intimer;
        if(intim === false) {
            wrong("This giveaway isn't started!");
        } else {
            clearTimeout(timer);
            let successembed = new Discord.RichEmbed()
            .setDescription(":white_check_mark: Giveaway stopped!")
            .setColor("#36d86c");
            message.channel.send(successembed).then(msg => {msg.delete(5000)});
            let annchannel = message.guild.channels.find("name", `giveaways`);
            if(!annchannel) wrong("I cant find the giveaways channel.");
                let stoppedembed = new Discord.RichEmbed()
                .setTitle(`${title}`)
                .setDescription(":x: This giveaway has been stopped! :x:")
                .setColor("#c11717");
                annchannel.bulkDelete(1);
                annchannel.send(stoppedembed);
        }
    }
    if (!(args[0] === "start" || args[0] === "redo" || args[0] === "stop")) {
        return wrong("Wrong first argument!");
    }
    if (!args[0]) {
        return wrong("You didnt specify any first argument.");
    }
}

module.exports.help = {
    name: "giveaway"
}