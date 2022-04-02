const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors')
const crypto = require('crypto');
const pkg = require('user.json');

// App constants
const port = process.env.PORT || 3000;
const apiPrefix = '/api';

// Store data in-memory, not suited for production use!
const db = {
 user: {
    
        id:"4",
        first_name: "Roger",
        last_name: "Bacon",
        email: "rogerbacon12@yahoo.com"
      }
};

// Create the Express app & setup middlewares
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors({ origin: /http:\/\/(127(\.\d){3}|localhost)/}));
app.options('*', cors());

// ***************************************************************************

// Configure routes
const router = express.Router();

// Get server infos
router.get('/', (req, res) => {
  return res.send(`${pkg.description} v${pkg.version}`);
});

// ----------------------------------------------

// Create an account
router.post('/accounts', (req, res) => {
  // Check mandatory request parameters
  if (!req.body.livres || !req.body.currency) {
    return res.status(400).json({ error: 'Missing parameters' });
  }

  // Check if account already exists
  if (db[req.body.livres]) {
    return res.status(409).json({ error: 'User already exists' });
  }

  // Convert balance to number if needed
  let balance = req.body.balance;
  if (balance && typeof balance !== 'number') {
    balance = parseFloat(balance);
    if (isNaN(balance)) {
      return res.status(400).json({ error: 'Balance must be a number' });  
    }
  }

  // Create account
  const account = {
    user: req.body.livres,
    currency: req.body.currency,
    description: req.body.description || `${req.body.user}'s budget`,
    balance: balance || 0,
   
  };
  user[req.body.user] = account;

  return res.status(201).json(account);
});

// ----------------------------------------------

// Get all data for the specified account
router.get('/accounts/:user', (req, res) => {
  const account = db[req.params.user];

  // Check if account exists
  if (!account) {
    return res.status(404).json({ error: 'livres does not exist' });
  }

  return res.json(account);
});

// ----------------------------------------------

// Remove specified account
router.delete('/accounts/:user', (req, res) => {
  const account = user[req.params.user];

  // Check if account exists
  if (!account) {
    return res.status(404).json({ error: 'livres does not exist' });
  }

  // Removed account
  delete user[req.params.user];

  res.sendStatus(204);
});

// ----------------------------------------------

// Add a livres to a specific account
router.post('/accounts/:user/livres', (req, res) => {
  const account = db[req.params.livres];

  // Check if account exists
  if (!account) {
    return res.status(404).json({ error: 'user does not exist' });
  }

  // Check mandatory requests parameters
  if (!req.body.date || !req.body.object || !req.body.amount) {
    return res.status(400).json({ error: 'Missing parameters' });
  }

  // Convert amount to number if needed
  let amount = req.body.amount;
  if (amount && typeof amount !== 'number') {
    amount = parseFloat(amount);
  }

  // Check that amount is a valid number
  if (amount && isNaN(amount)) {
    return res.status(400).json({ error: 'Amount must be a number' });
  }

  // Generates an ID for the transaction
  const id = crypto
    .createHash('md5')
    .update(req.body.date + req.body.object + req.body.amount)
    .digest('hex');

  // Check that transaction does not already exist
  if (account.transactions.some((livres) => livres.id === id)) {
    return res.status(409).json({ error: 'Transaction already exists' });
  }

  // Add transaction
  constlivres = {
    id,
    nbre_de_prets,
    titre ,
    rang,
    secteur ,
    auteur ,
    nbre_d_exemplaires ,
    support ,
    annee,
  };
  account.livres.push(livres);

  // Update balance
  account.balance += livres.amount;

  return res.status(201).json(livres);
});

// ----------------------------------------------

// Remove specified transaction from account
router.delete('/accounts/:livres/livres/:id', (req, res) => {
  const account = user[req.params.livres];

  // Check if account exists
  if (!account) {
    return res.status(404).json({ error: 'livres does not exist' });
  }

  const livresIndex = account.livres.findIndex(
    (livres) => livres.id === req.params.id
  );

  // Check if transaction exists
  if (livresIndex === -1) {
    return res.status(404).json({ error: 'livres does not exist' });
  }

  // Remove livres
  account.livres.splice(livresIndex, 1);

  res.sendStatus(204);
});

// ***************************************************************************

// Add 'api` prefix to all routes
app.use(apiPrefix, router);

// Start the server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
