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
  BasicCard,
} = require('actions-on-google');

const functions = require('firebase-functions');

const app = dialogflow({debug: true});

app.intent('favorite color', (conv, {color}) => {
    const luckyNumber = color.length;
    const audioSound = 'https://actions.google.com/sounds/v1/cartoon/clang_and_wobble.ogg';

    if (conv.data.userName) {
      conv.close(`<speak>${conv.data.userName}, your lucky number is ${luckyNumber}. <audio src="${audioSound}"></audio> Would you like to hear some fake colors?</speak>`);
      conv.ask(new Suggestions('Yes', 'No'));
    } else {
      conv.close(`<speak>Your lucky number is ${luckyNumber}. <audio src="${audioSound}"></audio> Would you like to hear some fake colors?</speak>`);
      conv.ask(new Suggestions('Yes', 'No'));
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
  if (!permissionGranted) {
    conv.ask(`Ok, no worries. What's your favorite color?`);
    conv.ask(new Suggestions('Blue', 'Red', 'Green'));
  } else {
    conv.data.userName = conv.user.name.display;
    conv.ask(`Thanks, ${conv.data.userName}. What's your favorite color?`);
    conv.ask(new Suggestions('Blue', 'Red', 'Green'));
  }
});

const colorMap = {
  'indigo taco': {
    title: 'Indigo Taco',
    text: 'Indigo Taco is a subtle bluish tone.',
    image: {
      url: 'https://storage.googleapis.com/material-design/publish/material_v_12/assets/0BxFyKV4eeNjDN1JRbF9ZMHZsa1k/style-color-uiapplication-palette1.png',
      accessibilityText: 'Indigo Taco Color',
    },
    display: 'WHITE',
  },
  'pink unicorn': {
    title: 'Pink Unicorn',
    text: 'Pink Unicorn is an imaginative reddish hue.',
    image: {
      url: 'https://storage.googleapis.com/material-design/publish/material_v_12/assets/0BxFyKV4eeNjDbFVfTXpoaEE5Vzg/style-color-uiapplication-palette2.png',
      accessibilityText: 'Pink Unicorn Color',
    },
    display: 'WHITE',
  },
  'blue grey coffee': {
    title: 'Blue Grey Coffee',
    text: 'Calling out to rainy days, Blue Grey Coffee brings to mind your favorite coffee shop.',
    image: {
      url: 'https://storage.googleapis.com/material-design/publish/material_v_12/assets/0BxFyKV4eeNjDZUdpeURtaTUwLUk/style-color-colorsystem-gray-secondary-161116.png',
      accessibilityText: 'Blue Grey Coffee Color',
    },
    display: 'WHITE',
  },
};

app.intent('favorite fake color', (conv, {fakeColor}) => {
  // Present user with the corresponding basic card and end the conversation.
  conv.close(`Here's the color`, new BasicCard(colorMap[fakeColor]));
});
