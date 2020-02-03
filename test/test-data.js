const nock = require('nock');
const _ = require('lodash');

const createPaymentParams = {
  currency: 'CAD',
  amount: '500',
  reference_id: 'test',
  callback_url: 'https://localhost:3000/logger',
  redirect_url: 'https://localhost:3000/success',
  btc_address: '2NGZrVvZG92qGYqzTLjCAewvPZ7JE8S8VxE',
};

const createPaymentExpectedOutput = {
  id: 'be5e8e38-4da2-43b7-a5a1-4100428de5a7',
  status: 'open',
  source_currency: 'CAD',
  source_rate: '11728.740000',
  amount_btc: '0.00042630',
  amount_satoshi: '42630',
  reference_id: '123456',
  expired_at: '2020-01-28T00:15:42.191Z',
  quoted_at: '2020-01-28T00:00:42.196Z',
  process_fee_type: 'percentage',
  completed_at: null,
  callback_url: null,
  redirect_url: null,
  btc_address: '2NGZrVvZG92qGYqzTLjCAewvPZ7JE8S8VxE',
  btc_hash: null,
  process_fee_amount: '1279',
  cc_fee_amount: '0',
  cc_fee_type: 'percentage',
  callback_ack: 'open',
  source_amount: '500',
  tx_fee_satoshi: null,
  notify_only: false,
  process_fee_percentage: '0.03',
  cc_fee_percentage: '0.00',
};

const processPaymentParams = {
  payment_id: 'be5e8e38-4da2-43b7-a5a1-4100428de5a7',
  ip_address: '127.0.0.1',
  credit_card: '4532646653175959',
  ccv: '123',
  cc_expiry_date: '12/99',
  address_1: '456 Applestreet',
  city: 'Toronto',
  state: 'ON',
  country: 'CA',
  zip: 'T1T1T1',
  first_name: 'John',
  last_name: 'Apple',
  phone: '1231234567',
  email: 'john@abc.com',
}

const processPaymentExpectedOutput = {
  id: 'be5e8e38-4da2-43b7-a5a1-4100428de5a7',
  status: 'complete',
  source_currency: 'CAD',
  source_rate: '12579.520000',
  amount_btc: '0.00039747',
  amount_satoshi: '39747',
  reference_id: '123456',
  expired_at: '2020-01-30T22:06:38.045Z',
  quoted_at: '2020-01-30T21:51:38.050Z',
  process_fee_type: 'percentage',
  completed_at: '2020-01-30T21:52:27.402Z',
  callback_url: null,
  redirect_url: null,
  btc_address: '2NGZrVvZG92qGYqzTLjCAewvPZ7JE8S8VxE',
  btc_hash: 'e1ea9e92e56800821ff1949f4a31fd6753f86a0d8b5016c5aa0d3273daa3eaba',
  process_fee_amount: '1192',
  cc_fee_amount: 0,
  cc_fee_type: 'percentage',
  callback_ack: 'open',
  source_amount: '500',
  tx_fee_satoshi: '3598',
  notify_only: false,
  process_fee_percentage: '0.03',
  cc_fee_percentage: '0.00',
}

const refundPaymentParams = {
  payment_id: 'be5e8e38-4da2-43b7-a5a1-4100428de5a7',
  reason: 'fraud',
}

const refundPaymentExpectedOutput = {
  payment_id: 'be5e8e38-4da2-43b7-a5a1-4100428de5a7',
  source_currency: 'CAD',
  source_amount: 500,
  status: 'complete',
  reason: 'fraud',
}

const chargebackPaymentParams = {
  payment_id: 'be5e8e38-4da2-43b7-a5a1-4100428de5a7',
  reason: 'fraud',
}

const chargebackPaymentExpectedOutput = {
  payment_id: 'be5e8e38-4da2-43b7-a5a1-4100428de5a7',
  source_currency: 'CAD',
  source_amount: 500,
  status: 'complete',
  reason: 'fraud',
}

const paymentTokensExpectedOutput = {
  expired: false,
  expiry_date: '2020-01-30T23:01:26.245Z',
  created_at: '2020-01-30T22:01:26.249Z',
  id: '431e20e6-ae0d-40ba-85d1-713c3bc78a5e',
}

