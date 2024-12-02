/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function ChangePassword() {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const userId = localStorage.getItem('id'); // Pobranie id u¿ytkownika z localStorage
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Sprawdzenie, czy has³a siê zgadzaj¹
        if (newPassword !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setError(null); // Czyszczenie b³êdów
        setLoading(true); // Ustawienie stanu ³adowania

        try {
            // Wys³anie zapytania PUT do API
            const response = await fetch(`/api/account/changePassword/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    newPassword,
                    confirmPassword
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to change password');
            }

            // Jeœli wszystko posz³o pomyœlnie
            alert('Password changed successfully');
            navigate('/'); // Mo¿esz przekierowaæ na stronê logowania lub inn¹ stronê
        } catch (error) {
            // Obs³uga b³êdów
            setError(error.message);
        } finally {
            setLoading(false); // Koñczenie ³adowania
        }
    };

    return (
        <div className="change-password-container">
            <h2>Change Password</h2>
            {error && <div className="error">{error}</div>} {/* Wyœwietlanie b³êdów */}
            <form onSubmit={handleSubmit} className="change-password-form">
                <div className="form-group">
                    <label htmlFor="newPassword">New Password</label>
                    <input
                        type="password"
                        id="newPassword"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="confirmPassword">Confirm Password</label>
                    <input
                        type="password"
                        id="confirmPassword"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                </div>
                <div className="form-actions">
                    <button type="submit" disabled={loading}>
                        {loading ? 'Changing password...' : 'Change Password'}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default ChangePassword;
