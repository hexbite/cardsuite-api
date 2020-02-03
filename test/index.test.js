const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const nock = require('nock');
const CardsuiteApi = require('../lib/cardsuite');
const testData = require('./test-data');

chai.use(chaiAsPromised);
const { expect } = chai;

// test configuration
const config = {
  url: 'https://www.cardsuite.io/api',
  apiKey: 'api-key-test-0000',
  apiVersion: '1.0',
};

describe('Cardsuite library tests', function() {
  beforeEach(async function() {
    testData.cardsuiteMock(config.url, config.apiKey);
  });

  afterEach(async function() {
    nock.cleanAll();
  });

  describe('payments', function() {
    it('should fail to create a payment if an invalid api-key is used', async function() {
      const cardsuiteApi = new CardsuiteApi({ ...config, apiKey: 'some-api-key' });
      const response = await cardsuiteApi.createPayment(testData.createPaymentParams);

      expect(response.status).to.eql(401);
      expect(response.error).to.deep.equal({ message: 'Invalid API key' });
    });

    it('should create an payment', async function() {
      const cardsuiteApi = new CardsuiteApi(config);
      const response = await cardsuiteApi.createPayment(testData.createPaymentParams);

      expect(response).to.deep.equal(testData.createPaymentExpectedOutput);
    });

    it('should fail to read a payment if an invalid api-key is used', async function() {
      const cardsuiteApi = new CardsuiteApi({ ...config, apiKey: 'some-api-key' });
      const response = await cardsuiteApi.readPayment(testData.createPaymentExpectedOutput.id);

      expect(response.status).to.eql(401);
      expect(response.error).to.deep.equal({ message: 'Invalid API key' });
    });

    it('should fail to read a payment if it does not exist', async function() {
      const invalidId = '8122e413-7246-4874-ad1c-15261d32c2cf';
      const cardsuiteApi = new CardsuiteApi(config);
      const response = await cardsuiteApi.readPayment(invalidId);

      expect(response.status).to.eql(404);
      expect(response.error).to.deep.equal({ message: 'Payment not found.' });
    });

    it('should read an payment', async function() {
      const cardsuiteApi = new CardsuiteApi(config);
      const response = await cardsuiteApi.readPayment(testData.createPaymentExpectedOutput.id);

      expect(response).to.deep.equal(testData.createPaymentExpectedOutput);
    });
  });


  describe('payments - processing', function() {

    it('should fail to process a payment if an invalid api-key is used', async function() {
      const cardsuiteApi = new CardsuiteApi({ ...config, apiKey: 'some-api-key' });
      const response = await cardsuiteApi.processPayment(testData.processPaymentParams);

      expect(response.status).to.eql(401);
      expect(response.error).to.deep.equal({ message: 'Invalid API key' });
    });

    it('should fail to process a payment if the payment does not exist', async function() {
      const invalidParams = { ...testData.processPaymentParams, payment_id: '8122e413-7246-4874-ad1c-15261d32c2cf'};
      const cardsuiteApi = new CardsuiteApi(config);
      const response = await cardsuiteApi.processPayment(invalidParams);

      expect(response.status).to.eql(404);
      expect(response.error).to.deep.equal({ message: 'Payment not found.' });
    });

    it('should fail to process a payment if the credit card is invalid', async function() {
      const invalidParams = { ...testData.processPaymentParams, credit_card: '1111222233334444'};
      const cardsuiteApi = new CardsuiteApi(config);
      const response = await cardsuiteApi.processPayment(invalidParams);

      expect(response.status).to.eql(400);
      expect(response.error).to.deep.equal({message: 'Credit Card payment failed - undefined' });
    });

    it('should process a payment if the credit card is valid', async function() {
      const cardsuiteApi = new CardsuiteApi(config);
      const response = await cardsuiteApi.processPayment(testData.processPaymentParams);

      expect(response).to.deep.equal(testData.processPaymentExpectedOutput);
    });
  });

  describe('payments - refunds', function() {
    it('should fail to refund a payment if an invalid api-key is used', async function() {
      const cardsuiteApi = new CardsuiteApi({ ...config, apiKey: 'some-api-key' });
      const response = await cardsuiteApi.refundPayment(testData.refundPaymentParams);

      expect(response.status).to.eql(401);
      expect(response.error).to.deep.equal({ message: 'Invalid API key' });
    });

    it('should fail to refund a payment if a payment does not exist', async function() {
      const invalidParams = {
        payment_id: '8122e413-7246-4874-ad1c-15261d32c2cf',
        reason: 'fraud',
      };
      const cardsuiteApi = new CardsuiteApi(config);
      const response = await cardsuiteApi.refundPayment(invalidParams);

      expect(response.status).to.eql(404);
      expect(response.error).to.deep.equal({ message: 'Payment not found.' });
    });

    it('should refund a payment', async function() {
      const cardsuiteApi = new CardsuiteApi(config);
      const response = await cardsuiteApi.refundPayment(testData.refundPaymentParams);

      expect(response).to.deep.equal(testData.refundPaymentExpectedOutput);
    });
  });


  describe('payments - chargebacks', function() {
    it('should fail to chargeback a payment if an invalid api-key is used', async function() {
      const cardsuiteApi = new CardsuiteApi({ ...config, apiKey: 'some-api-key' });
      const response = await cardsuiteApi.chargebackPayment(testData.chargebackPaymentParams);

      expect(response.status).to.eql(401);
      expect(response.error).to.deep.equal({ message: 'Invalid API key' });
    });

    it('should fail to chargeback a payment if a payment does not exist', async function() {
      const invalidParams = {
        payment_id: '8122e413-7246-4874-ad1c-15261d32c2cf',
        reason: 'fraud',
      };
      const cardsuiteApi = new CardsuiteApi(config);
      const response = await cardsuiteApi.chargebackPayment(invalidParams);

      expect(response.status).to.eql(404);
      expect(response.error).to.deep.equal({ message: 'Payment not found.' });
    });

    it('should chargeback a payment', async function() {
      const cardsuiteApi = new CardsuiteApi(config);
      const response = await cardsuiteApi.chargebackPayment(testData.chargebackPaymentParams);

      expect(response).to.deep.equal(testData.chargebackPaymentExpectedOutput);
    });
  });

  describe('payment tokens', function() {
    it('should fail to create a payment token if an invalid api-key is used', async function() {
      const cardsuiteApi = new CardsuiteApi({ ...config, apiKey: 'some-api-key' });
      const response = await cardsuiteApi.createPaymentToken();

      expect(response.status).to.eql(401);
      expect(response.error).to.deep.equal({ message: 'Invalid API key' });
    });

    it('should create a payment token', async function() {
      const cardsuiteApi = new CardsuiteApi(config);
      const response = await cardsuiteApi.createPaymentToken();

      expect(response.id).to.equal(testData.paymentTokensExpectedOutput.id);
    });
  });
});
