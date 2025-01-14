import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Search,
  Filter,
  Trash2,
  ChevronsUpDown,
  Banknote,
  Clock,
  CheckCircle2,
  ArrowUpFromLine,
  AlertCircle
} from 'lucide-react';
import axios from 'axios';

function EquipmentPage() {
  const userId = localStorage.getItem('id');
  const token = localStorage.getItem('token');

  const [equipment, setEquipment] = useState([]);
  const [pendingWithdrawals, setPendingWithdrawals] = useState([]);
  const [completedWithdrawals, setCompletedWithdrawals] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isWithdrawDialogOpen, setWithdrawDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [sortOrder, setSortOrder] = useState("name-asc");
  const [totalValue, setTotalValue] = useState(0);
  const [tradeLink, setTradeLink] = useState("");

  useEffect(() => {
    fetchEquipment();
    fetchWithdrawals();
    fetchUserTradeLink();
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

  const fetchWithdrawals = async () => {
    try {
      const [pendingResponse, completedResponse] = await Promise.all([
        fetch(`/api/ItemWithdrawal/ItemWithdrawalIsAcceptedFalse?userId=${userId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }),
        fetch(`/api/ItemWithdrawal/ItemWithdrawalIsAcceptedTrue?userId=${userId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
      ]);

      if (!pendingResponse.ok || !completedResponse.ok) {
        throw new Error('Nie udało się pobrać danych o wypłatach');
      }

      const pendingData = await pendingResponse.json();
      const completedData = await completedResponse.json();

      setPendingWithdrawals(pendingData);
      setCompletedWithdrawals(completedData);
    } catch (error) {
      console.error('Error fetching withdrawals:', error);
    }
  };

  const fetchUserTradeLink = async () => {
    try {
      const response = await fetch(`/api/account/user/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Nie udało się pobrać TradeLink');
      }

      const userData = await response.json();
      setTradeLink(userData.tradeLink || '');
    } catch (error) {
      console.error('Error fetching trade link:', error);
    }
  };

  const calculateTotalValue = () => {
    const total = equipment.reduce((sum, item) => sum + item.price, 0);
    setTotalValue(total);
  };

  const handleSellItem = async (item) => {
    try {
      await axios.post(`/api/equipment/sellItem?userId=${userId}&equipentId=${item.id}`, null, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      await fetchEquipment();
    } catch (error) {
      console.error('Error selling item:', error);
      alert('Nie udało się sprzedać przedmiotu');
    }
  };

  const handleWithdrawItem = async (item) => {
    if (!tradeLink) {
      alert('Musisz najpierw ustawić Trade URL w swoim profilu!');
      return;
    }

    try {
      const response = await fetch(`/api/ItemWithdrawal?userId=${userId}&equipmentId=${item.id}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Nie udało się zlecić wypłaty przedmiotu');
      }

      await Promise.all([
        fetchEquipment(),
        fetchWithdrawals()
      ]);

      setWithdrawDialogOpen(false);
    } catch (error) {
      console.error('Error withdrawing item:', error);
      alert('Nie udało się zlecić wypłaty przedmiotu');
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
        case "name-asc": return a.name.localeCompare(b.name);
        case "name-desc": return b.name.localeCompare(a.name);
        case "price-asc": return a.price - b.price;
        case "price-desc": return b.price - a.price;
        default: return 0;
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

        <Tabs defaultValue="equipment" className="space-y-6">
          <TabsList>
            <TabsTrigger value="equipment" className="flex items-center gap-2">
              Ekwipunek
              <Badge variant="secondary">{equipment.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="pending" className="flex items-center gap-2">
              Oczekujące wypłaty
              <Badge variant="secondary">{pendingWithdrawals.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="completed" className="flex items-center gap-2">
              Zakończone wypłaty
              <Badge variant="secondary">{completedWithdrawals.length}</Badge>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="equipment">
            {/* Filtry i wyszukiwanie */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center mb-6">
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
                    <div className="space-y-2 mt-4">
                      <Button
                        variant="default"
                        size="sm"
                        className="w-full"
                        onClick={() => handleSellItem(item)}
                      >
                        <Banknote className="w-4 h-4 mr-2" />
                        Sprzedaj ({item.price.toFixed(2)} zł)
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full"
                        onClick={() => {
                          setSelectedItem(item);
                          setWithdrawDialogOpen(true);
                        }}
                      >
                        <ArrowUpFromLine className="w-4 h-4 mr-2" />
                        Wypłać przedmiot
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {filteredAndSortedItems.length === 0 && (
                <div className="col-span-full text-center p-8 text-muted-foreground">
                  Brak przedmiotów spełniających kryteria wyszukiwania
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="pending">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {pendingWithdrawals.map((item) => (
                <Card
                  key={item.id}
                  className="relative"
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
                        <Badge
                          variant="secondary"
                          className="w-full justify-center bg-yellow-500/20 text-yellow-600"
                        >
                          <Clock className="w-4 h-4 mr-1" />
                          Oczekuje na akceptację
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {pendingWithdrawals.length === 0 && (
                <div className="col-span-full">
                  <Card className="p-8">
                    <div className="flex flex-col items-center justify-center text-center gap-2">
                      <Clock className="w-8 h-8 text-muted-foreground" />
                      <h3 className="font-medium">Brak oczekujących wypłat</h3>
                      <p className="text-sm text-muted-foreground">
                        Nie masz żadnych przedmiotów oczekujących na wypłatę
                      </p>
                    </div>
                  </Card>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="completed">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {completedWithdrawals.map((item) => (
                <Card
                  key={item.id}
                  className="relative"
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
                        <Badge
                          variant="secondary"
                          className="w-full justify-center bg-green-500/20 text-green-600"
                        >
                          <CheckCircle2 className="w-4 h-4 mr-1" />
                          Wypłacono
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {completedWithdrawals.length === 0 && (
                <div className="col-span-full">
                  <Card className="p-8">
                    <div className="flex flex-col items-center justify-center text-center gap-2">
                      <CheckCircle2 className="w-8 h-8 text-muted-foreground" />
                      <h3 className="font-medium">Brak zakończonych wypłat</h3>
                      <p className="text-sm text-muted-foreground">
                        Nie masz żadnych zakończonych wypłat przedmiotów
                      </p>
                    </div>
                  </Card>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Dialog potwierdzenia wypłaty */}
      <Dialog open={isWithdrawDialogOpen} onOpenChange={setWithdrawDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Potwierdź wypłatę przedmiotu</DialogTitle>
            <DialogDescription>
              Czy na pewno chcesz wypłacić ten przedmiot na swoje konto Steam?
            </DialogDescription>
          </DialogHeader>

          {selectedItem && (
            <div className="flex flex-col items-center p-4">
              <Card
                className="w-full mb-4"
                style={{
                  borderColor: selectedItem.rarityColor,
                }}
              >
                <CardContent className="p-4">
                  <div className="aspect-square mb-4">
                    <img
                      src={`data:image/png;base64,${selectedItem.image}`}
                      alt={selectedItem.name}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="text-center space-y-2">
                    <h3 className="font-bold">{selectedItem.name}</h3>
                    <Badge variant="secondary">
                      {selectedItem.price.toFixed(2)} zł
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              {!tradeLink ? (
                <div className="w-full p-4 bg-yellow-500/10 text-yellow-600 rounded-lg flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  <p className="text-sm">
                    Musisz najpierw ustawić Trade URL w swoim profilu!
                  </p>
                </div>
              ) : null}
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setWithdrawDialogOpen(false)}>
              Anuluj
            </Button>
            <Button
              onClick={() => handleWithdrawItem(selectedItem)}
              disabled={!tradeLink}
            >
              Wypłać przedmiot
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default EquipmentPage;