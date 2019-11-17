var Pusher = require('pusher');


var pusher_instance = new Pusher({
  appId: process.env.PUSHER_APP_ID,
  key: process.env.PUSHER_KEY,
  secret: process.env.PUSHER_SECRET,
  useTLS: true,
});

async function handler(event) {
  event.body = JSON.parse(event.body);
  var socketId = event.body.socket_id;
  var channel = event.body.channel_name;
  var role = event.body.role;
  var presenceData = {
    user_id: role,
  }

  var auth = pusher_instance.authenticate(socketId, channel, presenceData);
  
  const response = {
      statusCode: 200,
      body: JSON.stringify(auth),
  };

  return response;
};

exports.handler = handler;
exports.default = handler;
