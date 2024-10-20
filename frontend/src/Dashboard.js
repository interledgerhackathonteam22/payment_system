import React, { useEffect, useState } from 'react';

const Dashboard = () => {
    const [data, setData] = useState([]);
    const [filter, setFilter] = useState('');
    const [editMode, setEditMode] = useState(false);
    const [currentEntry, setCurrentEntry] = useState({}); // For editing
    const [newEntry, setNewEntry] = useState({ firstName: '', lastName: '', price: '', time: '', description: '' });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/data'); // Update with your API endpoint
                const result = await response.json();
                setData(result);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, []);

    const handleAddEntry = async () => {
        const response = await fetch('http://localhost:5000/api/data', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newEntry)
        });
        const addedEntry = await response.json();
        setData([...data, addedEntry]);
        setNewEntry({ firstName: '', lastName: '', price: '', time: '', description: '' }); // Reset the form
    };

    const handleEditEntry = async () => {
        const response = await fetch(`http://localhost:5000/api/data/${currentEntry.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(currentEntry)
        });
        const updatedEntry = await response.json();
        setData(data.map(entry => (entry.id === updatedEntry.id ? updatedEntry : entry)));
        setEditMode(false);
        setCurrentEntry({});
    };

    const handleDeleteEntry = async (id) => {
        await fetch(`http://localhost:5000/api/data/${id}`, {
            method: 'DELETE'
        });
        setData(data.filter(entry => entry.id !== id));
    };

    const handleEditClick = (entry) => {
        setEditMode(true);
        setCurrentEntry(entry);
    };

    const filteredData = data.filter(entry =>
        `${entry.firstName} ${entry.lastName}`.toLowerCase().includes(filter.toLowerCase())
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

            {/* New Entry Form */}
            <div className="form-container">
                <h2>{editMode ? 'Edit Entry' : 'Add New Entry'}</h2>
                <input
                    type="text"
                    placeholder="First Name"
                    value={editMode ? currentEntry.firstName : newEntry.firstName}
                    onChange={e => editMode ? setCurrentEntry({ ...currentEntry, firstName: e.target.value }) : setNewEntry({ ...newEntry, firstName: e.target.value })}
                />
                <input
                    type="text"
                    placeholder="Last Name"
                    value={editMode ? currentEntry.lastName : newEntry.lastName}
                    onChange={e => editMode ? setCurrentEntry({ ...currentEntry, lastName: e.target.value }) : setNewEntry({ ...newEntry, lastName: e.target.value })}
                />
                <input
                    type="number"
                    placeholder="Price (R)"
                    value={editMode ? currentEntry.price : newEntry.price}
                    onChange={e => editMode ? setCurrentEntry({ ...currentEntry, price: e.target.value }) : setNewEntry({ ...newEntry, price: e.target.value })}
                />
                <input
                    type="number"
                    placeholder="Time (hrs)"
                    value={editMode ? currentEntry.time : newEntry.time}
                    onChange={e => editMode ? setCurrentEntry({ ...currentEntry, time: e.target.value }) : setNewEntry({ ...newEntry, time: e.target.value })}
                />
                <input
                    type="text"
                    placeholder="Description"
                    value={editMode ? currentEntry.description : newEntry.description}
                    onChange={e => editMode ? setCurrentEntry({ ...currentEntry, description: e.target.value }) : setNewEntry({ ...newEntry, description: e.target.value })}
                />
                <button onClick={editMode ? handleEditEntry : handleAddEntry}>{editMode ? 'Update Entry' : 'Add Entry'}</button>
                {editMode && <button onClick={() => { setEditMode(false); setCurrentEntry({}); }}>Cancel</button>}
            </div>

            <div className="table-container">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Price (R)</th>
                            <th>Time (hrs)</th>
                            <th>Description</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredData.length > 0 ? (
                            filteredData.map((entry, index) => (
                                <tr key={index}>
                                    <td>{entry.firstName} {entry.lastName}</td>
                                    <td>{entry.price.toFixed(2)}</td>
                                    <td>{entry.time}</td>
                                    <td>{entry.description}</td>
                                    <td>
                                        <button onClick={() => handleEditClick(entry)}>Edit</button>
                                        <button onClick={() => handleDeleteEntry(entry.id)}>Delete</button>
                                    </td>
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
