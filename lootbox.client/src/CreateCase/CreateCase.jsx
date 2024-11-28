
// eslint-disable-next-line no-unused-vars
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function CreateCase() {
    const [name, setName] = useState("");
    const [imageFile, setImageFile] = useState(null);
    const [price, setPrice] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!name || !price) {
            alert("Name and Price are required.");
            return;
        }

        const formData = new FormData();
        formData.append("Name", name);
        if (imageFile) {
            formData.append("ImageFile", imageFile);
        }
        formData.append("Price", price);

        try {
            const response = await axios.post("/api/case", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            if (response.status === 200) {
                console.log("Case created successfully!");
                // Optional: reset form
                setName("");
                setImageFile(null);
                setPrice("");
                navigate("/");
            }
        } catch (error) {
            console.error("Error creating case:", error);
            alert("Failed to create case. Please try again.");
        }
    };

    return (
        <div>
            <h2>Create a New Case</h2>
            <form onSubmit={handleSubmit}>
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
                <button type="submit">Create Case</button>
            </form>
        </div>
    );
}

export default CreateCase;
