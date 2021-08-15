# Twitch Poll Bot
Read and understand the important variables needed from 
the [Twitch developers site](https://dev.twitch.tv/docs/irc)
# Install
## Node
1. Download and install [Node.js](https://nodejs.org/en/)
2. Open Command Prompt, install npm (Node Package Manager)
```npm install```
3. From Command Prompt install tmi.js:
```npm install tmi.js```
4. In the same working folder as this bot, create a file called ```settings.json```
   + use the settings.json file to set your connection variables for the next step
   + To find your oathToken, go to: [https://twitchapps.com/tmi/](https://twitchapps.com/tmi/)

# Run Bot
1. From Command Prompt type
    ```node Poll_Bot.js```
2. In the chat window type !game (**You must have a twitch command that outputs the game name into the chat window**)

## Activate a poll
+ In chat type **!Poll *Poll_Name*** with no spaces in the poll name, use underscores if necessary
+ Allow chat to enter their ratings numbers using **!Poll *#***
+ End Poll: **!Poll *End***

A CSV file will be created with all the entries for your usage.
    
All suggestions welcome
