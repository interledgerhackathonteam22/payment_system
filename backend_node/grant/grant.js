import dotenv from "dotenv";
import { join } from "path";
import { randomUUID } from "crypto";
import { fileURLToPath } from "url";
import { createAuthenticatedClient, isPendingGrant } from "@interledger/open-payments";
import { readFileSync } from "fs";

// Load environment variables from .env file
dotenv.config({
    path: fileURLToPath(join(import.meta.url, "..", "..", ".env")),
});

// Load configuration values
const KEY_ID = process.env.KEY_ID;
const WALLET_ADDRESS = process.env.WALLET_ADDRESS;
const PRIVATE_KEY_PATH = readFileSync(process.env.PRIVATE_KEY_PATH, 'utf8');;
const NONCE = randomUUID(); // Generate a random UUID for nonce

// Log configuration for debugging
console.log("PRIVATE_KEY_PATH:", PRIVATE_KEY_PATH);
console.log("KEY_ID:", KEY_ID);
console.log("WALLET_ADDRESS:", WALLET_ADDRESS);

try {
    // Create an authenticated client
    const client = await createAuthenticatedClient({
        walletAddressUrl: WALLET_ADDRESS,
        privateKey: readFileSync(PRIVATE_KEY_PATH, 'utf8'), // Read the private key content
        keyId: KEY_ID,
    });

    const walletAddress = await client.walletAddress.get({
        url: WALLET_ADDRESS,
    });

    console.log("Auth Server URL:", walletAddress.authServer);

    const grant = await client.grant.request(
        {
            url: walletAddress.authServer,
        },
        {
            access_token: {
                access: [
                    {
                        type: "incoming-payment",
                        actions: ["create"], // Start with a simpler request
                    },
                ],
            },
            interact: {
                start: ["redirect"],
                finish: {
                    method: "redirect",
                    uri: "http://localhost:3344",
                    nonce: NONCE,
                },
            },
        },
    );

    // Check if the grant is pending
    if (!isPendingGrant(grant)) {
        throw new Error("Expected interactive grant");
    }

    // Log the interaction URL and access token
    console.log("Please interact at the following URL:", grant.interact.redirect);
    console.log("CONTINUE_ACCESS_TOKEN =", grant.continue.access_token.value);
    console.log("CONTINUE_URI =", grant.continue.uri);

} catch (error) {
    console.error("Error during grant request:", error);
    if (error.response) {
        console.error("Response data:", error.response.data);
    }
}
