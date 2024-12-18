import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import axios from 'axios';

function CreateCase({ onClose, onSuccess }) {
  const [name, setName] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [price, setPrice] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!name || !price) {
      alert('Nazwa i cena są wymagane.');
      return;
    }

    const formData = new FormData();
    formData.append('Name', name);
    if (imageFile) {
      formData.append('ImageFile', imageFile);
    }
    formData.append('Price', price);

    try {
      const response = await axios.post('/api/case', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 200) {
        console.log('Skrzynka została utworzona pomyślnie!');
        setName('');
        setImageFile(null);
        setPrice('');
        onSuccess(); // Odśwież listę skrzynek
        onClose(); // Zamknij okno dialogowe
      }
    } catch (error) {
      console.error('Błąd podczas tworzenia skrzynki:', error);
      alert('Nie udało się utworzyć skrzynki. Spróbuj ponownie.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Nazwa */}
      <div className="space-y-2">
        <Label htmlFor="name">Nazwa</Label>
        <Input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Wprowadź nazwę skrzynki"
          required
        />
      </div>

      {/* Plik obrazu */}
      <div className="space-y-2">
        <Label htmlFor="image">Plik obrazu</Label>
        <Input
          id="image"
          type="file"
          accept="image/*"
          onChange={(e) => setImageFile(e.target.files[0])}
        />
      </div>

      {/* Cena */}
      <div className="space-y-2">
        <Label htmlFor="price">Cena</Label>
        <Input
          id="price"
          type="number"
          step="0.01"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="Wprowadź cenę skrzynki"
          required
        />
      </div>

      {/* Przyciski */}
      <div className="flex justify-end gap-4">
        <Button type="button" variant="secondary" onClick={onClose}>
          Anuluj
        </Button>
        <Button type="submit" variant="primary">
          Stwórz skrzynkę
        </Button>
      </div>
    </form>
  );
}

export default CreateCase;
