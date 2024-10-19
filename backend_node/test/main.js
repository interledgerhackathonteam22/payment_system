import {
    createAuthenticatedClient,
    isPendingGrant,
  } from "@interledger/open-payments";
  
  const KEY_ID = "bf19a7a3-8803-42be-a3dc-537b86ccbf1f";
  const WALLET_ADDRESS = "https://ilp.interledger-test.dev/oni";
  const PRIVATE_KEY_BASE64 = 'LS0tLS1CRUdJTiBQUklWQVRFIEtFWS0tLS0tCk1DNENBUUF3QlFZREsyVndCQ0lFSVAzdW4yWnlPRFo0WkIwd2FRMkw3WFBNSlBIN1BMQWM4Y2NsNXluQzBWTTcKLS0tLS1FTkQgUFJJVkFURSBLRVktLS0tLQ==';
  
  async function generateToken() {
    try {
      console.log("Decoding private key...");
      const privateKeyBuffer = Buffer.from(PRIVATE_KEY_BASE64, 'base64');
      console.log("Decoded private key length:", privateKeyBuffer.length);
      
      console.log("Creating authenticated client...");
      const client = await createAuthenticatedClient({
        walletAddressUrl: WALLET_ADDRESS,
        privateKey: privateKeyBuffer,
        keyId: KEY_ID,
      });
      console.log("Authenticated client created successfully.");
  
      console.log("Fetching wallet address...");
      const walletAddress = await client.walletAddress.get({
        url: WALLET_ADDRESS,
      });
      console.log("Wallet address fetched:", walletAddress);
  
      console.log("Requesting grant...");
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
  
      console.log("INCOMING_PAYMENT_ACCESS_TOKEN =", grant.access_token.value);
      console.log(
        "INCOMING_PAYMENT_ACCESS_TOKEN_MANAGE_URL = ",
        grant.access_token.manage,
      );
  
    } catch (error) {
      console.error("An error occurred:");
      if (error.name === 'OpenPaymentsClientError') {
        console.error("Status:", error.status);
        console.error("Code:", error.code);
        console.error("Description:", error.description);
        if (error.validationErrors) {
          console.error("Validation Errors:", JSON.stringify(error.validationErrors, null, 2));
        }
      } else {
        console.error(error);
      }
    }
  }
  
  generateToken();