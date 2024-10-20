import dotenv from "dotenv";
import { join } from "path";
import { fileURLToPath } from "url";
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import { createAuthenticatedClient } from "@interledger/open-payments";

// Load environment variables
dotenv.config({
    path: fileURLToPath(join(import.meta.url, "..", "..", ".env")),
});

// Hardcoded values
const KEY_ID = "bf19a7a3-8803-42be-a3dc-537b86ccbf1f";
const WALLET_ADDRESS = "https://ilp.interledger-test.dev/oni";
const PRIVATE_KEY_BASE64 = 'LS0tLS1CRUdJTiBQUklWQVRFIEtFWS0tLS0tCk1DNENBUUF3QlFZREsyVndCQ0lFSVAzdW4yWnlPRFo0WkIwd2FRMkw3WFBNSlBIN1BMQWM4Y2NsNXluQzBWTTcKLS0tLS1FTkQgUFJJVkFURSBLRVktLS0tLQ==';
const PRIVATE_KEY_PATH = Buffer.from(PRIVATE_KEY_BASE64, 'base64');

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCJ2D6DJ7t69W6rn9ml7UzrdDzNfupAy1E",
    authDomain: "view-4acd3.firebaseapp.com",
    projectId: "view-4acd3",
    storageBucket: "view-4acd3.appspot.com",
    messagingSenderId: "62523321577",
    appId: "1:62523321577:web:de613877de5b9fb08a1478"
};

// Initialize Firebase and Firestore
const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);

// Function to get incoming payment URL and token from Firestore
async function getPaymentInfoFromFirestore(name, surname) {
    const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format
    const q = query(
        collection(db, 'incoming_payments'),
        where('createdAt', '>=', `${today}T00:00:00Z`),
        where('createdAt', '<=', `${today}T23:59:59Z`),
        where('name', '==', name),
        where('surname', '==', surname)
    );
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
        const paymentDoc = querySnapshot.docs[0].data();
        console.log("Payment info from Firestore:", paymentDoc);
        return {
            url: paymentDoc.id,
            accessToken: paymentDoc.accessToken
        };
    } else {
        throw new Error("No payment found for the given user today");
    }
}

// Main function to handle the incoming payment completion
async function completeIncomingPayment(name, surname) {
    try {
        const { url, accessToken } = await getPaymentInfoFromFirestore(name, surname);
        console.log("Payment URL:", url);
        console.log("Access Token:", accessToken);

        const client = await createAuthenticatedClient({
            walletAddressUrl: WALLET_ADDRESS,
            privateKey: PRIVATE_KEY_PATH,
            keyId: KEY_ID,
        });

        const incomingPayment = await client.incomingPayment.complete({
            url: url,
            accessToken: accessToken,
        });

        console.log("INCOMING PAYMENT:", JSON.stringify(incomingPayment, null, 2));
    } catch (error) {
        console.error("Error completing the incoming payment:", error);
    }
}

// Execute the function
const name = "ask";
const surname = "ask";
completeIncomingPayment(name, surname);