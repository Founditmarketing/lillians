process.env.RESEND_API_KEY = "re_7S5RyH9i_PP3pXLSJD2cHfhK2dFYd658V";
const handler = require('./pages/api/contact');

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
