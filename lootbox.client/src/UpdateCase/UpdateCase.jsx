/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

function UpdateCase() {
    const { caseid } = useParams(); // Pobiera ID skrzynki z URL-a
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [imageFile, setImageFile] = useState(null);
    const [price, setPrice] = useState("");

    useEffect(() => {
        // Pobranie danych skrzynki z API i wype�nienie p�l formularza
        const fetchCaseDetails = async () => {
            try {
                const response = await axios.get(`/api/case/${caseid}`);
                const { name, price, image } = response.data;
                setName(name);
                setPrice(price);
                setImageFile(image); // Zak�adam, �e API zwraca obraz jako URL
            } catch (error) {
                console.error("Failed to fetch case details:", error);
                alert("Failed to load case details. Please try again.");
            }
        };

        fetchCaseDetails();
    }, [caseid]);

    const handleUpdate = async (event) => {
        event.preventDefault();

        if (!name || !price) {
            alert("Name and Price are required.");
            return;
        }

        const formData = new FormData();
        formData.append("Name", name);
        if (imageFile instanceof File) {
            formData.append("ImageFile", imageFile);
        }
        formData.append("Price", price);

        try {
            const response = await axios.put(`/api/case/${caseid}`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            if (response.status === 200) {
                alert("Case updated successfully!");
                navigate("/"); // Powr�t na stron� g��wn�
            }
        } catch (error) {
            console.error("Error updating case:", error);
            alert("Failed to update case. Please try again.");
        }
    };

    return (
        <div>
            <h2>Update Case</h2>
            <form onSubmit={handleUpdate}>
                <div>
                    <label>
                        Name:
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
                        Image File:
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setImageFile(e.target.files[0])}
                        />
                    </label>
                    {imageFile && !(imageFile instanceof File) && (
                        <p>
                            Current Image: <img src={imageFile} alt="Current" style={{ maxWidth: "200px" }} />
                        </p>
                    )}
                </div>
                <div>
                    <label>
                        Price:
                        <input
                            type="number"
                            step="0.01"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            required
                        />
                    </label>
                </div>
                <button type="submit">Update Case</button>
                <button type="button" onClick={() => navigate("/")}>
                    Cancel
                </button>
            </form>
        </div>
    );
}

export default UpdateCase;
