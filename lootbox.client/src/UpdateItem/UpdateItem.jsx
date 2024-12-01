import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

function UpdateItem() {
    const { itemid } = useParams();
    const navigate = useNavigate();

    // Stan dla formularza
    const [name, setName] = useState("");
    const [imageFile, setImageFile] = useState(null);
    const [price, setPrice] = useState("");
    const [rarityId, setRarityId] = useState("");
    const [typeItemId, setTypeItemId] = useState("");
    const [wearRatingId, setWearRatingId] = useState("");

    // Dodatkowe dane do wyświetlenia
    const [rarities, setRarities] = useState([]);
    const [typeItems, setTypeItems] = useState([]);
    const [wearRatings, setWearRatings] = useState([]);

    // Dodatkowe stany dla domyślnych nazw
    const [currentRarity, setCurrentRarity] = useState("");
    const [currentTypeItem, setCurrentTypeItem] = useState("");
    const [currentWearRating, setCurrentWearRating] = useState("");

    useEffect(() => {
        // Pobierz szczegóły przedmiotu
        fetchItemDetails();
        // Pobierz dane pomocnicze
        fetchRarities();
        fetchTypeItems();
        fetchWearRatings();
    }, [itemid]);

    const fetchItemDetails = async () => {
        try {
            const response = await axios.get(`/api/item/${itemid}`);
            const item = response.data;

            setName(item.name);
            setPrice(item.price);
            setImageFile(item.image); // URL obrazu
            setCurrentRarity(item.rarityColor);
            setCurrentTypeItem(item.typeItemName);
            setCurrentWearRating(item.wearRatingName);

            // Wyszukaj odpowiadające ID na podstawie nazw
            const rarity = rarities.find((r) => r.name === item.rarityColor);
            const typeItem = typeItems.find((t) => t.name === item.typeItemName);
            const wearRating = wearRatings.find((w) => w.name === item.wearRatingName);

            if (rarity) setRarityId(rarity.id);
            if (typeItem) setTypeItemId(typeItem.id);
            if (wearRating) setWearRatingId(wearRating.id);
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

    const handleUpdate = async (event) => {
        event.preventDefault();

        if (!name || !price || !rarityId || !typeItemId || !wearRatingId) {
            alert("Wszystkie pola są wymagane.");
            return;
        }

        const formData = new FormData();
        formData.append("Id", itemid);
        formData.append("Name", name);
        if (imageFile instanceof File) {
            formData.append("ImageFile", imageFile);
        }
        formData.append("Price", price);
        formData.append("RarityId", rarityId);
        formData.append("TypeItemId", typeItemId);
        formData.append("WearRatingId", wearRatingId);

        try {
            const response = await axios.put(`/api/item/${itemid}`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            if (response.status === 200) {
                alert("Przedmiot został zaktualizowany.");
                navigate("/items");
            }
        } catch (error) {
            console.error("Error updating item:", error);
            alert("Nie udało się zaktualizować przedmiotu.");
        }
    };

    return (
        <div>
            <h2>Aktualizuj przedmiot</h2>
            <form onSubmit={handleUpdate}>
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
                        Obraz:
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setImageFile(e.target.files[0])}
                        />
                    </label>
                    {imageFile && !(imageFile instanceof File) && (
                        <p>
                            Aktualny obraz:{" "}
                            <img
                                src={imageFile}
                                alt="Aktualny obraz"
                                style={{ maxWidth: "200px" }}
                            />
                        </p>
                    )}
                </div>
                <div>
                    <label>
                        Cena:
                        <input
                            type="number"
                            step="0.01"
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
                            <option value="">{currentRarity || "-- Wybierz rzadkość --"}</option>
                            {rarities.map((rarity) => (
                                <option key={rarity.id} value={rarity.id}>
                                    {rarity.color}
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
                            <option value="">{currentTypeItem || "-- Wybierz typ --"}</option>
                            {typeItems.map((type) => (
                                <option key={type.id} value={type.id}>
                                    {type.name}
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
                            <option value="">{currentWearRating || "-- Wybierz wear rating --"}</option>
                            {wearRatings.map((rating) => (
                                <option key={rating.id} value={rating.id}>
                                    {rating.name}
                                </option>
                            ))}
                        </select>
                    </label>
                </div>
                <button type="submit">Zaktualizuj przedmiot</button>
                <button type="button" onClick={() => navigate("/items")}>
                    Anuluj
                </button>
            </form>
        </div>
    );
}

export default UpdateItem;
