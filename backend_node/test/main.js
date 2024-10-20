// Import necessary packages
const express = require('express');
const cors = require('cors');
const { createAuthenticatedClient, isPendingGrant } = require('@interledger/open-payments');
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, doc, setDoc, query, where, getDocs } = require('firebase/firestore');

// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCJ2D6DJ7t69W6rn9ml7UzrdDzNfupAy1E",
  authDomain: "view-4acd3.firebaseapp.com",
  projectId: "view-4acd3",
  storageBucket: "view-4acd3.appspot.com",
  messagingSenderId: "62523321577",
  appId: "1:62523321577:web:de613877de5b9fb08a1478"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);

const app = express();
const PORT = 3000;

// Enable CORS for all routes
app.use(cors());

// Middleware to parse incoming JSON requests
app.use(express.json());

const KEY_ID = "bf19a7a3-8803-42be-a3dc-537b86ccbf1f";
const WALLET_ADDRESS = "https://ilp.interledger-test.dev/oni";
const PRIVATE_KEY_BASE64 = 'LS0tLS1CRUdJTiBQUklWQVRFIEtFWS0tLS0tCk1DNENBUUF3QlFZREsyVndCQ0lFSVAzdW4yWnlPRFo0WkIwd2FRMkw3WFBNSlBIN1BMQWM4Y2NsNXluQzBWTTcKLS0tLS1FTkQgUFJJVkFURSBLRVktLS0tLQ==';

// Function to generate token and create an incoming payment
async function generateTokenAndCreateIncomingPayment() {
  try {
    const privateKeyBuffer = Buffer.from(PRIVATE_KEY_BASE64, 'base64');

    const client = await createAuthenticatedClient({
      walletAddressUrl: WALLET_ADDRESS,
      privateKey: privateKeyBuffer,
      keyId: KEY_ID,
    });

    const walletAddress = await client.walletAddress.get({ url: WALLET_ADDRESS });

    const grant = await client.grant.request(
      {
        url: walletAddress.authServer,
      },
      {
        access_token: {
          access: [
            {
              type: "incoming-payment",
              actions: ["list", "read", "read-all", "complete", "create"],
            },
          ],
        },
      },
    );

    if (isPendingGrant(grant)) {
      throw new Error("Expected non-interactive grant");
    }

    const accessToken = grant.access_token.value;

    const incomingPayment = await client.incomingPayment.create(
      {
        url: new URL(WALLET_ADDRESS).origin,
        accessToken: accessToken,
      },
      {
        walletAddress: WALLET_ADDRESS,
        incomingAmount: {
          value: "5000",
          assetCode: "ZAR",
          assetScale: 2,
        },
        expiresAt: new Date(Date.now() + 60_000 * 1).toISOString(),
      },
    );

    console.log("Incoming payment ID =", incomingPayment);
    return incomingPayment;

  } catch (error) {
    console.error("An error occurred:", error);
    throw error;
  }
}

// Function to check if an incoming payment exists for the given name, surname, and today's date
async function checkExistingPayment(name,surname) {
  const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format
  console.log("esdsdsd")
  const q = query(
    collection(db, 'incoming_payments'),
    where('createdAt', '>=', `${today}T00:00:00Z`),
    where('createdAt', '<=', `${today}T23:59:59Z`),
    where('name', '==', name),
    where('surname', '==', surname)
  );
  console.log("esdsdsd")

  const querySnapshot = await getDocs(q);
  return !querySnapshot.empty; // Return true if there are existing payments
}

// POST endpoint to trigger incoming payment creation and save data in Firestore
app.post('/create-incoming-payment', async (req, res) => {
  const name = 'll';      // Hardcoded name
  const surname = 'joe';    // Hardcoded surname

  try {
    // Check if there is already an incoming payment for today
    const existingPayment = await checkExistingPayment(name, surname);

    if (existingPayment) {
      console.log("Payment already processed for today")
      return res.status(400).json({ message: 'Payment already processed for today' });
    }
    console.log("esdsdsd")

    const incomingPayment = await generateTokenAndCreateIncomingPayment();
    const monthlySubAmount = parseInt(incomingPayment.incomingAmount.value); // Use parseInt or Number
    const monthlySubAmountV = ((monthlySubAmount * 15) / 100);
    const monthlyPlan = String(monthlySubAmountV);
    console.log(monthlyPlan);
    // Prepare the data for Firestore based on the incoming payment structure
    const paymentData = {
      id: incomingPayment.id,
      walletAddress: incomingPayment.walletAddress,
      incomingAmount: incomingPayment.incomingAmount,
      monthlySubAmount : monthlyPlan,
      receivedAmount: incomingPayment.receivedAmount,
      completed: incomingPayment.completed,
      createdAt: incomingPayment.createdAt,
      updatedAt: incomingPayment.updatedAt,
      expiresAt: incomingPayment.expiresAt,
      methods: incomingPayment.methods,
      name: name,            // Hardcoded name
      surname: surname       // Hardcoded surname
    };
    console.log("esdsdsd")

    const docRef = doc(collection(db, 'incoming_payments')); // Create a new document reference
    await setDoc(docRef, paymentData); // Save data

    res.status(200).json({ message: 'Incoming payment created and data saved', paymentId: incomingPayment.id });
  } catch (error) {
    console.error("Error saving data to Firestore:", error);
    res.status(500).json({ error: 'Failed to create incoming payment and save data' });
  }
});

// Run the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
