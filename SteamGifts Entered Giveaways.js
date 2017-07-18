// ==UserScript==
// @name         SteamGifts Entered Giveaways
// @namespace    https://www.steamgifts.com/user/astaldo
// @version      0.0.1
// @description  Display types of entered SteamGift Giveaways
// @author       astaldo
// @match        https://www.steamgifts.com/giveaways/entered
// @grant        GM_log
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @connect      self
// @updateURL    https://raw.githubusercontent.com/Astaldo1977/sg-entered/07b7117e548472aca1baad1995813b50131c4408/SteamGifts%20Entered%20Giveaways.js
// @downloadURL  https://raw.githubusercontent.com/Astaldo1977/sg-entered/07b7117e548472aca1baad1995813b50131c4408/SteamGifts%20Entered%20Giveaways.js
// ==/UserScript==
var errorFunction = function(response) {
    console.log("Error details: ", response.status, response.responseText);
};
var fetchGiveaway = function(code, element) {
    GM_xmlhttpRequest({
        "method": "GET",
        "url": "https://www.steamgifts.com/giveaway/"+code+"/",
        "onload": function(response) {
            var giveawayData = {
                inviteOnly : false
            };
            if($(".featured__column--contributor-level", response.responseText).length === 1) {
                var level = $(".featured__column--contributor-level", response.responseText).text();
                $(element).parent().next().after('<DIV class="featured__column featured__column--contributor-level featured__column--contributor-level--positive">'+level+'</DIV>');
            }
            if($(".featured__column--invite-only", response.responseText).length === 1) {
                giveawayData.inviteOnly = true;
                $(element).parent().next().after('<DIV class="featured__column featured__column--invite-only"><i class="fa fa-fw fa-lock"></i></DIV>');
            }
        },
        "onabort": errorFunction,
        "onerror": errorFunction,
        "ontimeout": errorFunction
    });
};

(function() {
    'use strict';
    var elements = $('a.table_image_thumbnail');
    elements.each(function() {
        var href=$(this).attr('href');
        if(href.startsWith('/giveaway/')){
            var code =href.slice(10,15);
            if(GM_getValue(code)){
                var giveawayData = GM_getValue(code);
            }
            else{
                fetchGiveaway(code, $(this));
            }
        }
    });
})();
