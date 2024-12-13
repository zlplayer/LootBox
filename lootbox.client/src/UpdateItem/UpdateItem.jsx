import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectTrigger, 
  SelectContent, 
  SelectLabel, 
  SelectItem, 
  SelectValue,
  SelectGroup
} from "@/components/ui/select";
import { useParams } from "react-router-dom";
import axios from "axios";

function UpdateItem({ itemId, onClose, onSuccess }) {
  const [name, setName] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [price, setPrice] = useState("");
  const [rarityId, setRarityId] = useState("");
  const [typeItemId, setTypeItemId] = useState("");
  const [wearRatingId, setWearRatingId] = useState("");

  // Dane do selectów
  const [rarities, setRarities] = useState([]);
  const [typeItems, setTypeItems] = useState([]);
  const [wearRatings, setWearRatings] = useState([]);

  const [currentImageBase64, setCurrentImageBase64] = useState(null);

  useEffect(() => {
    fetchItemDetails();
    fetchRarities();
    fetchTypeItems();
    fetchWearRatings();
  }, [itemId]);

  const fetchItemDetails = async () => {
    try {
      const response = await axios.get(`/api/item/${itemId}`);
      const item = response.data;

      setName(item.name);
      setPrice(item.price);
      
      // Zakładamy, że image to Base64
      setCurrentImageBase64(item.image);

    } catch (error) {
      console.error("Error fetching item details:", error);
      alert("Nie udało się załadować szczegółów przedmiotu.");
    }
  };

  const fetchRarities = async () => {
    try {
      const response = await axios.get("/api/rarity");
      setRarities(response.data);
    } catch (error) {
      console.error("Error fetching rarities:", error);
      alert("Nie udało się załadować rzadkości.");
    }
  };

  const fetchTypeItems = async () => {
    try {
      const response = await axios.get("/api/typeItem");
      setTypeItems(response.data);
    } catch (error) {
      console.error("Error fetching type items:", error);
      alert("Nie udało się załadować typów.");
    }
  };

  const fetchWearRatings = async () => {
    try {
      const response = await axios.get("/api/wearRating");
      setWearRatings(response.data);
    } catch (error) {
      console.error("Error fetching wear ratings:", error);
      alert("Nie udało się załadować wear ratings.");
    }
  };

  // Gdy rarities, typeItems i wearRatings oraz item zostaną pobrane, ustawiamy ID na podstawie wartości
  useEffect(() => {
    const setDefaultIds = async () => {
      try {
        const itemResponse = await axios.get(`/api/item/${itemId}`);
        const itemData = itemResponse.data;

        const rarity = rarities.find((r) => r.color === itemData.rarityColor);
        const typeItem = typeItems.find((t) => t.name === itemData.typeItemName);
        const wearRating = wearRatings.find((w) => w.name === itemData.wearRatingName);

        if (rarity) setRarityId(rarity.id);
        if (typeItem) setTypeItemId(typeItem.id);
        if (wearRating) setWearRatingId(wearRating.id);
      } catch (error) {
        console.error("Error setting default IDs:", error);
      }
    };

    if (rarities.length > 0 && typeItems.length > 0 && wearRatings.length > 0) {
      setDefaultIds();
    }
  }, [rarities, typeItems, wearRatings, itemId]);

  const handleUpdate = async (event) => {
    event.preventDefault();

    if (!name || !price || !rarityId || !typeItemId || !wearRatingId) {
      alert("Wszystkie pola są wymagane. 😅");
      return;
    }

    const formData = new FormData();
    formData.append("Id", itemId);
    formData.append("Name", name);
    if (imageFile instanceof File) {
      formData.append("ImageFile", imageFile);
    } else if (typeof currentImageBase64 === "string" && !imageFile) {
      formData.append("ImageBase64", currentImageBase64);
    }
    formData.append("Price", price);
    formData.append("RarityId", rarityId);
    formData.append("TypeItemId", typeItemId);
    formData.append("WearRatingId", wearRatingId);

    try {
      const response = await axios.put(`/api/item/${itemId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (response.status === 200) {
        alert("Przedmiot zaktualizowany pomyślnie! 🎉");
        onSuccess();
        onClose();
      }
    } catch (error) {
      console.error("Error updating item:", error);
      alert("Nie udało się zaktualizować przedmiotu. 😥");
    }
  };

  return (
    <form onSubmit={handleUpdate} className="space-y-4">
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
        <Label htmlFor="image">Obraz</Label>
        <Input
          id="image"
          type="file"
          accept="image/*"
          onChange={(e) => setImageFile(e.target.files[0])}
        />
        {currentImageBase64 && !imageFile && (
          <p>
            Aktualny Obraz:
            <img
              src={`data:image/png;base64,${currentImageBase64}`}
              alt="Current"
              className="max-w-xs mt-2 w-40 h-40 object-contain"
            />
          </p>
        )}
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
              {typeItems.map((type) => (
                <SelectItem key={type.id} value={String(type.id)}>
                  {type.name}
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

      <div className="flex justify-end gap-4 mt-4">
        <Button type="button" variant="secondary" onClick={onClose}>
          Anuluj
        </Button>
        <Button type="submit" variant="primary">
          Zaktualizuj
        </Button>
      </div>
    </form>
  );
}

export default UpdateItem;
