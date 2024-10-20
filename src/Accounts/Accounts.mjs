import { AccountFlags, createClient } from "tigerbeetle-node";

async function createAccounts() {
    const client = createClient({
        cluster_id: 0n,
        replica_addresses: [process.env.TB_ADDRESS || "3000"],
    });

    const account0 = {
        id: 100n,
        debits_pending: 0n,
        debits_posted: 0n,
        credits_pending: 0n,
        credits_posted: 0n,
        user_data_128: 0n,
        user_data_64: 0n,
        user_data_32: 0,
        reserved: 0,
        ledger: 1,
        code: 1,
        timestamp: 0n,
        flags: AccountFlags.debits_must_not_exceed_credits,
    };

    const account1 = {
        id: 101n,
        debits_pending: 0n,
        debits_posted: 0n,
        credits_pending: 0n,
        credits_posted: 0n,
        user_data_128: 0n,
        user_data_64: 0n,
        user_data_32: 0,
        reserved: 0,
        ledger: 1,
        code: 1,
        timestamp: 0n,
        flags: AccountFlags.history,
    };

    try {
        const account_errors = await client.createAccounts([account0, account1]);
        console.log('Account creation errors: ', account_errors);
    } catch (error) {
        console.error('Error creating accounts:', error);
    }
}

// Call the async function
createAccounts();
