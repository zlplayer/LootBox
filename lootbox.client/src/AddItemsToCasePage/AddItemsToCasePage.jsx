import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from "@/components/ui/checkbox"
import { ChevronLeft } from 'lucide-react';
import axios from 'axios';

function AddItemsToCasePage() {
  const { caseId } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const [items, setItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await axios.get('/api/item');
        setItems(response.data);
      } catch (error) {
        console.error('Błąd podczas pobierania przedmiotów:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  const handleItemToggle = (item) => {
    setSelectedItems(prevSelected => {
      if (prevSelected.find(i => i.id === item.id)) {
        return prevSelected.filter(i => i.id !== item.id);
      } else {
        return [...prevSelected, item];
      }
    });
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      for (const item of selectedItems) {
        await axios.post(`/api/case/${caseId}/item/${item.id}`, {
          caseId: caseId,
          itemId: item.id
        }, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
      }
      navigate(`/case/${caseId}/items`);
    } catch (error) {
      console.error('Błąd podczas dodawania przedmiotów:', error);
      alert('Nie udało się dodać wszystkich przedmiotów do skrzynki');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
              onClick={() => navigate(`/case/${caseId}/items`)}
            >
              <ChevronLeft className="w-4 h-4" />
              Powrót do skrzynki
            </Button>
            <h1 className="text-2xl font-bold">Dodaj przedmioty do skrzynki</h1>
          </div>
          <Button
            onClick={handleSubmit}
            disabled={selectedItems.length === 0 || submitting}
          >
            {submitting ? 'Dodawanie...' : 'Dodaj wybrane przedmioty'}
          </Button>
        </div>

        {/* Grid przedmiotów */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {items.map((item) => {
            const isSelected = selectedItems.some(i => i.id === item.id);
            return (
              <Card
                key={item.id}
                className={`relative transition-all duration-200 cursor-pointer hover:scale-105 ${
                  isSelected ? 'ring-2 ring-primary ring-offset-2 ring-offset-background' : ''
                }`}
                style={{
                  border: `2px solid ${item.rarityColor}`
                }}
                onClick={() => handleItemToggle(item)}
              >
                <CardContent className="p-4">
                  <div className="absolute top-2 right-2 z-10">
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={() => handleItemToggle(item)}
                    />
                  </div>
                  <div className="aspect-square mb-2">
                    <img
                      src={`data:image/png;base64,${item.image}`}
                      alt={item.name}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-center truncate">
                      {item.name}
                    </div>
                    <div className="flex flex-col gap-1">
                      <Badge variant="outline" className="w-full justify-center">
                        {item.price.toFixed(2)} zł
                      </Badge>
                      <Badge variant="outline" className="w-full justify-center">
                        {item.wearRatingName}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default AddItemsToCasePage;
