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
      console.error('Failed to fetch rarities:', error);
      alert('Nie udało się załadować rzadkości.');
    }
  };

  const fetchTypeItems = async () => {
    try {
      const response = await axios.get('/api/typeItem');
      setTypeItems(response.data);
    } catch (error) {
      console.error('Failed to fetch type items:', error);
      alert('Nie udało się załadować typów.');
    }
  };

  const fetchWearRatings = async () => {
    try {
      const response = await axios.get('/api/wearRating');
      setWearRatings(response.data);
    } catch (error) {
      console.error('Failed to fetch wear ratings:', error);
      alert('Nie udało się załadować wear ratings. ');
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
      console.error('Error creating item:', error);
      alert('Nie udało się utworzyć przedmiotu.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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
      <div className="space-y-2">
        <Label htmlFor="image">Plik obrazu</Label>
        <Input
          id="image"
          type="file"
          accept="image/*"
          onChange={(e) => setImageFile(e.target.files[0])}
        />
      </div>
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
        <Select value={rarityId} onValueChange={(val) => setRarityId(val)} required>
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
        <Select value={typeItemId} onValueChange={(val) => setTypeItemId(val)} required>
          <SelectTrigger id="typeItem">
            <SelectValue placeholder="Wybierz typ" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Typy</SelectLabel>
              {typeItems.map((typeItem) => (
                <SelectItem key={typeItem.id} value={String(typeItem.id)}>
                  {typeItem.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      {/* Wear Rating */}
      <div className="space-y-2">
        <Label htmlFor="wearRating">Wear Rating</Label>
        <Select value={wearRatingId} onValueChange={(val) => setWearRatingId(val)} required>
          <SelectTrigger id="wearRating">
            <SelectValue placeholder="Wybierz wear rating" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Wear Ratings</SelectLabel>
              {wearRatings.map((rating) => (
                <SelectItem key={rating.id} value={String(rating.id)}>
                  {rating.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

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
