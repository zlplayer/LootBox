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
        console.error("Failed to fetch case details:", error);
        alert("Failed to load case details. Please try again.");
      }
    };

    fetchCaseDetails();
  }, [caseId]);

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
        alert("Case updated successfully!");
        onSuccess(); 
        onClose(); 
      }
    } catch (error) {
      console.error("Error updating case:", error);
      alert("Failed to update case. Please try again.");
    }
  };

  return (
    <form onSubmit={handleUpdate} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter case name"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="image">Image File</Label>
        <Input
          id="image"
          type="file"
          accept="image/*"
          onChange={(e) => setImageFile(e.target.files[0])}
        />
        {imageFile && !(imageFile instanceof File) && (
          <p>
            Current Image:
            <img
              src={`data:image/png;base64,${imageFile}`}
              alt="Current"
              className="max-w-xs mt-2 w-40 h-40 object-contain"
            />
          </p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="price">Price</Label>
        <Input
          id="price"
          type="number"
          step="0.01"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="Enter case price"
          required
        />
      </div>
      <div className="flex justify-end gap-4">
        <Button type="button" variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" variant="primary">
          Update Case
        </Button>
      </div>
    </form>
  );
}

export default UpdateCase;
