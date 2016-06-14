'use strict';

var fsHelper = require('./fs-helper.js');

function addChatters(chatters) {
    // TODO: Add MongoDB support
    fsHelper.writeToFile('chatters.json', chatters);
}

function listChatters() {
    return fsHelper.readFile('chatters.json');
}

// TODO: Finish support for other chatter user types

function listModerators() {

}

function listStaff() {

}

function listAdmins(){

}

function listGlobalMods() {

}

function welcomeChatters() {

}


module.exports = {
    addChatters,
    listChatters,
    listModerators,
    listStaff,
    listAdmins,
    listGlobalMods,
    welcomeChatters
};
