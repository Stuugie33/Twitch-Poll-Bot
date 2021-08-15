/**
 * The following code allows the Streamer and/or Mod
 * to start a 1 to 10 ratings poll.
 * @author King Stuugie
 */
//Twitch Connections
const tmi = require("tmi.js");
//settings.json file required
const settings = require("./settings.json");

const options = {
  options: {
    debug: true,
  },
  connection: {
    cluster: "aws",
    reconnect: true,
  },
  identity: {
    username: `${settings.Your_Twitch_Bot_Channel_Name}`,
    password: `oauth:${settings.Token}`,
  },
  channels: [`${settings.Broadcaster_Channel_Name}`],
};
const client = new tmi.client(options);
client.connect();
//Global variables
const channel_name = `${settings.Broadcaster_Channel_Name}`; //I like to hard code this value for my channel, can use the channels variable as well
const createCsvWriter = require("csv-writer").createObjectCsvWriter;
/**
 * Create a directory like assigned to myPath.  You can name this path
 * whatever you like but this is only used for the poll outputs.
 */
var myPath = settings.bot_path;
var pollCounter = 0;
var dict = {};
var pollName = new String();
var pathName = new String();
var startPoll = true;
var finishedPoll = false;
var fullDate = new String();
var gameName = new String();
var msg = new String();
var dt = new Date();
var dateToSplit = dt.toLocaleDateString();
// dateToSplit's format is m/d/yyyy which is not this author's desired format
var splitDate = dateToSplit.split("/");
//fullDate formats to yyyy-mm-dd
fullDate = `${splitDate[2]}-${splitDate[0].padStart(
  2,
  "0"
)}-${splitDate[1].padStart(2, "0")}`;
/**
 * The following chat event is a general read from
 * the Twitch chat.
 */
client.on("chat", (channel, user, message, self) => {
  /**
   * ToDo:
   * Read the Twitch API to know what the game-name is.
   * At the time of this versioning, msg is populated at the end
   * of this event as is checked to see if the last message was
   * !game (I use this command at the start of the stream to populate this variable)
   * If it was then take the current message and assign it to the
   * gameName variable.  This breaks when chat is bumping.
   * This really needs a better way to read the game-name.
   */
  if (msg === "!game") {
    gameName = message;
  }
  var pollMessage = message.split(" ");
  var userPollEntry = pollMessage[1];
  var regMessage = new RegExp(`[0-9]`);
  //Only allow the broadcaster or mod to activate a Poll
  if (
    user.mod ||
    user["usertype"] === "mod" ||
    user["display-name"] === channel_name ||
    self
  ) {
    //RegEx test the message to make sure it's not a number
    if (
      pollMessage[0].toLowerCase() === "!poll" &&
      regMessage.test(pollMessage[1]) === false
    ) {
      //If it's not the word 'end' it's the name and start of poll
      if (pollMessage[1].toLowerCase() !== "end") {
        pollName = pollMessage[1];
        startPoll = true;
        pathName = `${myPath}${pollName}`;
        client.say(
          channel_name,
          `Rate **${pollName}** from 1 to 10 and help ${channel_name} rate this game`
        );
        client.say(
          channel_name,
          `Use the command !Poll # to submit your vote.`
        );
      }
      //if pollMessage[1] = end
      else {
        startPoll = false;
        finishedPoll = true;
        pollCounter = 0;
      }
    }
  }
  //Start the Poll with a the command !Poll & rating-number passed as the message
  if (
    startPoll === true &&
    regMessage.test(pollMessage[1]) === true &&
    pollMessage[0].toLowerCase() === `!poll`
  ) {
    if (pollMessage[1] < 1 || pollMessage[1] > 10) {
      //I mean, really?
      client.say(
        channel_name,
        `${user["display-name"]}, wtf?  How is ${pollMessage[1]} a number from 1 to 10?`
      );
    } else {
      var wholeNumber = parseInt(userPollEntry);
      console.log(
        `User ID: ${user["user-id"]} || Rating Entry: ${wholeNumber}`
      );
      //pass the User-ID and poll entry to be stored in a dictionary
      gatherPollData(user["user-id"], userPollEntry);
    }
  }
  if (finishedPoll === true) {
    var records = [];
    const csvWriter = new createCsvWriter({
      path: `${myPath}${gameName}_${pollName}_${fullDate}.csv`,
      header: [
        { id: "user_ID", title: "User ID" },
        { id: "rating", title: "Rating" },
      ],
    });
    for (var dict_key in dict) {
      //records overwrites each time this is iterated, only one record is ever in the variable records
      records.push({ user_ID: `${dict_key}`, rating: `${dict[dict_key]}` });
    }
    try {
      csvWriter.writeRecords(records).then(() => {
        console.log(`...CSV write complete`);
      });
    } catch (error) {
      console.log(`Error: CSV did not write to file`);
      console.error(error.message);
    }
    finishedPoll = false;
    client.say(
      channel_name,
      `All ratings for ${pollName} have been entered, thank you!`
    );
  }
  msg = message;
});
/**
 * Function to add unique id and poll entries into
 * a globale dictionary
 * @param {String} userID Unique key perfect for dictionary key
 * @param {String} PollEntry the chatter's poll entry number
 * @author King Stuugie
 */
function gatherPollData(userID, PollEntry) {
  dict[userID] = PollEntry;
}
