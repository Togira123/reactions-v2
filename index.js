const Discord = require('discord.js')
const config = require('./config.json')
const fs = require('fs')

const client = new Discord.Client({
    presence: {
        activity: {
            name: 'carlon\'s owo commands',
            type: 'WATCHING',
        }
    }
});

client.once('ready', () => {
    console.log('Bot is online!')
})

const cooldowns = new Discord.Collection();

client.on('message', async message => {

    if (!message.content.toLowerCase().startsWith(config.owoprefix) && !message.content.toLowerCase().startsWith(config.prefix) && message.author.bot && message.author.id !== '408785106942164992') return;


    if (message.content.toLowerCase().startsWith(config.owoprefix)) {
        /**
         * @type {Array<String>}
         */
        const args = message.content.slice(config.owoprefix.length).trim().split(' ');
        const command = args.shift().toLowerCase();

        if (command === 'h' || command === 'hunt' || command === 'b' || command === 'battle') {
            if (!cooldowns.has(message.author.id)) {
                cooldowns.set(message.author.id, new Set())
            }
            /**
             * @type {Set}
             */
            const timeouts = cooldowns.get(message.author.id)

            if (!timeouts.has('huntOrBattle')) {
                timeouts.add('huntOrBattle')
                await sleep(15000)
                timeouts.delete('huntOrBattle')
                message.channel.send(`<@${message.author.id}> UwU, it's time to **hunt** or **battle**! Go get those hidden animals`);
            }
        } else if (command === 'curse' || command === 'pray') {
            if (!cooldowns.has(message.author.id)) {
                cooldowns.set(message.author.id, new Set())
            }
            /**
             * @type {Set}
             */
            const timeouts = cooldowns.get(message.author.id)

            if (!timeouts.has('curseOrPray')) {
                timeouts.add('curseOrPray')
                await sleep(300000)
                timeouts.delete('curseOrPray')
                message.channel.send(`<@${message.author.id}> To carlon: **Pray** Tog. To everybody else: **Curse** Carlon`);
            }
        }
    } else if (message.content.toLowerCase().startsWith(config.prefix)) {
        /**
         * @type {Array<String>}
         */
        const args = message.content.slice(config.prefix.length).trim().split(' ');
        const command = args.shift().toLowerCase();

        if (command === 'prefix') {
            const newPrefix = JSON.parse(fs.readFileSync('./config.json', 'utf8'));

            newPrefix['owoprefix'] = args[0]

            fs.writeFile('./config.json', JSON.stringify(newPrefix, undefined, ' '), (err) => {
                if (err) console.log(err)
            });
        }
    } else if (message.author.id === '408785106942164992') {
        if (message.content.includes('I WILL BE BACK IN') && message.content.includes('YOU SPENT')) { //without the second argument it triggers also if u check when the hb returns
            //then it's huntbot
            const i = message.content.indexOf('I WILL BE BACK IN')
            const start = i + 18
            const hoursExist = (() => {
                if (message.content.charAt(start + 1) === 'H' || message.content.charAt(start + 2) === 'H') {
                    return true;
                } else {
                    return false;
                }
            })()
            let hoursString = message.content.charAt(start)
            let indexForMinutes = start + 2
            if (!isNaN(Number(message.content.charAt(start + 1)))) {
                hoursString += message.content.charAt(start + 1)
                indexForMinutes++;
            }
            let hours;
            let minutes;
            if (!hoursExist) {
                hours = 0;
                minutes = Number(hoursString);
            } else {
                hours = Number(hoursString);

                let minutesString = message.content.charAt(indexForMinutes)
                if (!isNaN(Number(message.content.charAt(indexForMinutes + 1)))) {
                    minutesString += message.content.charAt(indexForMinutes + 1)
                }
                minutes = Number(minutesString);
            }

            //now get the user that sent the huntbot
            const j = message.content.indexOf('BEEP BOOP. ')
            const indexNameStart = j + 15 
            const indexNameEnd = message.content.indexOf(',') - 4
            const nameLength = indexNameEnd - indexNameStart;
            let username = ''
            for (let i = 0; i < nameLength; i++) {
                username += message.content.charAt(indexNameStart + i)
            }
            const queryMember= await message.guild.members.fetch({ query: username, limit: 1 });
            const member = queryMember.first()
            const hoursMilli = hours * 3600000
            const minsMilli = minutes * 60000
            const millis = hoursMilli + minsMilli
            await sleep(millis)
            await member.send('Yay, this worked!! Also, your huntbot is finished! Lets hope it\'s something good!')
        }
    }
})


const sleep = (ms) => {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

client.login(config.dctoken)