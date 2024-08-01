const express = require('express');
const bodyParser = require('body-parser');
const Stripe = require('stripe');
const cors = require('cors');
require('dotenv').config();

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.post('/create-payment-intent', async (req, res) => {
  console.log('Received request:', req.body);

  try {
    const { amount } = req.body;

    if (!amount || typeof amount !== 'number') {
      return res.status(400).send('Invalid amount');
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'usd',
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error('Error creating PaymentIntent:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
