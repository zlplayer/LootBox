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
      alert('Name and Price are required.');
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
        console.log('Case created successfully!');
        setName('');
        setImageFile(null);
        setPrice('');
        onSuccess(); // Refresh case list
        onClose(); // Close dialog
      }
    } catch (error) {
      console.error('Error creating case:', error);
      alert('Failed to create case. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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
          Create Case
        </Button>
      </div>
    </form>
  );
}

export default CreateCase;
