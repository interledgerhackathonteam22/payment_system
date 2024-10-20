// payeeWithAccount.js
import { doc, setDoc, collection, addDoc } from "firebase/firestore";
import { db } from '../friebaseConfig/firebaseConfig.mjs';

// Function to add the user who receives payments (the payee) with account details
async function createPayeeUserWithAccount() {
    try {
        // Create a new user with fields: name, lastName, email, userId, and account details
        const payeeRef = await addDoc(collection(db, "payees"), {
            name: "Jane",
            lastName: "Smith",
            email: "jane.smith@example.com",
            userId: "uniquePayeeId67890", // Unique ID for the person receiving payments
            account: {
                accountNumber: "1234567890", // Account number for the payee
                accountType: "Savings", // Type of account (e.g., Savings, Checking)
                bankName: "ABC Bank", // Bank name associated with the account
                currency: "ZAR", // Currency in which payments are made
                balance: 0 // Initial balance for the account, which will update as payments are made
            }
        });

        console.log("Payee User with account added with ID: ", payeeRef.id);

        // You can then link subscribers/payments to this payee user in the future
        // For example, when a subscriber makes a payment, you reference this payee user.

    } catch (e) {
        console.error("Error adding payee user with account: ", e);
    }
}

createPayeeUserWithAccount();
