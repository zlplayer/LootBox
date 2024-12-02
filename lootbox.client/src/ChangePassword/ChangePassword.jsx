/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function ChangePassword() {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const userId = localStorage.getItem('id'); // Pobranie id u�ytkownika z localStorage
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Sprawdzenie, czy has�a si� zgadzaj�
        if (newPassword !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setError(null); // Czyszczenie b��d�w
        setLoading(true); // Ustawienie stanu �adowania

        try {
            // Wys�anie zapytania PUT do API
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

            // Je�li wszystko posz�o pomy�lnie
            alert('Password changed successfully');
            navigate('/'); // Mo�esz przekierowa� na stron� logowania lub inn� stron�
        } catch (error) {
            // Obs�uga b��d�w
            setError(error.message);
        } finally {
            setLoading(false); // Ko�czenie �adowania
        }
    };

    return (
        <div className="change-password-container">
            <h2>Change Password</h2>
            {error && <div className="error">{error}</div>} {/* Wy�wietlanie b��d�w */}
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
