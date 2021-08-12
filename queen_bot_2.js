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
         username: 'her_majesty_the_queen',
         password: 'oauth:jk7hruwnxv2owg30wysfoxc6jefgcq',
    },
    channels: ['KingStuugie']
};

const client = new tmi.client(options);

client.connect();
const Add = require("./Add")
const Print = require("./Print")
let addObject = new Add()
let printObject = new Print()
const channel_name = 'KingStuugie'
var pollCounter = 0
var dict = {}
var dictUnpack
//pollData = global.Array = []
var kingsNod = true
const createCsvWriter = require('csv-writer').createObjectCsvWriter

var myPath = `C:/the_bot/Poll_Outputs/`
var records = new Array();
var pollName = ''
var startPoll = true
var finishedPoll = false
var pathName
/**
 * The following chat event 
 */
client.on("chat", (channel, user, message, self) => {

    var pollMessage = message.split(' ')
    var userPollEntry = pollMessage[1]
    var regMessage = new RegExp(`[0-9]`)
    if (user.mod || user['usertype'] === 'mod' || user['display-name'] === channel_name || self) {
        try {
            if (pollMessage[0].toLowerCase() === '!poll' && regMessage.test(pollMessage[1]) === false){
                if (pollMessage[1].toLowerCase() !== 'end' ){
                    pollName = pollMessage[1]
                    startPoll = true
                    pathName = `${myPath}${pollName}`
                    client.say(channel_name, `Rate ${pollName} from 1 to 10 and help King Stuugie Rate this game`)
                    client.say(channel_name, `Use Command !Poll # to submit your vote.`)
                }
                else {
                    startPoll = false
                    finishedPoll = true
                    pollCounter = 0
                    var dt = Date.now()
                    console.log(`Path and name: ${myPath}${pollName}`)
                    const csvWriter = new createCsvWriter({
                        path: `C:/the_bot/Poll_Outputs/${pollName}${dt}.csv`,
                        header: [
                            {id: 'user_ID', title: 'User ID'},
                            {id: 'rating', title: 'Rating'}
                        ]
                    })
                    var i = 0
                    for (var dict_key in dict){
                        console.log (`dict key: ${dict_key}`)
                        console.log(`Dict[dict_key]: ${dict[dict_key]}`)
                        records = [
                            {user_ID: `${dict_key}`, rating: `${dict[dict_key]}`}
                        ]
                        i++
                        console.log(`records: ${records.length}`)  
                    }
                    try {
                        csvWriter.writeRecords(records)
                        .then(() => {
                            console.log(`...CSV write Done`)
                        })
                    }
                    catch{
                        console.log(`Error: TC-2`)
                    }
                    
                }
            }
        }
        catch {
            console.log(`Error: TC-1`)
        }
    }
    try {
        if (startPoll === true && regMessage.test(pollMessage[1]) === true){
            if (pollMessage[1] < 1 || pollMessage[1] > 10){
                client.say(channel_name,`${user['display-name']}, wtf?  How is ${pollMessage[1]} a number from 1 to 10?`)
            }
            else{
                console.log(`User Name: ${user['display-name']} and User ID: ${user['user-id']}`)
                gatherPollData(user['user-id'], userPollEntry, pollName)
            }
        }
    }catch
        {
            console.log(`Error: TC-3`)
        }
    if (finishedPoll === true) {
        
    }
})

function gatherPollData(userID, PollEntry, pollNm){
    dict[userID] = PollEntry
    console.log(`gatherPollData: ${userID} & ${dict[userID]}`)
}

