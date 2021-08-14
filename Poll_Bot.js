/**
 * The following code allows the Streamer and/or Mod
 * to start a 1 to 10 ratings poll.
 * @author King Stuugie
 */
//Twitch Connections
const tmi = require('tmi.js');
const options = {
    options: {
        debug:true,
    },
    connection: {
        cluster: 'aws',
        reconnect: true,
    },
    identity: {
         username: 'Your_Bot_Channel_Name',
         password: 'oauth:Token',
    },
    channels: ['Your_Channel_Name']
};
const client = new tmi.client(options);
client.connect();
//Global variables
const channel_name = 'Your_Channel_Name' //I like to hard code this value for my channel, can use the channels variable as well
var pollCounter = 0
var dict = {}
const createCsvWriter = require('csv-writer').createObjectCsvWriter
//Change this path to whatever path you like
var myPath = `C:/the_bot/Poll_Outputs/`
var pollName = ''
var startPoll = true
var finishedPoll = false
var pathName
/**
 * The following chat event is a general read from 
 * the Twitch chat.
 */
client.on("chat", (channel, user, message, self) => {
    //ToDo: what if '!Poll' is entered by mistake?
    var pollMessage = message.split(' ')
    var userPollEntry = pollMessage[1]
    var regMessage = new RegExp(`[0-9]`)
    //Only allow the broadcaster or mod
    if (user.mod || user['usertype'] === 'mod' || user['display-name'] === channel_name || self) {
        //RegEx test the message to make sure it's not a number 
        if (pollMessage[0].toLowerCase() === '!poll' && regMessage.test(pollMessage[1]) === false){
            console.log(`RegEx check: ${regMessage.test(pollMessage[1])}`)
            //If it's not the word 'end' it's the name and start of poll
            if (pollMessage[1].toLowerCase() !== 'end' ){
                pollName = pollMessage[1]
                startPoll = true
                pathName = `${myPath}${pollName}`
                client.say(channel_name, `Rate ${pollName} from 1 to 10 and help King Stuugie Rate this game`)
                client.say(channel_name, `Use Command !Poll # to submit your vote.`)
            }
            //if pollMessage[1] = end
            else {
                startPoll = false
                finishedPoll = true
                pollCounter = 0
                var dt = Date.now()
                console.log(`Path and name: ${myPath}${pollName}`)
            }
        }
    }
    //Start the Poll with a the command !Poll & rating-number passed as the message
    if (startPoll === true && regMessage.test(pollMessage[1]) === true && pollMessage[0].toLowerCase() === `!poll`){
        if (pollMessage[1] < 1 || pollMessage[1] > 10){
            //I mean, reall?
            client.say(channel_name,`${user['display-name']}, wtf?  How is ${pollMessage[1]} a number from 1 to 10?`)
        }
        else{
            console.log(`User Name: ${user['display-name']} and User ID: ${user['user-id']}`)
            //pass the User-ID and poll entry to be stored in a dictionary.
            gatherPollData(user['user-id'], userPollEntry)
        }
    }
    if (finishedPoll === true) {
        var records = []
        const csvWriter = new createCsvWriter({
            path: `C:/the_bot/Poll_Outputs/${pollName}${dt}.csv`,
            header: [
                {id: 'user_ID', title: 'User ID'},
                {id: 'rating', title: 'Rating'}
            ]
        })
        for (var dict_key in dict){
            console.log (`dict key: ${dict_key}`)
            console.log(`Dict[dict_key]: ${dict[dict_key]}`)
            
            //records overwrites each time this is iterated, only one record is ever in the variable records.
            records.push(
                {user_ID: `${dict_key}`, rating: `${dict[dict_key]}`}
            )
            console.log(`records: ${records.length}`)  
        }
        try {
            csvWriter.writeRecords(records)
            .then(() => {
                console.log(`...CSV write complete`)
            })
        }
        catch(error){
            console.log(`Error: CSV did not write to file`)
            console.error(error.message)
        }
        finishedPoll = false
    }
})
/**
 * Function to add unique id and poll entries into
 * a globale dictionary
 * @param {String} userID Unique key perfect for dictionary key
 * @param {String} PollEntry the chatter's poll entry number
 * @author King Stuugie
 */
function gatherPollData(userID, PollEntry){
    dict[userID] = PollEntry
    console.log(`gatherPollData: ${userID} & ${dict[userID]}`)
}

