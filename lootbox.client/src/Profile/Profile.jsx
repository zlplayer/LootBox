/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Hook do nawigacji

function Profile() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const userId = localStorage.getItem('id');  // ID u¿ytkownika z localStorage
    const token = localStorage.getItem('token');  // Token JWT
    const navigate = useNavigate(); // Inicjalizowanie hooka nawigacji

    useEffect(() => {
        // SprawdŸ, czy token i userId s¹ dostêpne
        if (!token || !userId) {
            setError('No token or user ID found');
            setLoading(false);
            return;
        }

        // Wykonaj zapytanie o dane u¿ytkownika
        const fetchUserData = async () => {
            try {
                const response = await fetch(`/api/account/user/${userId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,  // Dodaj token w nag³ówku
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch user data');
                }

                const data = await response.json();
                setUser(data);  // Zapisz dane u¿ytkownika w stanie
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();  // Wywo³aj funkcjê fetch
    }, [token, userId]);  // Uruchom ponownie, gdy token lub userId siê zmieni

    // Funkcja do usuwania u¿ytkownika
    const handleDeleteAccount = async () => {
        if (!userId || !token) {
            setError('No user ID or token found');
            return;
        }

        try {
            const response = await fetch(`/api/account/${userId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to delete user account');
            }

            // Usuñ dane z localStorage
            localStorage.removeItem('token');
            localStorage.removeItem('id');
            localStorage.removeItem('userName');
            localStorage.removeItem('userRole');

            // Przekierowanie na stronê logowania po usuniêciu konta
            navigate('/login');
        } catch (error) {
            setError(error.message);
        }
    };

    const handleChangePassword = async () => {
        navigate('/change-password');
    }

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>Error: {error}</p>;
    }

    return (
        <div className="profile-container">
            <h2>Profile</h2>
            {user ? (
                <div className="profile-info">
                    <p><strong>Username:</strong> {user.userName}</p>
                    <p><strong>Email:</strong> {user.email}</p>
                    <p><strong>Password:</strong> ********* <button onClick={handleChangePassword }>Change Password</button></p>
                    {/* Przycisk do usuwania konta */}
                    <button onClick={handleDeleteAccount} className="delete-button">
                        Delete Account
                    </button>
                </div>
            ) : (
                <p>No user data available</p>
            )}
        </div>
    );
}

export default Profile;
