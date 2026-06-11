// Local dev test for /api/contact. Loads RESEND_API_KEY from .env.local
// (never commit that file). Run: `node test_send.js`
require('dotenv').config({ path: require('path').resolve(__dirname, '.env.local') });
if (!process.env.RESEND_API_KEY) {
  console.error('RESEND_API_KEY not set. Create .env.local with RESEND_API_KEY=re_...');
  process.exit(1);
}
const handler = require('./api/contact');

(async () => {
  const req = {
    method: 'POST',
    body: {
      name: 'CIARA Test',
      email: 'ciara@founditmarketing.com',
      phone: '555-123-4567',
      service: 'installation',
      message: 'Test message'
    }
  };

  const res = {
    statusCode: 0,
    jsonData: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(data) {
      this.jsonData = data;
      console.log('Response status:', this.statusCode);
      console.log('Response body:', data);
    }
  };

  await handler(req, res);
})();
