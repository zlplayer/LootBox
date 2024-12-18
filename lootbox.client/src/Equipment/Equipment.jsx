import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Search,
  Filter,
  Trash2,
  ChevronsUpDown,
} from 'lucide-react';

function EquipmentPage() {
  const userId = localStorage.getItem('id');
  const token = localStorage.getItem('token');
  
  const [equipment, setEquipment] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [sortOrder, setSortOrder] = useState("name-asc");
  const [totalValue, setTotalValue] = useState(0);

  useEffect(() => {
    fetchEquipment();
  }, [userId, token]);

  useEffect(() => {
    calculateTotalValue();
  }, [equipment]);

  const fetchEquipment = async () => {
    try {
      const response = await fetch(`/api/equipment/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch equipment');
      }

      const data = await response.json();
      setEquipment(data);
    } catch (error) {
      console.error('Error fetching equipment:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateTotalValue = () => {
    const total = equipment.reduce((sum, item) => sum + item.price, 0);
    setTotalValue(total);
  };

  const openDeleteDialog = (item) => {
    setSelectedItem(item);
    setDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setSelectedItem(null);
    setDeleteDialogOpen(false);
  };

  const handleDeleteEquipment = async () => {
    if (!selectedItem) return;

    try {
      const response = await fetch(`/api/equipment/${selectedItem.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete equipment');
      }

      setEquipment((prev) => prev.filter((item) => item.id !== selectedItem.id));
      closeDeleteDialog();
    } catch (error) {
      console.error('Error deleting equipment:', error);
      alert('Nie udało się usunąć przedmiotu z ekwipunku.');
    }
  };

  // Filtrowanie i sortowanie
  const filteredAndSortedItems = equipment
    .filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = filterType === "all" || item.typeItemName === filterType;
      return matchesSearch && matchesType;
    })
    .sort((a, b) => {
      switch (sortOrder) {
        case "name-asc":
          return a.name.localeCompare(b.name);
        case "name-desc":
          return b.name.localeCompare(a.name);
        case "price-asc":
          return a.price - b.price;
        case "price-desc":
          return b.price - a.price;
        default:
          return 0;
      }
    });

  // Grupowanie przedmiotów według typu
  const groupedItems = filteredAndSortedItems.reduce((acc, item) => {
    const type = item.typeItemName;
    if (!acc[type]) {
      acc[type] = [];
    }
    acc[type].push(item);
    return acc;
  }, {});

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-background">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Nagłówek i statystyki */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="col-span-full lg:col-span-2">
            <CardHeader>
              <CardTitle>Twój Ekwipunek</CardTitle>
              <CardDescription>
                Zarządzaj swoją kolekcją przedmiotów
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {equipment.length} przedmiotów
              </div>
              <p className="text-muted-foreground">
                Całkowita wartość: {totalValue.toFixed(2)} zł
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Filtry i wyszukiwanie */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Szukaj przedmiotów..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-full md:w-[200px]">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Filtruj po typie" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Wszystkie typy</SelectItem>
              {Array.from(new Set(equipment.map(item => item.typeItemName))).map(type => (
                <SelectItem key={type} value={type}>{type}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={sortOrder} onValueChange={setSortOrder}>
            <SelectTrigger className="w-full md:w-[200px]">
              <ChevronsUpDown className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Sortuj" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name-asc">Nazwa (A-Z)</SelectItem>
              <SelectItem value="name-desc">Nazwa (Z-A)</SelectItem>
              <SelectItem value="price-asc">Cena (rosnąco)</SelectItem>
              <SelectItem value="price-desc">Cena (malejąco)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Lista przedmiotów */}
        {equipment.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center p-8">
              <div className="text-center space-y-2">
                <h3 className="text-lg font-medium">Brak przedmiotów</h3>
                <p className="text-muted-foreground">
                  Twój ekwipunek jest pusty. Otwórz skrzynki aby zdobyć przedmioty!
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {filteredAndSortedItems.map((item) => (
              <Card
                key={item.id}
                className="group relative transition-all duration-200 hover:shadow-lg"
                style={{
                  borderColor: item.rarityColor,
                }}
              >
                <CardContent className="p-4">
                  <div className="aspect-square mb-4 bg-background/50 rounded-lg p-2">
                    <img
                      src={`data:image/png;base64,${item.image}`}
                      alt={item.name}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-medium truncate text-center">
                      {item.name}
                    </h3>
                    <div className="flex flex-col gap-1">
                      <Badge variant="secondary" className="w-full justify-center">
                        {item.price.toFixed(2)} zł
                      </Badge>
                      <Badge variant="outline" className="w-full justify-center">
                        {item.wearRatingName}
                      </Badge>
                    </div>
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    className="w-full mt-4"
                    onClick={() => openDeleteDialog(item)}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Usuń z ekwipunku
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Dialog usuwania */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Potwierdź usunięcie</DialogTitle>
              <DialogDescription>
                Czy na pewno chcesz usunąć przedmiot "{selectedItem?.name}" ze swojego ekwipunku?
                Tej akcji nie można cofnąć.
              </DialogDescription>
            </DialogHeader>
            <div className="flex justify-end space-x-2 mt-4">
              <Button variant="outline" onClick={closeDeleteDialog}>
                Anuluj
              </Button>
              <Button variant="destructive" onClick={handleDeleteEquipment}>
                Usuń
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

export default EquipmentPage;