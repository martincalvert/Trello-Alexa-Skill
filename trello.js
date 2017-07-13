'use strict';

const Alexa = require('alexa-sdk');

const APP_ID = undefined;  // TODO replace with your app ID (OPTIONAL).

const handlers = {
    'HowManyCardsIntent': function () {
      fetchCards((results) => {
          this.emit(':tell', results['answer']);
      });
    },
    'AddToCostcoIntent': function () {
      let card = {
        name: this.event.request.intent.slots.item.value,
        idList: '595147301abe1d8b6feff947'
      }
      addCard(card, (results) => {
          this.emit(':tell', results + 'costco');
      });
    },
    'AddToTargetIntent': function () {
      let card = {
        name: this.event.request.intent.slots.item.value,
        idList: '5951473a47a5b8a867a93e98'
      }
      addCard(card, (results) => {
          this.emit(':tell', results + 'target');
      });
    },
    'AddToGroceriesIntent': function () {
      let card = {
        name: this.event.request.intent.slots.item.value,
        idList: '59514735834301079b5db6d4'
      }
      addCard(card, (results) => {
          this.emit(':tell', results + 'groceries');
      });
    },
    'AMAZON.HelpIntent': function () {
        this.emit(':ask', "Try are there any cards ready for review");
    },
    'AMAZON.CancelIntent': function () {
        this.emit(':tell', 'Cancelled');
    },
    'AMAZON.StopIntent': function () {
        this.emit(':tell', 'Have a nice day');
    }
};

var https = require('https');
const key = process.env.TRELLO_KEY;
const token = process.env.TRELLO_TOKEN;

function fetchCards(callback){
  let options = {
    host: 'api.trello.com',
    path: '/1/lists/58acf51c8d3d22142a544bc2/cards?key=' + key + '&token=' + token,
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  };
  let retData = '';
  let ret = {};
  let req = https.request(options, res => {
    res.on('data', chunk => {
      retData = retData + chunk;
    });

    res.on('end', () => {
        let json = JSON.parse(retData);
        if (json.length > 0){
          ret['answer'] = 'Yes there is ' + json.length + ' ready for review'
        } else {
          ret['answer'] = 'Nope all stories have been reviewed'
        }

        callback(ret);
    })
  });

  req.end();
}

function addCard(card, callback){
  var options = {
    host: 'api.trello.com',
    path: '/1/cards?key=' + key + '&token=' + token,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  };
  var retData = '';
  var ret = {};
  var req = https.request(options, res => {
    res.on('data', chunk => {
      //retData = retData + chunk;
    });

    res.on('end', () => {
      callback('Ok added ' + card.name + ' to ');
    })
  });

  req.write(JSON.stringify(card));
  req.end();
}

exports.handler = (event, context) => {
    const alexa = Alexa.handler(event, context);
    alexa.APP_ID = APP_ID;
    // To enable string internationalization (i18n) features, set a resources object.
    alexa.registerHandlers(handlers);
    alexa.execute();
}
