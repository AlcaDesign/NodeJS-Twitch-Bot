'use strict';

var irc         = require("tmi.js"),
    config    = require("./config.js"),
    audience    = require("./audience.js"),
    tasks       = require("./tasks.js"),
    DelayQueue  = require("./DelayQueue.js");

var clientSender,          // Used to send messages to Twitch channel
    clientListener,        // Used to listen to messages from Twitch channel
    lastMessageTime,       // The time of the last message sent by bot to channel, in milleseconds
    currentViewers,        // Array of viewers we have already welcomes
    newViewers,            // Array of viewers we have yet to welcome
    coolDown,              // Cooldown ms, time to wait before processing any new sendToChat msgs
    botSpeaker,            // Sends delayed queued messages to channel
    channelSpeakers,
    whisperSpeake,
    whisperSpeakers

init();

function init() {

    // Initialize variables
    coolDown = 3000;
    lastMessageTime = 0;
    newViewers = [];
    currentViewers = [];
    channelSpeakers = {};
    whisperSpeakers = {};

    // Connect the client to the server
    setupConnection(config.CHANNELS(), config.USERNAME(), config.OAUTH());
}


/**
 * Setup an IRC connection to the Twitch network
 *
 * @param  {string} initialChannel The channel that the bot will initially connect to
 * @param  {string} username       The Twitch username to be used by the bot
 * @param  {string} password       The password for the username used by the bot
 */
function setupConnection(channels, username, password) {

    // If we do not already have a clientSender and clientListener then create them
    if(!clientSender && !clientListener){
        var options = {
            options: {
                debug: true
            },
            connection: {
                reconnect: true
            },
            identity: {
                username: username,
                password: password
            },
            channels: channels
        };

        clientListener = new irc.client(options)

        clientListener.connect()

        botSpeaker = DelayQueue(clientListener.say.bind(clientListener), coolDown)

        channels.forEach(function (channel) {
            channelSpeakers[channel] = botSpeaker
        })

        setupIncommingEventHandlers(clientListener)

        // Start re-occuring tasks
        tasks.init(config.CHANNELS())

    }

}

/**
 * Setup event handlers for Twitch events such as join, chat, action, ban, etc...
 *
 * @param  {tmi.client} client The object used to communicate with the Twitch chat server
 */
function setupIncommingEventHandlers(client) {

    /**
     * 	Add listeners for all of the Twitch chat events supported by the tmi library
     */

    client.addListener("action", onAction);

    client.addListener("chat", onChat);

    //NOTE: Handling joins and leaves using Twitch TMI REST endpoint
    client.addListener("join", onJoin);
  }

/**
 * Records the time that the last message from Bot was sent to chat
 */
function updateTimeOfLastMessage(){
    lastMessageTime = Date.now();
}

/**
 * Handles Twitch action events
 *
 * @param  {string} channel The channel the action is coming from
 * @param  {Object} user['username']    The user that is emitting the action
 * @param  {string} message The message being emitted by user
 * @param  {boolean} self   Whether or not the action is coming from the client application
 */
function onAction(channel, user, message, self) {

}


/**
 * Handles Twitch chat events
 *
 * @param  {string} channel The channel the chat is coming from
 * @param  {Object} user    The user that is emitting the chat message
 * @param  {string} message The message being emitted by user
 * @param  {boolean} self   Whether or not the chat is coming from the client application
 */
 function onChat(channel, user, message, self) {
     // console.log("Chat:", user["username"] !== undefined ? user["username"] : "SomeUser", "said:", message);
}
function isNotBot(user) {
    // Check if user or username is or is not the bot
    if(user['username']) {
        return user["username"] !== config.USERNAME().toLowerCase() && user['username'] !== undefined
    } else {
        return user !== config.USERNAME().toLowerCase() && user['username'] !== undefined
    }

}

function botSpeak(channel, message){
    var channelSpeak = channelSpeakers[channel]
    channelSpeak(channel, message)
}

/**
 * Handle Twitch Whisper events
 *
* @param  {Object} user    The user that is emitting the chat message
 * @param  {string} message  The message being emitted by user
*/
function botSpeak(channel, message){
    var whisperSpeak = whisperSpeakers[user]
    whisperSpeak(user, message)

}

/**
 * Handle Twitch join events
 *
 * @param  {string} channel  The channel that is being joined
 * @param  {Object} user The username that is joining the channel
 */
function onJoin(channel, username, self) {

    if (!self) {
        console.log("User:", username, "has joined channel", channel);

        // Check if user is already in list of currentViewers before adding to newViewers
        if (newViewers.length < 1) {
            console.log("First user to be added to newViewers:", username);
            newViewers = [username];
        } else if (!currentViewers.includes(username)) {
            newViewers.push(username);
            console.log("Added user", username, "to newViewers Array");
        } else {
            console.log("User already in currentViewers list");
        }

    }
}
