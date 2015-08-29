"use strict";

var axios = require("axios"),
    
    $ref = require("falcor").Model.ref;

function auth(fn) {
    return function(pathSet) {
        if(!this.key) {
            throw new Error("No API key specified");
        }
        
        return fn(pathSet, this.key);
    };
}

module.exports = [ {
    route : "account.dyes.length",
    get   : auth(function(pathSet, key) {
        return axios.get("https://api.guildwars2.com/v2/account/dyes?access_token=" + key)
            .then(function(resp) {
                return {
                    path  : pathSet,
                    value : resp.data.length
                };
            });
    })
}, {
    route : "account.dyes[{ranges:ids}]",
    get   : auth(function(pathSet, key) {
        return axios.get("https://api.guildwars2.com/v2/account/dyes?access_token=" + key)
            .then(function(resp) {
                var results = [];
                
                pathSet.ids.forEach(function(range) {
                    resp.data.slice(range.from, range.to + 1).forEach(function(dye, idx) {
                        results.push({
                            path  : [ pathSet[0], pathSet[1], range.from + idx ],
                            value : $ref([ "colorsById", dye ])
                        });
                    });
                });
                
                return results;
            });
    })
} ];
