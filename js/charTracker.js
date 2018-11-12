const Discord = require('discord.js')
const client = new Discord.Client()
const config = require('../config.json')
const request = require('request')

client.on('message', (receivedMessage) => {

    console.log("Connected as " + client.user.tag)

    if (receivedMessage.author == client.user) {
        return
    }

    if (receivedMessage.content.startsWith(config.prefix)) {
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
    let logsKey = config.wclKey
    let apiURL = `https://www.warcraftlogs.com:443/v1/rankings/character/${charName}/${charServer}/${charRegion}?metric=dps&timeframe=historical&api_key=${logsKey}`

    const options = {
        url: apiURL,
        method: 'GET',
        headers: {
            'Accept': 'application/json'
        }
    }

    request(options, function (error, response, body) {
            console.log('error:', error)
            console.log('statusCode:', response && response.statusCode)
            let json = JSON.parse(body)
            parseData(json, receivedMessage)
        })

}

function parseData(json, receivedMessage) {
    let pctSum = 0;
    let parsedLength = 0;

    for (let i = 0; i < json.length; i += 1) {
        const userRanking = json[i]
        if (userRanking.difficulty > 2) {     // Ensures the lowest difficulty encounters are not included
          const date = new Date((userRanking.startTime))
          pctSum += userRanking.percentile
          parsedLength += 1
      
          console.log(`${date} | ${parsedLength}`)
          console.log(`Ranking: ${userRanking.rank} out of ${userRanking.outOf}. Percentile ranking: ${userRanking.percentile}.`)  
        }
    }   

    const returnString = (`This character is in the Top ${(100 - ((pctSum / parsedLength).toFixed()))}% of Players for DPS.`)
    receivedMessage.channel.send(returnString)

}

client.login(config.token)