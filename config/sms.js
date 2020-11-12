const { JUSIBE_PUBLIC_KEY, JUSIBE_ACCESS_TOKEN } = require("./keys")
const Jusibe = require("jusibe");

var jusibe = new Jusibe(JUSIBE_PUBLIC_KEY, JUSIBE_ACCESS_TOKEN);

const sendSMS = (recipients, message) => {
  const payload = {
    to: recipients,
    from: "SERVICEME",
    message: message
  };

  jusibe
    .sendSMS(payload)
    .then(res => {
      console.log(res.body);
    })
    .catch(err => {
      console.log(err.body);
    });
};

module.exports = sendSMS;