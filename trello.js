'use strict';

const Alexa = require('alexa-sdk');

const APP_ID = undefined;  // TODO replace with your app ID (OPTIONAL).

const handlers = {
    'HowManyCardsIntent': function () {
      fetchCards((results) => {
          this.emit(':tell', results['answer']);
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

function fetchCards(callback){
  const key = process.env.TRELLO_KEY;
  const token = process.env.TRELLO_TOKEN;
  var options = {
    host: 'api.trello.com',
    path: '/1/lists/58acf51c8d3d22142a544bc2/cards?key=' + key + '&token=' + token,
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  };
  var retData = '';
  var ret = {};
  var req = https.request(options, res => {
    res.on('data', chunk => {
      retData = retData + chunk;
    });

    res.on('end', () => {
        var json = JSON.parse(retData);
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

exports.handler = (event, context) => {
    const alexa = Alexa.handler(event, context);
    alexa.APP_ID = APP_ID;
    // To enable string internationalization (i18n) features, set a resources object.
    alexa.registerHandlers(handlers);
    alexa.execute();
}
