'use strict';

var request = require('request'),
    urlPrefix = "http://tmi.twitch.tv/group/user/",
    urlSuffix = "/chatters",
    headers = {'Accept': 'application/vnd.twitchtv.v3+json'},
    qs = {},
    method = "GET";

function getChatters(channel) {
    return new Promise(function(resolve, reject) {
        request({
            url: urlPrefix + channel + urlSuffix,
            qs: qs,
            method: method,
            headers: headers
        }, function(err, response, body){
            if (err) {
                reject(Error(err));
            } else {
                var data = {
                    response,
                    body
                };
                resolve(data);
            }
        });
    });

}

module.exports = {
    getChatters
};
