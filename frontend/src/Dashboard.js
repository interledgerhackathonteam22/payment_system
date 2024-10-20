import React, { useEffect, useState } from 'react';
import { collection, getDocs, updateDoc, deleteDoc, doc } from "firebase/firestore";
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
                // Fetch data from Firebase Firestore
                const querySnapshot = await getDocs(collection(db, "incoming_payments"));
                const paymentsData = querySnapshot.docs.map(doc => ({
                    ...doc.data(),
                    id: doc.id
                }));
                setData(paymentsData);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, []);




    const filteredData = data.filter(entry =>
        `${entry.name} ${entry.lastName}`.toLowerCase().includes(filter.toLowerCase())
    );
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
                    background: white; /* Set header background to white */
                    color: #08FCFC; /* Set text color */
                    padding: 10px 20px;
                    border-radius: 10px; /* Rounded corners */
                    width: calc(100% - 20px); /* Adjusted to leave space on ends */
                    max-width: 1200px; /* Adjusted max width */
                    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.5);
                    margin-bottom: 20px; /* Space below header */
                    margin-left: 30px; /* Add margin to the left */
                    margin-right: 30px; /* Add margin to the right */
                }

                .logo {
                    font-size: 3rem;
                    font-weight: 1000; /* Set to a higher weight for bolder appearance */
                    color: #08FCFC; /* Set logo color */
                    margin-right: 50px;
                    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.7); /* Add shadow to the logo */
                }

                h1 {
                    font-size: 1.5rem;
                    margin: 0;
                }

                .filter-container {
                    margin: 20px 0;
                }

                .filter-input {
                    padding: 10px;
                    border: 1px solid #08FCFC;
                    border-radius: 5px;
                    outline: none;
                    width: 300px; /* Set a width for the input */
                    transition: border-color 0.3s;
                }

                .filter-input:focus {
                    border-color: #00eaff; /* Change border color on focus */
                }

                .form-container {
                    margin: 20px 0;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                }

                .form-container input {
                    margin: 5px;
                    padding: 10px;
                    border: 1px solid #08FCFC;
                    border-radius: 5px;
                    outline: none;
                    width: 300px; /* Set a width for the input */
                    transition: border-color 0.3s;
                }

                .form-container button {
                    margin: 5px;
                    padding: 10px 15px;
                    background-color: #08FCFC;
                    border: none;
                    border-radius: 5px;
                    color: white;
                    cursor: pointer;
                    transition: background-color 0.3s;
                }

                .form-container button:hover {
                    background-color: #00eaff; /* Darker shade on hover */
                }

                .table-container {
                    width: 100%; /* Make table container full width */
                    max-width: 1500px; /* Adjusted max width */
                    background: #3c3c3c;
                    border-radius: 10px;
                    overflow: hidden;
                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
                }

                .data-table {
                    width: 100%; /* Table stretches to full width */
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

                .data-table th {
                    font-weight: bold;
                }

                .data-table td {
                    font-size: 0.9rem;
                }

                /* Media Queries for Responsiveness */
                @media (max-width: 600px) {
                    .header {
                        flex-direction: column; /* Stack items on smaller screens */
                        align-items: flex-start; /* Align to the start */
                        padding: 15px; /* Adjust padding */
                    }

                    .logo {
                        font-size: 2rem; /* Reduce logo size */
                    }

                    h1 {
                        font-size: 1.25rem; /* Adjust header size */
                    }

                    .filter-input {
                        width: 100%; /* Full width on small screens */
                    }

                    .form-container input {
                        width: 100%; /* Full width on small screens */
                    }

                    .form-container button {
                        width: 100%; /* Full width for buttons */
                    }
                }
            `}</style>
        </div>
    );
};

export default Dashboard;
