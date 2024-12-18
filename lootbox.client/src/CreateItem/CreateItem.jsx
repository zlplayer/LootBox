import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectValue,
  SelectGroup,
} from '@/components/ui/select';
import axios from 'axios';

function CreateItem({ onClose, onSuccess }) {
  const [name, setName] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [price, setPrice] = useState('');
  const [rarityId, setRarityId] = useState('');
  const [typeItemId, setTypeItemId] = useState('');
  const [wearRatingId, setWearRatingId] = useState('');

  const [rarities, setRarities] = useState([]);
  const [typeItems, setTypeItems] = useState([]);
  const [wearRatings, setWearRatings] = useState([]);

  useEffect(() => {
    fetchRarities();
    fetchTypeItems();
    fetchWearRatings();
  }, []);

  const fetchRarities = async () => {
    try {
      const response = await axios.get('/api/rarity');
      setRarities(response.data);
    } catch (error) {
      console.error('Nie udało się pobrać rzadkości:', error);
      alert('Nie udało się załadować rzadkości.');
    }
  };

  const fetchTypeItems = async () => {
    try {
      const response = await axios.get('/api/typeItem');
      setTypeItems(response.data);
    } catch (error) {
      console.error('Nie udało się pobrać typów przedmiotów:', error);
      alert('Nie udało się załadować typów przedmiotów.');
    }
  };

  const fetchWearRatings = async () => {
    try {
      const response = await axios.get('/api/wearRating');
      setWearRatings(response.data);
    } catch (error) {
      console.error('Nie udało się pobrać stanów zużycia:', error);
      alert('Nie udało się załadować stanów zużycia.');
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!name || !price || !rarityId || !typeItemId || !wearRatingId) {
      alert('Wszystkie pola są wymagane.');
      return;
    }

    const formData = new FormData();
    formData.append('Name', name);
    if (imageFile) {
      formData.append('ImageFile', imageFile);
    }
    formData.append('Price', price);
    formData.append('RarityId', rarityId);
    formData.append('TypeItemId', typeItemId);
    formData.append('WearRatingId', wearRatingId);

    try {
      const response = await axios.post('/api/item', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (response.status === 200) {
        setName('');
        setImageFile(null);
        setPrice('');
        setRarityId('');
        setTypeItemId('');
        setWearRatingId('');
        onSuccess();
        onClose();
      }
    } catch (error) {
      console.error('Błąd podczas tworzenia przedmiotu:', error);
      alert('Nie udało się utworzyć przedmiotu.');
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
          placeholder="Wpisz nazwę przedmiotu"
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
          placeholder="Wpisz cenę przedmiotu"
          required
        />
      </div>

      {/* Rzadkość */}
      <div className="space-y-2">
        <Label htmlFor="rarity">Rzadkość</Label>
        <Select value={rarityId} onValueChange={setRarityId} required>
          <SelectTrigger id="rarity">
            <SelectValue placeholder="Wybierz rzadkość" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Rzadkość</SelectLabel>
              {rarities.map((rarity) => (
                <SelectItem key={rarity.id} value={String(rarity.id)}>
                  {rarity.color}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      {/* Typ przedmiotu */}
      <div className="space-y-2">
        <Label htmlFor="typeItem">Typ przedmiotu</Label>
        <Select value={typeItemId} onValueChange={setTypeItemId} required>
          <SelectTrigger id="typeItem">
            <SelectValue placeholder="Wybierz typ przedmiotu" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Typ przedmiotu</SelectLabel>
              {typeItems.map((typeItem) => (
                <SelectItem key={typeItem.id} value={String(typeItem.id)}>
                  {typeItem.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      {/* Stan zużycia */}
      <div className="space-y-2">
        <Label htmlFor="wearRating">Stan zużycia</Label>
        <Select value={wearRatingId} onValueChange={setWearRatingId} required>
          <SelectTrigger id="wearRating">
            <SelectValue placeholder="Wybierz stan zużycia" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Stan zużycia</SelectLabel>
              {wearRatings.map((rating) => (
                <SelectItem key={rating.id} value={String(rating.id)}>
                  {rating.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      {/* Przyciski */}
      <div className="flex justify-end gap-4">
        <Button type="button" variant="secondary" onClick={onClose}>
          Anuluj
        </Button>
        <Button type="submit" variant="primary">
          Stwórz przedmiot
        </Button>
      </div>
    </form>
  );
}

export default CreateItem;
