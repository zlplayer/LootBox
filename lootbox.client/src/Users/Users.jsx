/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Users() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const navigate = useNavigate();

    const token = localStorage.getItem('token');  // Token JWT
    const userRole = localStorage.getItem('userRole');  // Rola u¿ytkownika

    useEffect(() => {
        // Sprawdzenie, czy u¿ytkownik jest administratorem
        if (userRole !== 'Admin') {
            navigate('/'); // Jeœli u¿ytkownik nie jest administratorem, przekieruj go na stronê g³ówn¹
        } else {
            // Wykonaj zapytanie do endpointu /api/account/users, jeœli u¿ytkownik ma rolê admin
            const fetchUsers = async () => {
                try {
                    const response = await fetch('/api/account/users', {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`,  // Przekazanie tokenu w nag³ówku
                        },
                    });

                    if (!response.ok) {
                        throw new Error('Failed to fetch users');
                    }

                    const data = await response.json();
                    setUsers(data);  // Zapisz dane u¿ytkowników w stanie
                } catch (error) {
                    setError(error.message);
                } finally {
                    setLoading(false);
                }
            };

            fetchUsers();  // Wywo³aj funkcjê fetchUsers
        }
    }, [token, userRole, navigate]);

    // Funkcja do usuwania u¿ytkownika
    const handleDeleteUser = async (userId) => {
        if (window.confirm("Are you sure you want to delete this user?")) {
            try {
                const response = await fetch(`/api/account/${userId}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,  // Przekazanie tokenu w nag³ówku
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to delete user');
                }

                // Po usuniêciu u¿ytkownika, zaktualizuj listê u¿ytkowników
                setUsers((prevUsers) => prevUsers.filter(user => user.id !== userId));
                alert('User deleted successfully');
            } catch (error) {
                setError(error.message);
            }
        }
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>Error: {error}</p>;
    }

    return (
        <div>
            <h2>All Users</h2>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>User Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user.id}>
                            <td>{user.id}</td>
                            <td>{user.userName}</td>
                            <td>{user.email}</td>
                            <td>{user.role}</td>
                            <td>
                                <button
                                    className="btn btn-danger"
                                    onClick={() => handleDeleteUser(user.id)}
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default Users;
