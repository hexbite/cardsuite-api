# [Cardsuite API](https://www.cardsuite.io)

A nodejs library to communicate with the Cardsuite API.

## Installation

```
npm i --save cardsuite-api
```

## Example Usage

```
const cardsuiteApi = require("cardsuite-api");

const config = {
  url: "https://www.cardsuite.io/api",
  apiKey: "my-api-key",
  apiVersion: "1.0"
};

const cs = new cardsuiteApi(config);
const response = await cs.createPayment({});
```

## Payments

### Creating a payment

```
const response = await cs.createPayments(params);
```

#### Parameters

The object parameters for creating a payment are

| key                    | type    | description                                                                                       | required? |
|------------------------|---------|---------------------------------------------------------------------------------------------------|-----------|
| currency               | string  | Three character currency code, either BTC, USD, CAD, EUR                                          | yes       |
| amount                 | number  | Amount of invoice in specified currency in cents                                                  | yes       |
| reference_id           | string  | Custom reference id associated with the payment                                                   | no        |
| callback_url           | string  | A callback url to receive notifications when a payment is successful                              | no        |
| redirect_url           | string  | A redirect url to re-direct the user after a successful payment has been made                     | no        |
| btc_address            | string  | A destination BTC address where the BTC purchased will be sent after a successful payment         | yes       |
| notify_only            | boolean | A flag if true will only notify of a successful payment but NOT broadcast BTC onto the network    | no        |

#### Response

| key                    | description                                                                                                                                                                                       |
|:-----------------------|:--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| id                     | Unique id of payment                                                                                                                                                                              |
| status                 | Payment status, "open", "cc_failed", "cc_paid", "cc_refunded", "btc_failed", "btc_paid", "complete", "cc_chargeback"                                                                              |
| source_currency        | Three character currency code, either BTC, USD, CAD, or EUR                                                                                                                                       |
| source_rate            | The exchange rate of the source currency to BTC                                                                                                                                                   |
| amount_btc             | The converted amount of BTC in BTC purchased from the payment                                                                                                                                     |
| amount_satoshi         | The converted amount of BTC in satoshi purchased from the payment                                                                                                                                 |
| reference_id           | Custom reference id associated with invoice provided on creation                                                                                                                                  |
| expired_at             | The timestamp when the payment is no longer valid                                                                                                                                                 |
| quoted_at              | The timestamp when the payment and exchange rate was originally quoted                                                                                                                            |
| process_fee_type       | The type of process fee for the payment, can be: "percentage", "fixed", "fixed_percentage"                                                                                                        |
| completed_at           | The timestamp when the payment was completed                                                                                                                                                      |
| callback_url           | A callback url to receive notifications when a payment is successful                                                                                                                              |
| redirect_url           | A redirect url to re-direct the user after a successful payment has been made                                                                                                                     |
| btc_address            | A destination BTC address where the BTC purchased will be sent after a successful payment                                                                                                         |
| btc_hash               | The Bitcoin transaction hash of the transaction where the BTC was sent to the destination address                                                                                                 |
| process_fee_amount     | The total processing fee associated to the payment in base units                                                                                                                                  |
| cc_fee_amount          | The total credit card processing fee amount related to the payment in base units                                                                                                                  |
| cc_fee_type            | The type of credit card fee for the payment, can be: "percentage", "fixed", "fixed_percentage"                                                                                                    |
| callback_ack           | The last payment status of a successful callback awknowledgement made from the callback_url: "open", "cc_failed", "cc_paid", "cc_refunded", "btc_failed", "btc_paid", "complete", "cc_chargeback" |
| source_amount          | The total amount charged on the credit card for the payment in base units                                                                                                                         |
| tx_fee_satoshi         | The total miner fee charged for broadcasting the Bitcoin transcation onto the Bitcoin network in satoshi                                                                                          |
| notify_only            | A flag if true will only notify of a successful payment but NOT broadcast BTC onto the network                                                                                                    |
| process_fee_percentage | The processing fee percentage charged in a decimal percentage (IE. 5% = 0.05)                                                                                                                     |
| cc_fee_percentage      | The credit card fee percentage charged in decimal percentage                                                                                                                                      |

### Reading information from an existing payment

```
const response = await cs.readPayment(id);
```

#### Parameters

The id passed in is the uuid of an existing invoice.

#### Response

