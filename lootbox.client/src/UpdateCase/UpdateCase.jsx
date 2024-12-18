import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import axios from "axios";

function UpdateCase({ caseId, onClose, onSuccess }) {
  const [name, setName] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [price, setPrice] = useState("");

  useEffect(() => {
    const fetchCaseDetails = async () => {
      try {
        const response = await axios.get(`/api/case/${caseId}`);
        const { name, price, image } = response.data;
        setName(name);
        setPrice(price);
        setImageFile(image); 
      } catch (error) {
        console.error("Nie udało się pobrać szczegółów skrzynki:", error);
        alert("Nie udało się załadować szczegółów skrzynki. Spróbuj ponownie.");
      }
    };

    fetchCaseDetails();
  }, [caseId]);

  const handleUpdate = async (event) => {
    event.preventDefault();

    if (!name || !price) {
      alert("Nazwa i cena są wymagane.");
      return;
    }

    const formData = new FormData();
    formData.append("Name", name);

    if (imageFile instanceof File) {
      formData.append("ImageFile", imageFile);
    } else if (typeof imageFile === "string") {
      formData.append("ImageBase64", imageFile);
    }

    formData.append("Price", price);

    try {
      const response = await axios.put(`/api/case/${caseId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 200) {
        alert("Skrzynka została zaktualizowana pomyślnie!");
        onSuccess(); 
        onClose(); 
      }
    } catch (error) {
      console.error("Błąd podczas aktualizacji skrzynki:", error);
      alert("Nie udało się zaktualizować skrzynki. Spróbuj ponownie.");
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
          placeholder="Wprowadź nazwę skrzynki"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="image">Plik graficzny</Label>
        <Input
          id="image"
          type="file"
          accept="image/*"
          onChange={(e) => setImageFile(e.target.files[0])}
        />
        {imageFile && !(imageFile instanceof File) && (
          <p>
            Obecny obraz:
            <img
              src={`data:image/png;base64,${imageFile}`}
              alt="Obecny"
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
          placeholder="Wprowadź cenę skrzynki"
          required
        />
      </div>
      <div className="flex justify-end gap-4">
        <Button type="button" variant="secondary" onClick={onClose}>
          Anuluj
        </Button>
        <Button type="submit" variant="primary">
          Zaktualizuj skrzynkę
        </Button>
      </div>
    </form>
  );
}

export default UpdateCase;
