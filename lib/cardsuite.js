const axios = require('axios');
const Joi = require('@hapi/joi');

class CardsuiteApi {
  constructor(config) {
    this.apiKey = config.apiKey;
    this.url = config.url;
    this.apiVersion = config.apiVersion;
  }

  /**
   * Create a payment
   * @param params payment parameters
   * @return       payment details if successful
   */
  async createPayment(params) {
    const schema = Joi.object({
      currency: Joi.string()
        .uppercase()
        .valid('BTC', 'USD', 'CAD', 'EUR')
        .required(),
      amount: Joi.number()
        .greater(0)
        .less(1000000)
        .required(),
      reference_id: Joi.string(),
      callback_url: Joi.string().uri(),
      redirect_url: Joi.string().uri(),
      btc_address: Joi.string().required(),
      notify_only: Joi.boolean()
    });

    await schema.validateAsync(params);

    return this.httpRequest(
      {
        method: 'POST',
        url: `${this.url}/payments`,
      },
      { ...params, amount: params.amount !== null ? params.amount : 0 },
    );
  }

  /**
   * Process a payment
   * @param params payment parameters
   * @return       payment details if successful
   */
  async processPayment(params) {

    const schema = Joi.object({
      payment_id: Joi.string()
        .guid()
        .required(),
      ip_address: Joi.string()
        .ip()
        .required(),
      credit_card: Joi.string().required(),
      ccv: Joi.number()
        .integer()
        .required(),
      cc_expiry_date: Joi.string().required(),
      address_1: Joi.string(),
      address_2: Joi.string().allow(''),
      city: Joi.string().required(),
      state: Joi.string().required(),
      country: Joi.string().required(),
      zip: Joi.string().required(),
      first_name: Joi.string().required(),
      last_name: Joi.string().required(),
      phone: Joi.string(),
      email: Joi.string(),
    });

    await schema.validateAsync(params);

    return this.httpRequest(
      {
        method: 'POST',
        url: `${this.url}/payments/${params.payment_id}/process`,
      },
      params,
    );
  }

  /**
   * Read a payment
   * @param params payment parameters
   * @return       payment details if successful
   */
  async readPayment(id) {
    
    const schema = Joi.string().guid().required();

    await schema.validateAsync(id);

    return this.httpRequest({
      method: 'GET',
      url: `${this.url}/payments/${id}`,
    });
  }

  /**
   * Refund a payment
   * @param params payment parameters
   * @return       payment details if successful
   */
  async refundPayment(params) {
    
    const schema = Joi.object({
      payment_id: Joi.string()
        .guid()
        .required(),
      reason: Joi.string().required(),
    });

    await schema.validateAsync(params);

    return this.httpRequest(
      {
        method: 'POST',
        url: `${this.url}/payments/${params.payment_id}/refund`,
      },
      params,
    );
  }

  /**
   * Chargeback a payment
   * @param params payment parameters
   * @return       payment details if successful
   */
  async chargebackPayment(params) {
    
    const schema = Joi.object({
      payment_id: Joi.string()
        .guid()
        .required(),
      reason: Joi.string().required(),
    });

    await schema.validateAsync(params);

    return this.httpRequest(
      {
        method: 'POST',
        url: `${this.url}/payments/${params.payment_id}/chargeback`,
      },
      params,
    );
  }  

  /**
   * Create a payment token
   * @param params payment parameters
   * @return       payment details if successful
   */
  async createPaymentToken() {
    return this.httpRequest(
      {
        method: 'POST',
        url: `${this.url}/payment-tokens`,
      },
    );
  }

  /**
   * Cardsuite http request
   */
  async httpRequest(object, params) {
    try {
      const response = await axios({
        method: object.method,
        headers: {
          'content-type': 'application/json',
          'x-api-key': this.apiKey,
          'x-api-version': this.apiVersion,
        },
        url: object.url,
        data: params,
        timeout: 30000,
      });

      return response.data;
    } catch (error) {
      const errorResponse = {
        status: error.response.status,
        error: error.response.data,
      };
      return errorResponse;
    }
  }
}

module.exports = CardsuiteApi;