| key                    | description                                                                                                                                                                                       |
|:-----------------------|:--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| id                     | Unique id of payment                                                                                                                                                                              |
| status                 | Payment status, "open", "cc_failed", "cc_paid", "cc_refunded", "btc_failed", "btc_paid", "complete", "cc_chargeback"                                                                              |
| source_currency        | Three character currency code, either BTC, USD, CAD, or EUR                                                                                                                                       |
| source_rate            | The exchange rate of the source currency to BTC                                                                                                                                                   |
| amount_btc             | The converted amount of BTC in BTC purchased from the payment                                                                                                                                     |
| amount_satoshi         | The converted amount of BTC in satoshi purchased from the payment                                                                                                                                 |
| reference_id           | Custom reference id associated with invoice provided on creation                                                                                                                                  |
| expired_at             | The timestamp when the payment is no longer valid                                                                                                                                                 |
| quoted_at              | The timestamp when the payment and exchange rate was originally quoted                                                                                                                            |
| process_fee_type       | The type of process fee for the payment, can be: "percentage", "fixed", "fixed_percentage"                                                                                                        |
| completed_at           | The timestamp when the payment was completed                                                                                                                                                      |
| callback_url           | A callback url to receive notifications when a payment is successful                                                                                                                              |
| redirect_url           | A redirect url to re-direct the user after a successful payment has been made                                                                                                                     |
| btc_address            | A destination BTC address where the BTC purchased will be sent after a successful payment                                                                                                         |
| btc_hash               | The Bitcoin transaction hash of the transaction where the BTC was sent to the destination address                                                                                                 |
| process_fee_amount     | The total processing fee associated to the payment in base units                                                                                                                                  |
| cc_fee_amount          | The total credit card processing fee amount related to the payment in base units                                                                                                                  |
| cc_fee_type            | The type of credit card fee for the payment, can be: "percentage", "fixed", "fixed_percentage"                                                                                                    |
| callback_ack           | The last payment status of a successful callback awknowledgement made from the callback_url: "open", "cc_failed", "cc_paid", "cc_refunded", "btc_failed", "btc_paid", "complete", "cc_chargeback" |
| source_amount          | The total amount charged on the credit card for the payment in base units                                                                                                                         |
| tx_fee_satoshi         | The total miner fee charged for broadcasting the Bitcoin transcation onto the Bitcoin network in satoshi                                                                                          |
| notify_only            | A flag if true will only notify of a successful payment but NOT broadcast BTC onto the network                                                                                                    |
| process_fee_percentage | The processing fee percentage charged in a decimal percentage (IE. 5% = 0.05)                                                                                                                     |
| cc_fee_percentage      | The credit card fee percentage charged in decimal percentage                                                                                                                                      |

### Process payment

```
const response = await cs.processPayment(params);
```

#### Parameters

The object parameters for processing a payment are

| key            | type   | description                                             | required? |
|:---------------|:-------|:--------------------------------------------------------|:----------|
| payment_id     | string | Unique id of payment                                    | yes       |
| ip_address     | string | IP address of the purchaser                             | yes       |
| credit_card    | string | Credit card number used to make the purchase            | yes       |
| ccv            | number | CCV number of the credit card used to make the purchase | yes       |
| cc_expiry_date | string | Credit card expiry date in MM/YY formart                | yes       |
| address_1      | string | Address line 1 of the credit card purchaser             | yes       |
| address_2      | string | Address line 2 of the credit card purchaser             | yes       |
| city           | string | City of the credit card purchaser                       | yes       |
| state          | string | State of the credit card purchaser                      | no        |
| country        | string | Country of the credit card purchaser                    | yes       |
| zip            | string | Zip code of the credit card purchaser                   | no        |
| first_name     | string | First name of the credit card purchaser                 | yes       |
| last_name      | string | Last name of the credit card purchaser                  | no        |
| phone          | string | Phone number of the credit card purchaser               | yes       |
| email          | string | Email of the credit card purchaser                      | no        |

#### Response

