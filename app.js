var irc = require("tmi.js"),
    personal    = require("./config.js");

function init() {
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
               random: "chat",
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
     }
}
