const Discord = require('discord.js')
const client = new Discord.Client()

client.on('message', (receivedMessage) => {

    console.log("Connected as " + client.user.tag)

    if (receivedMessage.author == client.user) {
        return
    }

    if (receivedMessage.content.startsWith("!")) {
        processCommand(receivedMessage)
    }

})

function processCommand(receivedMessage) {
    let fullCommand = receivedMessage.content.substr(1)     // Remove command token
    let splitCommand = fullCommand.split(" ")               // Separate words by spaces
    let primaryCommand = splitCommand[0]                    // Take first word as primary command
    let arguments = splitCommand.slice(1)                   // Takes all other arguments

    console.log("Command received: " + primaryCommand)
    console.log("Arguments: " + arguments)

    if (primaryCommand == "track") {
        trackCommand(arguments, receivedMessage)
    } else {
        receivedMessage.channel.send("Format: !track <character name> <realm> <region>")
    }

}

function trackCommand(arguments, receivedMessage) {
    
    let charName = arguments[0]
    let charServer = arguments[1]
    let charRegion = arguments[2]

    

}

bot_secret_token = "NTExMTM2NDczNzQ0MDE1MzYw.Dsmx8A.BeHU36X5a1OovJnsQnH7rz0mCw8"

client.login(bot_secret_token)