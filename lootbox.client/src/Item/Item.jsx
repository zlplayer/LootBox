import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from "@/components/ui/input";
import { Plus, Trash2, Edit, Search, Filter, ChevronsUpDown } from 'lucide-react';
import CreateItem from '@/CreateItem/CreateItem';
import UpdateItem from '@/UpdateItem/UpdateItem';

function ItemPage() {
  const [items, setItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isCreateDialogOpen, setCreateDialogOpen] = useState(false);
  const [isUpdateDialogOpen, setUpdateDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterRarity, setFilterRarity] = useState("all");
  const [sortOrder, setSortOrder] = useState("name-asc");
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const userRole = localStorage.getItem('userRole');

  useEffect(() => {
    fetchItems();
  }, []);

  async function fetchItems() {
    try {
      const response = await fetch('api/item');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setItems(data);
    } catch (error) {
      console.error('Nie udało się pobrać przedmiotów:', error);
    } finally {
      setLoading(false);
    }
  }

  const handleRowClick = (itemData) => {
    navigate(`/item/${itemData.id}`);
  };

  const handleUpdateClick = (itemData, e) => {
    e.stopPropagation();
    setSelectedItem(itemData);
    setUpdateDialogOpen(true);
  };

  const closeUpdateDialog = () => {
    setSelectedItem(null);
    setUpdateDialogOpen(false);
  };

  const openDeleteDialog = (itemData, e) => {
    e.stopPropagation();
    setSelectedItem(itemData);
    setDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setSelectedItem(null);
    setDeleteDialogOpen(false);
  };

  const handleDeleteItem = async () => {
    if (!selectedItem) return;
    try {
      const response = await fetch(`api/item/${selectedItem.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`Failed to delete item with ID ${selectedItem.id}`);
      }

      setItems((prevItems) => prevItems.filter((item) => item.id !== selectedItem.id));
      closeDeleteDialog();
    } catch (error) {
      console.error('Error deleting item:', error);
      alert('Nie udało się usunąć przedmiotu.');
    }
  };

  // Filtrowanie i sortowanie
  const filteredAndSortedItems = items
    .filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = filterType === "all" || item.typeItemName === filterType;
      const matchesRarity = filterRarity === "all" || item.rarityColor === filterRarity;
      return matchesSearch && matchesType && matchesRarity;
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
            <h1 className="text-3xl font-bold">Przedmioty CS:GO</h1>
            <p className="text-muted-foreground">Zarządzaj przedmiotami dostępnymi w systemie</p>
          </div>
          {userRole === 'Admin' && (
            <Button
              onClick={() => setCreateDialogOpen(true)}
              className="flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Dodaj przedmiot
            </Button>
          )}
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative col-span-1 md:col-span-2">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Wyszukaj przedmiot..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger>
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Filtruj po typie" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Wszystkie typy</SelectItem>
              {Array.from(new Set(items.map(item => item.typeItemName))).map(type => (
                <SelectItem key={type} value={type}>{type}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={sortOrder} onValueChange={setSortOrder}>
            <SelectTrigger>
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

        {/* Items Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filteredAndSortedItems.map((item) => (
            <Card
              key={item.id}
              onClick={() => handleRowClick(item)}
              className="group cursor-pointer transition-all duration-200 hover:shadow-lg bg-card hover:bg-accent"
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
                    <Badge variant="outline" className="w-full justify-center">
                      {item.price.toFixed(2)} zł
                    </Badge>
                  </div>
                  {userRole === 'Admin' && (
                    <div className="flex gap-2 mt-4">
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={(e) => openDeleteDialog(item, e)}
                        className="w-full"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={(e) => handleUpdateClick(item, e)}
                        className="w-full"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Create Dialog */}
        <Dialog open={isCreateDialogOpen} onOpenChange={setCreateDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nowy przedmiot</DialogTitle>
              <DialogDescription>
                Wprowadź dane nowego przedmiotu
              </DialogDescription>
            </DialogHeader>
            <CreateItem 
              onClose={() => setCreateDialogOpen(false)} 
              onSuccess={fetchItems} 
            />
          </DialogContent>
        </Dialog>

        {/* Update Dialog */}
        <Dialog open={isUpdateDialogOpen} onOpenChange={setUpdateDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edycja przedmiotu</DialogTitle>
              <DialogDescription>
                Zaktualizuj dane przedmiotu
              </DialogDescription>
            </DialogHeader>
            {selectedItem && (
              <UpdateItem
                itemId={selectedItem.id}
                onClose={closeUpdateDialog}
                onSuccess={fetchItems}
              />
            )}
          </DialogContent>
        </Dialog>

        {/* Delete Dialog */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Potwierdź usunięcie</DialogTitle>
              <DialogDescription>
                Czy na pewno chcesz usunąć przedmiot "{selectedItem?.name}"?
                Tej akcji nie można cofnąć.
              </DialogDescription>
            </DialogHeader>
            <div className="flex justify-end space-x-2 mt-4">
              <Button variant="outline" onClick={closeDeleteDialog}>
                Anuluj
              </Button>
              <Button variant="destructive" onClick={handleDeleteItem}>
                Usuń
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

export default ItemPage;