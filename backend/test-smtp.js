const dotenv = require('dotenv');
const path = require('path');
dotenv.config({ path: path.join(__dirname, 'config', 'config.env') });

const Email = require('./utils/email');

async function run() {
  try {
    const to = process.env.TEST_TO || process.env.SMTP_TEST_TO || process.env.SMTP_USERNAME;
    if (!to) {
      console.error('No recipient specified. Set TEST_TO or SMTP_TEST_TO or ensure SMTP_USERNAME is set in config.env');
      process.exit(1);
    }

    const user = { email: to, name: process.env.TEST_NAME || 'Dev Tester' };
    const url = process.env.FRONTEND_URL || 'http://localhost:5173';
    const email = new Email(user, url);

    console.log('Sending test email to', to);
    // Use existing template 'passwordReset' which expects `firstName` and `url`.
    await email.send('passwordReset', 'Test SMTP delivery from FoodGenie backend');
    console.log('Test send complete (check logs above for transport and preview URL)');
  } catch (err) {
    console.error('Test send failed:', err);
    process.exit(1);
  }
}

run();