module.exports = {
  createPaymentParams,
  createPaymentExpectedOutput,
  processPaymentParams,
  processPaymentExpectedOutput,
  refundPaymentParams,
  refundPaymentExpectedOutput,
  chargebackPaymentParams,
  chargebackPaymentExpectedOutput,
  paymentTokensExpectedOutput,

  // mock cardsuite server
  cardsuiteMock: (url, apiKey) => {
    nock(url)
      // create payment routes
      .post('/payments')
      .reply(function(uri, requestBody) {
        // If api key is not specified, return unauthorized response
        if (!this.req.headers['x-api-key']) {
          return [
            401,
            {
              message: 'Missing API key',
            },
          ];
        }
        if (this.req.headers['x-api-key'] !== apiKey) {
          return [
            401,
            {
              message: 'Invalid API key',
            },
          ];
        }

        // invalid currency
        if (!['BTC', 'USD', 'CAD', 'EUR'].includes(requestBody.currency)) {
          return [
            422,
            {
              message: 'validation error',
              errors: { currency: ['Currency code is invalid.'] },
            },
          ];
        }

        // test responses
        if (_.isEqual(requestBody, createPaymentParams)) {
          return [201, createPaymentExpectedOutput];
        }

        return [500, { message: 'error' }];
      })
      // read payment routes
      .get('/payments/8122e413-7246-4874-ad1c-15261d32c2cf')
      .reply(function() {
        // If api key is not specified, return unauthorized response
        if (!this.req.headers['x-api-key']) {
          return [
            401,
            {
              message: 'Missing API key',
            },
          ];
        }
        if (this.req.headers['x-api-key'] !== apiKey) {
          return [
            401,
            {
              message: 'Invalid API key',
            },
          ];
        }

        return [
          404,
          {
            message: 'Payment not found.',
          },
        ];
      })
      .get(`/payments/${createPaymentExpectedOutput.id}`)
      .reply(function() {
        // If api key is not specified, return unauthorized response
        if (!this.req.headers['x-api-key']) {
          return [
            401,
            {
              message: 'Missing API key',
            },
          ];
        }
        if (this.req.headers['x-api-key'] !== apiKey) {
          return [
            401,
            {
              message: 'Invalid API key',
            },
          ];
        }

        return [200, createPaymentExpectedOutput];
      })
      // process payment routes
      .post('/payments/8122e413-7246-4874-ad1c-15261d32c2cf/process')
      .reply(function() {
        // If api key is not specified, return unauthorized response
        if (!this.req.headers['x-api-key']) {
          return [
            401,
            {
              message: 'Missing API key',
            },
          ];
        }
        if (this.req.headers['x-api-key'] !== apiKey) {
          return [
            401,
            {
              message: 'Invalid API key',
            },
          ];
        }

        return [
          404,
          {
            message: 'Payment not found.',
          },
        ];
      })
      // process payment routes
      .post(`/payments/${processPaymentExpectedOutput.id}/process`)
      .reply(function(uri, requestBody) {
        // If api key is not specified, return unauthorized response
        if (!this.req.headers['x-api-key']) {
          return [
            401,
            {
              message: 'Missing API key',
            },
          ];
        }
        if (this.req.headers['x-api-key'] !== apiKey) {
          return [
            401,
            {
              message: 'Invalid API key',
            },
          ];
        }

        // invalid currency
        if (!['4532646653175959'].includes(requestBody.credit_card)) {
          return [
            400,
            {
              message: 'Credit Card payment failed - undefined',
            },
          ];
        }

        // test responses
        if (_.isEqual(requestBody, processPaymentParams)) {
          return [200, processPaymentExpectedOutput];
        }

        return [500, { message: 'error' }];
      })
      // refund payment routes
      .post('/payments/8122e413-7246-4874-ad1c-15261d32c2cf/refund')
      .reply(function() {
        // If api key is not specified, return unauthorized response
        if (!this.req.headers['x-api-key']) {
          return [
            401,
            {
              message: 'Missing API key',
            },
          ];
        }
        if (this.req.headers['x-api-key'] !== apiKey) {
          return [
            401,
            {
              message: 'Invalid API key',
            },
          ];
        }

        return [
          404,
          {
            message: 'Payment not found.',
          },
        ];
      })
      // refund payments routes
      .post(`/payments/${refundPaymentParams.payment_id}/refund`)
      .reply(function(uri, requestBody) {
        // If api key is not specified, return unauthorized response
        if (!this.req.headers['x-api-key']) {
          return [
            401,
            {
              message: 'Missing API key',
            },
          ];
        }
        if (this.req.headers['x-api-key'] !== apiKey) {
          return [
            401,
            {
              message: 'Invalid API key',
            },
          ];
        }

        // test responses
        if (_.isEqual(requestBody, refundPaymentParams)) {
          return [200, refundPaymentExpectedOutput];
        }
        return [500, { message: 'error' }];
      })
      // refund payment routes
      .post('/payments/8122e413-7246-4874-ad1c-15261d32c2cf/chargeback')
      .reply(function() {
        // If api key is not specified, return unauthorized response
        if (!this.req.headers['x-api-key']) {
          return [
            401,
            {
              message: 'Missing API key',
            },
          ];
        }
        if (this.req.headers['x-api-key'] !== apiKey) {
          return [
            401,
            {
              message: 'Invalid API key',
            },
          ];
        }

        return [
          404,
          {
            message: 'Payment not found.',
          },
        ];
      })
      .post(`/payments/${chargebackPaymentParams.payment_id}/chargeback`)
      .reply(function(uri, requestBody) {
        // If api key is not specified, return unauthorized response
        if (!this.req.headers['x-api-key']) {
          return [
            401,
            {
              message: 'Missing API key',
            },
          ];
        }
        if (this.req.headers['x-api-key'] !== apiKey) {
          return [
            401,
            {
              message: 'Invalid API key',
            },
          ];
        }

        // test responses
        if (_.isEqual(requestBody, chargebackPaymentParams)) {
          return [200, chargebackPaymentExpectedOutput];
        }

        return [500, { message: 'error' }];
      })
      .post('/payment-tokens')
      .reply(function() {
        // If api key is not specified, return unauthorized response
        if (!this.req.headers['x-api-key']) {
          return [
            401,
            {
              message: 'Missing API key',
            },
          ];
        }
        if (this.req.headers['x-api-key'] !== apiKey) {
          return [
            401,
            {
              message: 'Invalid API key',
            },
          ];
        }

        return [200, paymentTokensExpectedOutput];
      })
  },
};
