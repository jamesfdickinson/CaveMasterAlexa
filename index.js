'use strict';
var Alexa = require("alexa-sdk");
var CaveMaster = require('./cavemaster.js');

exports.handler = function (event, context, callback) {
    var alexa = Alexa.handler(event, context);
    //alexa.appId = "amzn1.ask.skill.a1991ae3-7761-42b7-973f-ec910e245967";
    //alexa.appId = "amzn1.echo-sdk-ams.app.999999-d0ed-9999-ad00-999999d00ebe";
    alexa.registerHandlers(handlers);
    alexa.execute();
};

var handlers = {
    'LaunchRequest': function () {
        var caveMaster = new CaveMaster();
        var currentRoom = caveMaster.currentRoom;
        var sndPath = encodeURI('https://jimmyalexaskills.azurewebsites.net/' + caveMaster.currentRoom.soundPath);
        
        // res.shouldEndSession(false);
        //res.session("currentRoom", currentRoom.name);
        // res.say("<audio src='" + sndPath + "' />");
        
        this.attributes['currentRoom'] = currentRoom.name
        this.emit(':ask', "<audio src='" + sndPath + "' />", "what should you do?");
    },
    'AMAZON.HelpIntent': function () {
        var message = 'Welcome to Cave Master. Use your voice to explore the cave. Start now?';
        this.emit(':ask', message, message);
    },
    'AMAZON.CancelIntent': function () {
        this.emit(':tell', "good bye");
    },
    'Unhandled': function () {
        var message = 'Try saying an action';
        this.emit(':ask', message, message);
    },
    'ActionIntent': function () {
        var action = this.event.request.intent.slots.ACTION.value;
        
        if (typeof action == "undefined") action = "";
        
        if (action == "Stop" || action == "stop" || action == "end" || action == "End" || action == "cancel" || action == "Cancel" || action == "no" || action == "No") {
            this.emit(':tell', 'good bye');
            return;
        }
        if (action == "help" || action == "Help") {
            var messagehelp = 'To play, Use your voice to explore the cave. You can start by saying enter cave. The goal is to make it to the end without a bad ending.  There are multiple endings. Each room will describe the situation.  After the prompt, you decide what you want to do by replying.  If your response is not an option then the list of option will be repeated back to you. To end you may say "cancel".  Start now?';
            this.emit(':ask', messagehelp, messagehelp);
            return;
        }
        
        var currentRoomName = this.attributes['currentRoom'];
        
        var caveMaster = new CaveMaster(currentRoomName);
        
        var newRoom = caveMaster.processSpeech(action);
        
        if (newRoom != null) {
            var sndPath = encodeURI('https://jimmyalexaskills.azurewebsites.net/' + newRoom.soundPath);
            this.attributes['currentRoom'] = newRoom.name;
            var messageAction = "";

            var sndPath2 = null;
            if (newRoom.autoMove) {
                var newRoomNext = newRoom.nextRooms[0];
                sndPath2 = encodeURI('https://jimmyalexaskills.azurewebsites.net/' + newRoomNext.soundPath);
                this.attributes['currentRoom'] = newRoomNext.name;
            }
            if (sndPath)
                messageAction = "<audio src='" + sndPath + "' />";
            if (sndPath2)
                messageAction = "<audio src='" + sndPath2 + "' />";
            if (sndPath && sndPath2)
                messageAction = "<audio src='" + sndPath + "' /><audio src='" + sndPath2 + "' />";

            this.emit(':ask', messageAction, "what should you do?");
          
        } else {
            //todo: get all options
            this.attributes['currentRoom'] = currentRoomName;
            this.emit(':ask', "That is not a command you can use in this room.  Try, " + caveMaster.getAllActions(caveMaster.currentRoom.nextRooms), "What should you do?");
        }
        
       // res.shouldEndSession(false);

    }
};