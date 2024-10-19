import dotenv from "dotenv";
import { join } from "path";
import { fileURLToPath } from "url";
import fs from 'fs';
import { createAuthenticatedClient, isPendingGrant } from "@interledger/open-payments";

// Load environment variables
dotenv.config({
    path: fileURLToPath(join(import.meta.url, "..", "..", ".env")),
});

// Configuration
const PRIVATE_KEY_PATH = "private.key";
const KEY_ID = "a1076375-f8ae-4659-af28-3a5ba0895a8f";
const WALLET_ADDRESS = "https://ilp.interledger-test.dev/oni";

// Read private key from file
let PRIVATE_KEY;
try {
    PRIVATE_KEY = fs.readFileSync(PRIVATE_KEY_PATH, 'utf8').trim();
} catch (error) {
    console.error(`Error reading private key file: ${error.message}`);
    process.exit(1);
}

// Logging configuration
console.log("Configuration:");
console.log("WALLET_ADDRESS:", WALLET_ADDRESS);
console.log("KEY_ID:", KEY_ID);
console.log("Private key file read successfully");

async function main() {
    try {
        console.log("Creating authenticated client...");
        const client = await createAuthenticatedClient({
            walletAddressUrl: WALLET_ADDRESS,
            privateKey: PRIVATE_KEY,
            keyId: KEY_ID,
        });

        console.log("Fetching wallet address details...");
        const walletAddress = await client.walletAddress.get({
            url: WALLET_ADDRESS,
        });

        console.log("Wallet address details:", walletAddress);
        console.log("Auth server:", walletAddress.authServer);

        console.log("Requesting grant...");
        console.log("Auth server URL:", walletAddress.authServer);
        console.log("Grant request payload:", JSON.stringify({
            access_token: {
                access: [
                    {
                        type: "incoming-payment",
                        actions: ["list", "read", "read-all", "complete", "create"],
                    },
                ],
            },
        }, null, 2));

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

        console.log("Grant request successful!");
        console.log("INCOMING_PAYMENT_ACCESS_TOKEN =", grant.access_token.value);
        console.log("INCOMING_PAYMENT_ACCESS_TOKEN_MANAGE_URL = ", grant.access_token.manage);

    } catch (error) {
        console.error('Error occurred:');
        console.error(error);
        if (error.response) {
            console.error('Response data:', error.response.data);
            console.error('Response status:', error.response.status);
            console.error('Response headers:', error.response.headers);
        }
        // Log the stack trace for more detailed error information
        console.error('Stack trace:', error.stack);
    }
}

main();