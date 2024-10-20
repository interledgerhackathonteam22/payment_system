import React, { useEffect, useState } from 'react';
import { collection, getDocs } from "firebase/firestore";
import { db } from './firebaseConfig/firebaseConfig';

const Dashboard = () => {
    const [data, setData] = useState([]);
    const [filter, setFilter] = useState('');

    function formatDateTime(isoString) {
        const date = new Date(isoString);

        const options = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        };

        return date.toLocaleString('en-US', options);
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch the incoming payments collection from Firestore
                const paymentsQuerySnapshot = await getDocs(collection(db, "incoming_payments"));
                const paymentsData = paymentsQuerySnapshot.docs.map(doc => ({
                    ...doc.data(),
                    id: doc.id
                }));

                // Fetch the subscribers collection from Firestore
                const subscribersQuerySnapshot = await getDocs(collection(db, "Subscribers"));
                const totalSubscribers = subscribersQuerySnapshot.docs.length;

                // Set the payments data and total subscribers state
                setData(paymentsData);
                setTotalSubscribers(totalSubscribers);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, []);

    const filteredData = data.filter(entry =>
        `${entry.name} ${entry.lastName}`.toLowerCase().includes(filter.toLowerCase())
    );

    const [totalSubscribers, setTotalSubscribers] = useState(0);
    const totalMoneyEarned = filteredData.reduce(
        (total, entry) => total + (parseFloat(entry.incomingAmount) || 0),
        0
    ).toFixed(2);

    return (
        <div className="dashboard">
            <div className="header">
                <div className="logo">V</div>
                <h1>Dashboard</h1>
            </div>
            <div className="filter-container">
                <input
                    type="text"
                    placeholder="Filter by name..."
                    value={filter}
                    onChange={e => setFilter(e.target.value)}
                    className="filter-input"
                />
                <div className="stats">
                    <span>Total Subscribers: {totalSubscribers}</span>
                    <span>Total Money Earned: R {totalMoneyEarned}</span>
                </div>
            </div>

            <div className="table-container">
                <table className="data-table">
                    <thead>
                    <tr>
                        <th>Date</th>
                        <th>Name</th>
                        <th>Surname</th>
                        <th>Wallet Address</th>
                        <th>Pending Amount (R)</th>
                    </tr>
                    </thead>
                    <tbody>
                    {filteredData.length > 0 ? (
                        filteredData.map((entry, index) => (
                            <tr key={index}>
                                <td>{formatDateTime(entry.createdAt)}</td>
                                <td>{entry.name}</td>
                                <td>{entry.surname}</td>
                                <td>{entry.walletAddress}</td>
                                <td>{entry.incomingAmount}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5">No data available</td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>

            <style jsx>{`
                .dashboard {
                    background-color: #333333;
                    color: #00eaff;
                    min-height: 100vh;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    padding: 20px;
                }

                .header {
                    display: flex;
                    align-items: center;
                    background: white;
                    color: #08FCFC;
                    padding: 10px 20px;
                    border-radius: 10px;
                    width: calc(100% - 20px);
                    max-width: 1200px;
                    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.5);
                    margin-bottom: 20px;
                    margin-left: 30px;
                    margin-right: 30px;
                }

                .logo {
                    font-size: 3rem;
                    font-weight: 1000;
                    color: #08FCFC;
                    margin-right: 50px;
                    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.7);
                }

                h1 {
                    font-size: 1.5rem;
                    margin: 0;
                }

                .filter-container {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    width: 100%;
                    max-width: 1200px;
                    margin: 20px 0;
                }

                .filter-input {
                    padding: 10px;
                    border: 1px solid #08FCFC;
                    border-radius: 5px;
                    outline: none;
                    width: 300px;
                    transition: border-color 0.3s;
                }

                .filter-input:focus {
                    border-color: #00eaff;
                }

                .stats {
                    display: flex;
                    gap: 20px;
                    color: #00eaff;
                    font-size: 1rem;
                }

                .table-container {
                    width: 100%;
                    max-width: 1500px;
                    background: #3c3c3c;
                    border-radius: 10px;
                    overflow: hidden;
                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
                }

                .data-table {
                    width: 100%;
                    border-collapse: collapse;
                    color: #00eaff;
                }

                .data-table thead {
                    background: #4f4f4f;
                }

                .data-table th, .data-table td {
                    padding: 15px;
                    text-align: left;
                }

                .data-table tbody tr:nth-child(even) {
                    background: #444;
                }

                .data-table tbody tr:hover {
                    background: #555;
                }

                @media (max-width: 600px) {
                    .header {
                        flex-direction: column;
                        align-items: flex-start;
                        padding: 15px;
                    }

                    .logo {
                        font-size: 2rem;
                    }

                    h1 {
                        font-size: 1.25rem;
                    }

                    .filter-container {
                        flex-direction: column;
                        align-items: flex-start;
                        gap: 10px;
                    }

                    .filter-input, .stats {
                        width: 100%;
                        text-align: center;
                    }

                    .stats {
                        justify-content: center;
                    }
                }
            `}</style>
        </div>
    );
};

export default Dashboard;