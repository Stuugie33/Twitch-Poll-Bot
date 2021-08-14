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
4. In the Poll_Bot.js replace the 3 following variable values, in accordance to
your new understanding from the Twitch Developer site:
+ Your_Twitch_Bot_Channel_Name (1 instance)
+ Token - Generate this with [https://twitchapps.com/tmi/](https://twitchapps.com/tmi/) (1 instance)
+ Broadcaster_Channel_Name (2 instances)
# Run Bot
1. From Command Prompt type
    ```node Poll_Bot.js```
##Activate a poll
+ In chat type **!Poll *Poll_Name*** with no spaces in the poll name, use underscores if necessary
+ Allow chat to enter their ratings numbers using **!Poll *Number from 1 to 10***
+ End Poll: **!Poll *End***

A CSV file will be created with all the entries for your usage.
    
All suggestions welcome
