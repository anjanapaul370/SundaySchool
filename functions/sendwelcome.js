const sgMail = require("@sendgrid/mail");
const API_KEY = functions.config().sendgrid.key;
const TEMPLATE_ID = functions.config().sendgrid.template;
sgMail.setApiKey(API_KEY);

async function sendWelcomeEmail(name, email, password) {
  // var user = { name: data.name, email: data.email, password: data.password };
  const msg = {
    to: email,
    from: "schoolsunday766@gmail.com",
    templateId: TEMPLATE_ID,
    dynamic_template_data: {
      name: name,
      email: email,
      password: password,
    },
  };
  console.log(msg);
  return sgMail.send(msg);
}

module.exports.sendWelcomeEmail = sendWelcomeEmail;
