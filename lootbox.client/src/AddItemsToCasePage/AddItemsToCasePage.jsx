import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

import {
  Card, CardHeader, CardTitle, CardContent, CardFooter
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Tooltip, TooltipProvider, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import {
  Select, SelectTrigger, SelectContent, SelectLabel, SelectItem, SelectValue, SelectGroup
} from '@/components/ui/select';

function AddItemsToCasePage() {
  const { caseId } = useParams();
  const navigate = useNavigate();
  const userRole = localStorage.getItem("userRole");
  const token = localStorage.getItem("token");

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedItemId, setSelectedItemId] = useState("");
  const [selectedItems, setSelectedItems] = useState([]);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    if (userRole !== 'Admin') {
      alert("Brak uprawnień. Przekierowanie...");
      navigate("/");
    }
  }, [userRole, navigate]);

  useEffect(() => {
    const fetchAllItems = async () => {
      try {
        const response = await axios.get('/api/item', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        setItems(response.data);
      } catch (err) {
        console.error('Failed to fetch items:', err);
        setError("Nie udało się pobrać listy przedmiotów.");
      } finally {
        setLoading(false);
      }
    };
    fetchAllItems();
  }, [token]);

  const handleAddSelectedItem = () => {
    if (!selectedItemId) return;

    const itemToAdd = items.find(it => String(it.id) === selectedItemId);
    if (itemToAdd && !selectedItems.find(si => si.id === itemToAdd.id)) {
      setSelectedItems([...selectedItems, itemToAdd]);
    }
  };

  const handleRemoveSelectedItem = (itemId) => {
    setSelectedItems(selectedItems.filter(item => item.id !== itemId));
  };

  const handleAddAllToCase = async () => {
    if (selectedItems.length === 0) return;
    setIsAdding(true);
    try {
      for (const it of selectedItems) {
        await axios.post(`/api/case/${caseId}/item/${it.id}`, {}, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
      }
      setSelectedItems([]);
      setSelectedItemId("");
    } catch (err) {
      console.error('Error adding items to case:', err);
      alert("Nie udało się dodać przedmiotów do skrzynki.");
    } finally {
      setIsAdding(false);
    }
  };

  if (loading) {
    return <p className="p-8">Ładowanie przedmiotów...</p>;
  }

  if (error) {
    return <p className="p-8 text-red-500">{error}</p>;
  }

  return (
    <TooltipProvider>
      <div className="min-h-screen w-full p-8 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Dodaj przedmioty do skrzynki</h1>
          <Button variant="secondary" onClick={() => navigate(-1)}>Powrót</Button>
        </div>

        {/* Wybór przedmiotu */}
        <div className="flex items-center space-x-4">
          <Select value={selectedItemId} onValueChange={val => setSelectedItemId(val)}>
            <SelectTrigger className="w-[300px]">
              <SelectValue placeholder="Wybierz przedmiot" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Przedmioty</SelectLabel>
                {items.map(it => (
                  <SelectItem key={it.id} value={String(it.id)}>
                    {it.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <Button onClick={handleAddSelectedItem} disabled={!selectedItemId}>
            Dodaj do listy
          </Button>
        </div>

        {/* Wybrane przedmioty */}
        {selectedItems.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Wybrane przedmioty</h2>
            <div className="grid grid-cols-5 gap-6">
              {selectedItems.map(item => (
                <Card
                  key={item.id}
                  style={{
                    border: `3px solid ${item.rarityColor}`,
                    boxShadow: `0 0 15px ${item.rarityColor}`
                  }}
                >
                  <CardHeader className="text-center">
                    <CardTitle>{item.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <AspectRatio ratio={1 / 1} className="rounded-lg overflow-hidden">
                      <img
                        src={`data:image/png;base64,${item.image}`}
                        alt={item.name}
                        className="object-cover w-full h-full"
                      />
                    </AspectRatio>
                    <Separator className="my-2" />
                    <div className="flex flex-col items-center">
                      <p className="text-sm font-semibold">{item.price} zł</p>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-center mt-2">
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleRemoveSelectedItem(item.id)}
                    >
                      Usuń
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
            <div className="mt-6 flex justify-end">
              <Button onClick={handleAddAllToCase} disabled={isAdding}>
                {isAdding ? "Dodawanie..." : "Dodaj do skrzynki"}
              </Button>
            </div>
          </div>
        )}

        {selectedItems.length === 0 && (
          <p className="text-gray-500">Brak wybranych przedmiotów.</p>
        )}
      </div>
    </TooltipProvider>
  );
}

export default AddItemsToCasePage;
