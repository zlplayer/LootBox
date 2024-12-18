import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

function ChangePassword() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const userId = localStorage.getItem('id'); // Pobranie ID użytkownika
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setError('Hasła nie są takie same.');
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const response = await fetch(`/api/account/changePassword/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          newPassword,
          confirmPassword,
        }),
      });

      if (!response.ok) {
        throw new Error('Nie udało się zmienić hasła.');
      }

      alert('Hasło zostało zmienione pomyślnie.');
      navigate('/'); // Przekierowanie do strony głównej lub logowania
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded-lg shadow-sm bg-background">
      <h2 className="text-2xl font-semibold text-center mb-6">Zmień hasło</h2>
      {error && <div className="text-red-500 mb-4 text-center">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="newPassword">Nowe hasło</Label>
          <Input
            id="newPassword"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Wprowadź nowe hasło"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Potwierdź hasło</Label>
          <Input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Powtórz nowe hasło"
            required
          />
        </div>
        <div className="flex justify-end gap-4">
          <Button type="button" variant="secondary" onClick={() => navigate('/')}>
            Anuluj
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? 'Zmiana hasła...' : 'Zmień hasło'}
          </Button>
        </div>
      </form>
    </div>
  );
}

export default ChangePassword;
