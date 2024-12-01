/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function CreateItem() {
    const [name, setName] = useState("");
    const [imageFile, setImageFile] = useState(null);
    const [price, setPrice] = useState("");
    const [rarityId, setRarityId] = useState("");
    const [typeItemId, setTypeItemId] = useState("");
    const [wearRatingId, setWearRatingId] = useState("");

    const [rarities, setRarities] = useState([]);
    const [typeItems, setTypeItems] = useState([]);
    const [wearRatings, setWearRatings] = useState([]);

    const navigate = useNavigate();

    // Pobieranie danych przy załadowaniu komponentu
    useEffect(() => {
        fetchRarities();
        fetchTypeItems();
        fetchWearRatings();
    }, []);

    const fetchRarities = async () => {
        try {
            const response = await fetch("/api/rarity");
            const data = await response.json();
            setRarities(data);
        } catch (error) {
            console.error("Failed to fetch rarities:", error);
            alert("Nie udało się załadować rzadkości.");
        }
    };

    const fetchTypeItems = async () => {
        try {
            const response = await fetch("/api/typeItem");
            const data = await response.json();
            setTypeItems(data);
        } catch (error) {
            console.error("Failed to fetch type items:", error);
            alert("Nie udało się załadować typów.");
        }
    };

    const fetchWearRatings = async () => {
        try {
            const response = await fetch("/api/wearRating");
            const data = await response.json();
            setWearRatings(data);
        } catch (error) {
            console.error("Failed to fetch wear ratings:", error);
            alert("Nie udało się załadować wear ratings.");
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!name || !price || !rarityId || !typeItemId || !wearRatingId) {
            alert("Wszystkie pola są wymagane.");
            return;
        }

        const formData = new FormData();
        formData.append("Name", name);
        if (imageFile) formData.append("ImageFile", imageFile);
        formData.append("Price", price);
        formData.append("RarityId", rarityId);
        formData.append("TypeItemId", typeItemId);
        formData.append("WearRatingId", wearRatingId);

        try {
            const response = await axios.post("/api/item", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            if (response.status === 200) {
                alert("Przedmiot został utworzony.");
                navigate("/items");
            }
        } catch (error) {
            console.error("Error creating item:", error);
            alert("Nie udało się utworzyć przedmiotu.");
        }
    };

    return (
        <div>
            <h2>Stwórz nowy przedmiot</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>
                        Nazwa:
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </label>
                </div>
                <div>
                    <label>
                        Plik obrazu:
                        <input
                            type="file"
                            onChange={(e) => setImageFile(e.target.files[0])}
                        />
                    </label>
                </div>
                <div>
                    <label>
                        Cena:
                        <input
                            type="number"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            required
                        />
                    </label>
                </div>
                <div>
                    <label>
                        Rzadkość:
                        <select
                            value={rarityId}
                            onChange={(e) => setRarityId(e.target.value)}
                            required
                        >
                            <option value="">-- Wybierz rzadkość --</option>
                            {rarities.map((rarity) => (
                                <option key={rarity.id} value={rarity.id}>
                                    {rarity.name}
                                </option>
                            ))}
                        </select>
                    </label>
                </div>
                <div>
                    <label>
                        Typ:
                        <select
                            value={typeItemId}
                            onChange={(e) => setTypeItemId(e.target.value)}
                            required
                        >
                            <option value="">-- Wybierz typ --</option>
                            {typeItems.map((typeItem) => (
                                <option key={typeItem.id} value={typeItem.id}>
                                    {typeItem.name}
                                </option>
                            ))}
                        </select>
                    </label>
                </div>
                <div>
                    <label>
                        Wear Rating:
                        <select
                            value={wearRatingId}
                            onChange={(e) => setWearRatingId(e.target.value)}
                            required
                        >
                            <option value="">-- Wybierz wear rating --</option>
                            {wearRatings.map((wearRating) => (
                                <option key={wearRating.id} value={wearRating.id}>
                                    {wearRating.name}
                                </option>
                            ))}
                        </select>
                    </label>
                </div>
                <button type="submit">Stwórz przedmiot</button>
            </form>
        </div>
    );
}

export default CreateItem;
