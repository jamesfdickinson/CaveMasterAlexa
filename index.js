'use strict';
const Alexa = require('ask-sdk-core');
var CaveMaster = require('./cavemaster.js');
let baseUrl = "https://jamesfdickinson.github.io/CaveMasterAlexa/";
const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
    },
    handle(handlerInput) {
        var caveMaster = new CaveMaster();
        var currentRoom = caveMaster.currentRoom;
        var sndPath = encodeURI(baseUrl + caveMaster.currentRoom.soundPath);

        // res.shouldEndSession(false);
        //res.session("currentRoom", currentRoom.name);
        // res.say("<audio src='" + sndPath + "' />");

        let attributes = { 'currentRoom': currentRoom.name };
        handlerInput.attributesManager.setSessionAttributes(attributes);

        const speakOutput = "<audio src='" + sndPath + "' />";
        const repromptSpeech = "what should you do?";
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(repromptSpeech)
            .withStandardCard(currentRoom.name, currentRoom.text, baseUrl + currentRoom.imagePath,  baseUrl + currentRoom.imagePath)
            .getResponse();
    }
};
const ActionIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'ActionIntent';
    },
    handle(handlerInput) {

        const action = Alexa.getSlotValue(handlerInput.requestEnvelope, 'ACTION');

        if (typeof action == "undefined") action = "";

        let attributes = handlerInput.attributesManager.getSessionAttributes();

        var currentRoomName = attributes.currentRoom;

        let caveMaster = new CaveMaster(currentRoomName);
        let currentRoom = caveMaster.currentRoom;
        var newRoom = caveMaster.processSpeech(action);

        if (newRoom != null) {
            
            var messageActionAudio = "";
            var imagePath = baseUrl + newRoom.imagePath;
            
            if (newRoom.soundPath){
                let sndPath = encodeURI(baseUrl + newRoom.soundPath);
                messageActionAudio += "<audio src='" + sndPath + "' />";
            } 

            if (newRoom.autoMove) {
                newRoom = newRoom.nextRooms[0];
                if (newRoom.soundPath){
                    let sndPath = encodeURI(baseUrl + newRoom.soundPath);
                    messageActionAudio += "<audio src='" + sndPath + "' />";
                } 
            }
           

            //save session
            attributes.currentRoom = newRoom.name;
            handlerInput.attributesManager.setSessionAttributes(attributes);

            const repromptSpeech = "what should you do?";
            return handlerInput.responseBuilder
                .speak(messageActionAudio)
                .reprompt(repromptSpeech)
                .withStandardCard(newRoom.name, newRoom.text, imagePath , imagePath)
                .getResponse();
        } else {
            //get all options

            let messageNotAnAction = "That is not a command you can use in this room.  Try, " + caveMaster.getAllActions(currentRoom.nextRooms).join(", ");
            const repromptSpeech = "what should you do?";
            return handlerInput.responseBuilder
                .speak(messageNotAnAction)
                .reprompt(repromptSpeech)
                .withStandardCard(currentRoom.name, messageNotAnAction,  baseUrl + currentRoom.imagePath,  baseUrl + currentRoom.imagePath)
                .getResponse();

        }


    }
};
const HelpIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        const speakOutput = 'Use your voice to explore the cave. Start now?';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const CancelAndStopIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && (Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.CancelIntent'
                || Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.StopIntent');
    },
    handle(handlerInput) {
        const speakOutput = 'Goodbye!';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .getResponse();
    }
};
/* *
 * FallbackIntent triggers when a customer says something that doesn’t map to any intents in your skill
 * It must also be defined in the language model (if the locale supports it)
 * This handler can be safely added but will be ingnored in locales that do not support it yet 
 * */
const FallbackIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.FallbackIntent';
    },
    handle(handlerInput) {
        const speakOutput = 'Try saying an action';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};
/* *
 * SessionEndedRequest notifies that a session was ended. This handler will be triggered when a currently open 
 * session is closed for one of the following reasons: 1) The user says "exit" or "quit". 2) The user does not 
 * respond or says something that does not match an intent defined in your voice model. 3) An error occurs 
 * */
const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        console.log(`~~~~ Session ended: ${JSON.stringify(handlerInput.requestEnvelope)}`);
        // Any cleanup logic goes here.
        return handlerInput.responseBuilder.getResponse(); // notice we send an empty response
    }
};

/**
 * Generic error handling to capture any syntax or routing errors. If you receive an error
 * stating the request handler chain is not found, you have not implemented a handler for
 * the intent being invoked or included it in the skill builder below 
 * */
const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        const speakOutput = 'Sorry, I had trouble doing what you asked. Please try again.';
        console.log(`~~~~ Error handled: ${JSON.stringify(error)}`);

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};
/**
 * This handler acts as the entry point for your skill, routing all request and response
 * payloads to the handlers above. Make sure any new handlers or interceptors you've
 * defined are included below. The order matters - they're processed top to bottom 
 * */
exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        LaunchRequestHandler,
        ActionIntentHandler,
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        FallbackIntentHandler,
        SessionEndedRequestHandler)
    .addErrorHandlers(
        ErrorHandler)
    .lambda();
