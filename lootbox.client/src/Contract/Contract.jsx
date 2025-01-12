import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { 
  Repeat, 
  AlertTriangle,
  TrendingUp,
  ArrowUpRight,
  X,
  Filter
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function ContractComponent() {
  const [equipment, setEquipment] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [resultItem, setResultItem] = useState(null);
  const [isResultDialogOpen, setIsResultDialogOpen] = useState(false);
  const [filterRarity, setFilterRarity] = useState("all");
  const userId = localStorage.getItem('id');
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchEquipment();
  }, []);

  const fetchEquipment = async () => {
    try {
      const response = await fetch(`/api/equipment/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) throw new Error('Failed to fetch equipment');
      const data = await response.json();
      setEquipment(data);
    } catch (error) {
      console.error('Error fetching equipment:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleItemSelect = (item) => {
    if (selectedItems.length < 10 && !selectedItems.includes(item)) {
      const sameRarity = selectedItems.length === 0 || selectedItems[0].rarityColor === item.rarityColor;
      if (sameRarity) {
        setSelectedItems([...selectedItems, item]);
      } else {
        alert('Wszystkie przedmioty muszą mieć tę samą rzadkość!');
      }
    }
  };

  const handleItemDeselect = (item) => {
    setSelectedItems(selectedItems.filter(i => i.id !== item.id));
  };

  const executeContract = async () => {
    try {
      const response = await fetch(`/api/contract/trade-up?userId=${userId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(selectedItems.map(item => item.id))
      });

      if (!response.ok) throw new Error('Contract execution failed');

      const result = await response.json();
      setResultItem(result);
      setIsResultDialogOpen(true);
      setSelectedItems([]);
      fetchEquipment();
    } catch (error) {
      console.error('Error executing contract:', error);
      alert('Nie udało się wykonać kontraktu');
    }
  };

  const filteredEquipment = equipment.filter(item => 
    filterRarity === "all" || item.rarityColor === filterRarity
  );

  // Get unique rarities for filter
  const uniqueRarities = [...new Set(equipment.map(item => item.rarityColor))];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-background">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">Kontrakty wymiany</h1>
            <p className="text-muted-foreground">
              Wymień 10 przedmiotów tej samej rzadkości na jeden przedmiot wyższej rzadkości
            </p>
          </div>
          <Select value={filterRarity} onValueChange={setFilterRarity}>
            <SelectTrigger className="w-[200px]">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Filtruj po rzadkości" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Wszystkie rzadkości</SelectItem>
              {uniqueRarities.map(rarity => (
                <SelectItem key={rarity} value={rarity}>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: rarity }} />
                    {rarity}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Selected Items */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Repeat className="w-5 h-5" />
              Wybrane przedmioty ({selectedItems.length}/10)
            </CardTitle>
            <CardDescription>
              Wybierz 10 przedmiotów tej samej rzadkości
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {selectedItems.map((item) => (
                <Card
                  key={item.id}
                  className="relative group cursor-pointer hover:shadow-lg transition-all duration-200"
                  style={{ borderColor: item.rarityColor }}
                  onClick={() => handleItemDeselect(item)}
                >
                  <div className="absolute -right-2 -top-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="destructive"
                      size="icon"
                      className="h-6 w-6 rounded-full"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <CardContent className="p-2">
                    <img
                      src={`data:image/png;base64,${item.image}`}
                      alt={item.name}
                      className="w-full aspect-square object-contain mb-2"
                    />
                    <div className="space-y-2">
                      <div className="text-sm text-center truncate">
                        {item.name}
                      </div>
                      <Badge variant="outline" className="w-full justify-center">
                        {item.price.toFixed(2)} zł
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
          <CardFooter className="justify-end">
            <Button
              onClick={executeContract}
              disabled={selectedItems.length !== 10}
              className="flex items-center gap-2"
            >
              <TrendingUp className="w-4 h-4" />
              Wykonaj kontrakt
            </Button>
          </CardFooter>
        </Card>

        {/* Available Items */}
        <Card>
          <CardHeader>
            <CardTitle>Dostępne przedmioty</CardTitle>
            <CardDescription>
              Kliknij na przedmiot, aby dodać go do kontraktu
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {filteredEquipment.map((item) => (
                <Card
                  key={item.id}
                  className={`cursor-pointer transition-all duration-200 ${
                    selectedItems.includes(item) ? 'opacity-50' : 'hover:scale-105'
                  }`}
                  style={{ borderColor: item.rarityColor }}
                  onClick={() => !selectedItems.includes(item) && handleItemSelect(item)}
                >
                  <CardContent className="p-2">
                    <img
                      src={`data:image/png;base64,${item.image}`}
                      alt={item.name}
                      className="w-full aspect-square object-contain mb-2"
                    />
                    <div className="space-y-2">
                      <div className="text-sm text-center truncate">
                        {item.name}
                      </div>
                      <Badge variant="outline" className="w-full justify-center">
                        {item.price.toFixed(2)} zł
                      </Badge>
                      <Badge variant="secondary" className="w-full justify-center">
                        {item.wearRatingName}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Result Dialog */}
      <Dialog open={isResultDialogOpen} onOpenChange={setIsResultDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Wynik kontraktu</DialogTitle>
            <DialogDescription>
              Otrzymałeś nowy przedmiot!
            </DialogDescription>
          </DialogHeader>
          {resultItem && (
            <div className="flex flex-col items-center p-4">
              <Card
                className="w-full mb-4"
                style={{
                  borderColor: resultItem.rarityColor,
                }}
              >
                <CardContent className="p-4">
                  <div className="aspect-square mb-4">
                    <img
                      src={`data:image/png;base64,${resultItem.image}`}
                      alt={resultItem.name}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="text-center space-y-2">
                    <h3 className="font-bold">{resultItem.name}</h3>
                    <div className="flex gap-2 justify-center">
                      <Badge variant="secondary">
                        {resultItem.price.toFixed(2)} zł
                      </Badge>
                      <Badge 
                        variant="outline"
                        style={{ backgroundColor: resultItem.rarityColor, color: 'white' }}
                      >
                        {resultItem.rarityColor}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setIsResultDialogOpen(false)}>
              Zamknij
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default ContractComponent;