| key                    | description                                                                                                                                                                                       |
|:-----------------------|:--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| id                     | Unique id of payment                                                                                                                                                                              |
| status                 | Payment status, "open", "cc_failed", "cc_paid", "cc_refunded", "btc_failed", "btc_paid", "complete", "cc_chargeback"                                                                              |
| source_amount          | The total amount charged on the credit card for the payment in base units                                                                                                                         |
| source_currency        | Three character currency code, either BTC, USD, CAD, or EUR                                                                                                                                       |
| source_rate            | The exchange rate of the source currency to BTC                                                                                                                                                   |
| amount_btc             | The converted amount of BTC in BTC purchased from the payment                                                                                                                                     |
| amount_satoshi         | The converted amount of BTC in satoshi purchased from the payment                                                                                                                                 |
| reference_id           | Custom reference id associated with invoice provided on creation                                                                                                                                  |
| expired_at             | The timestamp when the payment is no longer valid                                                                                                                                                 |
| quoted_at              | The timestamp when the payment and exchange rate was originally quoted                                                                                                                            |
| process_fee_type       | The type of process fee for the payment, can be: "percentage", "fixed", "fixed_percentage"                                                                                                        |
| completed_at           | The timestamp when the payment was completed                                                                                                                                                      |
| callback_url           | A callback url to receive notifications when a payment is successful                                                                                                                              |
| redirect_url           | A redirect url to re-direct the user after a successful payment has been made                                                                                                                     |
| btc_address            | A destination BTC address where the BTC purchased will be sent after a successful payment                                                                                                         |
| btc_hash               | The Bitcoin transaction hash of the transaction where the BTC was sent to the destination address                                                                                                 |
| process_fee_amount     | The total processing fee associated to the payment in base units                                                                                                                                  |
| cc_fee_amount          | The total credit card processing fee amount related to the payment in base units                                                                                                                  |
| cc_fee_type            | The type of credit card fee for the payment, can be: "percentage", "fixed", "fixed_percentage"                                                                                                    |
| callback_ack           | The last payment status of a successful callback awknowledgement made from the callback_url: "open", "cc_failed", "cc_paid", "cc_refunded", "btc_failed", "btc_paid", "complete", "cc_chargeback" |
| tx_fee_satoshi         | The total miner fee charged for broadcasting the Bitcoin transcation onto the Bitcoin network in satoshi                                                                                          |
| notify_only            | A flag if true will only notify of a successful payment but NOT broadcast BTC onto the network                                                                                                    |
| process_fee_percentage | The processing fee percentage charged in a decimal percentage (IE. 5% = 0.05)                                                                                                                     |
| cc_fee_percentage      | The credit card fee percentage charged in decimal percentage                                                                                                                                      |

## Refunds

### Refund payment

```
const response = await cs.refundPayment(params);
```

#### Parameters

The object parameters for refunding a payment are

| key            | type   | description                                             | required? |
|:---------------|:-------|:--------------------------------------------------------|:----------|
| payment_id     | string | Unique id of payment                                    | yes       |
| reason         | string | Reason for the refund                                   | yes       |

#### Response

| key             | description                                                                |
|:----------------|:---------------------------------------------------------------------------|
| payment_id      | Unique id of payment                                                       |
| source_currency | Three character currency code, either BTC, USD, CAD, or EUR                |
| source_amount   | The total amount refunded on the credit card for the payment in base units |
| status          | Refund status, "open", "complete"                                          |
| reason          | Reason for the refund                                                      |

## Chargebacks

### Chargeback a payment

```
const response = await cs.chargebackPayment(params);
```

#### Parameters

The object parameters for refunding a payment are

| key            | type   | description                                             | required? |
|:---------------|:-------|:--------------------------------------------------------|:----------|
| payment_id     | string | Unique id of payment                                    | yes       |
| reason         | string | Reason for the chargebac                                | yes       |

#### Response

| key             | description                                                                    |
|:----------------|:-------------------------------------------------------------------------------|
| payment_id      | Unique id of payment                                                           |
| source_currency | Three character currency code, either BTC, USD, CAD, or EUR                    |
| source_amount   | The total amount chargebacked on the credit card for the payment in base units |
| status          | Refund status, "open", "complete"                                              |
| reason          | Reason for the chargeback                                                      |

## Payment Tokens

### Creating a payment token

```
const response = await cs.createPaymentToken();
```

#### Response

| key         | description                                                       |
|:------------|:------------------------------------------------------------------|
| expired     | Whether or not the payment token is expired or not: true or false |
| expiry_date | Timestamp of when the payment token will be expired               |
| created_at  | Timestamp of when the payment token was created                   |
| id          | The payment token to be used in the hosted URL payment page       |


