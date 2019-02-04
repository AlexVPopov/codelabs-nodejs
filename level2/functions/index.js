// Copyright 2018, Google, Inc.
// Licensed under the Apache License, Version 2.0 (the 'License');
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an 'AS IS' BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

'use strict';

const {
  dialogflow,
  Permission,
  Suggestions,
} = require('actions-on-google');

const functions = require('firebase-functions');

const app = dialogflow({debug: true});

app.intent('favorite color', (conv, {color}) => {
    const luckyNumber = color.length;

    if (conv.data.userName) {
      conv.close(`${conv.data.userName}, your lucky number is ${luckyNumber}.`);
    } else {
      conv.close(`Your lucky number is ${luckyNumber}.`);
    }
});

// Set the DialogflowApp object to handle the HTTPS POST request.
exports.dialogflowFirebaseFulfillment = functions.https.onRequest(app);

app.intent('Default Welcome Intent', (conv) => {
  conv.ask(new Permission({
    context: 'Hi there, to get to know you better',
    permissions: 'NAME'
  }));
});

app.intent('actions_intent_PERMISSION', (conv, params, permissionGranted) => {
  if (permissionGranted) {
    conv.data.userName = conv.user.name.display;
    conv.ask(`Thanks, ${conv.data.userName}. What's your favorite color?`);
    conv.ask(new Suggestions('Blue', 'Red', 'Green'));
  } else {
    conv.ask(`Ok, no worries. What's your favorite color?`);
    conv.ask(new Suggestions('Blue', 'Red', 'Green'));
  }
});
