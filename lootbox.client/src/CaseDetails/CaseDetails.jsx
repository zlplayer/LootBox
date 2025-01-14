import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import axios from 'axios';

import {
  Card,
  CardContent,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { ChevronLeft } from 'lucide-react';

/* Dodajemy style dla animacji w stylu CodePen */
const styles = `
.spin-container {
  overflow: hidden; 
  position: relative;
  width: 100%;
}

.items-container {
  display: flex;
  gap: 1rem;
  transition: transform 2s cubic-bezier(0.25, 0.1, 0.25, 1);
  will-change: transform;
}

.items-container.spin {
  transform: translateX(-2000px);
}
`;

function CaseDetailsPage() {
  const { caseid } = useParams();
  const userId = localStorage.getItem("id");
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const userRole = localStorage.getItem("userRole");

  const [items, setItems] = useState([]);
  const [currentCase, setCurrentCase] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawnItem, setDrawnItem] = useState(null);
  const [isResultDialogOpen, setResultDialogOpen] = useState(false);

  const [itemToDelete, setItemToDelete] = useState(null);
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [walletBalance, setWalletBalance] = useState(0);

  const containerRef = useRef(null);

  const itemWidth = 200;
  const extraSpins = 2;
  let displayedItems = [];
  if (items.length > 0) {
    displayedItems = [...items, ...items, ...items];
  }

  const openDeleteDialog = (item) => {
    setItemToDelete(item);
    setDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setItemToDelete(null);
    setDeleteDialogOpen(false);
  };

  useEffect(() => {
    const fetchWalletBalance = async () => {
      if (!userId || !token) return;
      
      try {
        const response = await fetch(`/api/wallet?userId=${userId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (!response.ok) throw new Error('Failed to fetch wallet balance');
        const data = await response.json();
        setWalletBalance(data.money);
      } catch (error) {
        console.error('Error fetching wallet balance:', error);
      }
    };
  
    fetchWalletBalance();
  }, [userId, token]);

  const handleDeleteItemFromCase = async () => {
    if (!itemToDelete) return;
    try {
      const response = await fetch(`/api/case/${caseid}/items/${itemToDelete.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete item from case');
      }

      setItems(prevItems => prevItems.filter(it => it.id !== itemToDelete.id));
      closeDeleteDialog();
    } catch (error) {
      console.error('Error deleting item from case:', error);
      alert('Nie udało się usunąć przedmiotu ze skrzynki.');
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [caseResponse, itemsResponse] = await Promise.all([
          axios.get(`/api/case/${caseid}`),
          axios.get(`/api/case/${caseid}/items`)
        ]);
        setCurrentCase(caseResponse.data);
        setItems(itemsResponse.data);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Nie udało się pobrać danych.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [caseid]);

  const handleDraw = async () => {
    if (!userId || !token) {
      alert("Musisz być zalogowany, aby otworzyć skrzynkę.");
      return;
    }

    if (items.length === 0 || isDrawing) return;
    setIsDrawing(true);
    setDrawnItem(null);

    try {
      const response = await axios.post(
        `/api/case/${caseid}/draw`,
        {},
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'userId': userId
          }
        }
      );

      const resultItem = response.data;

      // Znajdź indeks wylosowanego przedmiotu
      const resultIndex = items.findIndex(item => item.id === resultItem.id);
      if (resultIndex !== -1) {
        const finalPosition = (resultIndex + (items.length * extraSpins)) * itemWidth;

        if (containerRef.current) {
          // Reset animacji
          containerRef.current.classList.remove('spin');
          containerRef.current.style.transform = `translateX(0px)`;
          containerRef.current.offsetHeight; // Force reflow

          // Rozpocznij animację
          containerRef.current.classList.add('spin');
          containerRef.current.style.transform = `translateX(-2000px)`;

          // Po zakończeniu animacji pokaż wynik
          setTimeout(() => {
            containerRef.current.classList.remove('spin');
            containerRef.current.style.transform = `translateX(-${finalPosition}px)`;
            setIsDrawing(false);
            setDrawnItem(resultItem);
            setResultDialogOpen(true);
          }, 3000);
        }
      }
    } catch (err) {
      console.error("Error drawing item:", err);
      if (err.response?.status === 400 && err.response?.data === "Not enough money in the wallet") {
        alert("Nie masz wystarczającej ilości środków w portfelu.");
      } else {
        alert("Nie udało się wylosować przedmiotu.");
      }
      setIsDrawing(false);
    }
  };

  const handleSellItem = async () => {
    if (!userId || !token || !drawnItem) return;
    try {
      const response = await axios.post(`/api/wallet/sellItem?userId=${userId}&itemId=${drawnItem.id}`, '', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.status === 200) {
        setResultDialogOpen(false);
      }
    } catch (error) {
      console.error('Error selling item:', error);
      alert('Nie udało się sprzedać przedmiotu');
    }
  };

  const handleAddToEquipment = async () => {
    if (!userId || !token) {
      alert("Musisz być zalogowany, aby dodać przedmiot do ekwipunku.");
      return;
    }

    if (!drawnItem) return;
    try {
      await axios.post(`/api/equipment?itemId=${drawnItem.id}&userId=${userId}`, {}, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setResultDialogOpen(false);
      setDrawnItem(null);
    } catch (error) {
      console.error("Error adding to equipment:", error);
      alert("Nie udało się dodać przedmiotu do ekwipunku.");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return <div className="p-8 text-destructive">{error}</div>;
  }

  return (
    <>
      <style>{styles}</style>
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-7xl mx-auto mb-8">
          {/* Nagłówek */}
          <div className="flex items-center gap-4 mb-6">
            <Button
              variant="ghost"
              className="flex items-center gap-2"
              onClick={() => navigate('/')}
            >
              <ChevronLeft className="w-4 h-4" />
              Powrót do skrzynek
            </Button>
            <div className="flex-1 text-center">
              <h1 className="text-2xl font-bold">{currentCase?.name}</h1>
              <p className="text-muted-foreground">{currentCase?.price.toFixed(2)} zł</p>
            </div>
            {userRole === 'Admin' && (
              <Button
                variant="secondary"
                onClick={() => navigate(`/case/${caseid}/add-items`)}
              >
                Dodaj przedmioty do skrzynki
              </Button>
            )}
          </div>

          <div className="spin-container border rounded-lg bg-card/50 relative w-full overflow-hidden">
            <div
              className="items-container"
              ref={containerRef}
              style={{ minWidth: 'max-content' }}
            >
              {displayedItems.map((item, index) => (
                <Card
                  key={item.id + '-' + index}
                  className="flex-shrink-0 w-48"
                  style={{
                    border: `2px solid ${item.rarityColor}`
                  }}
                >
                  <CardContent className="p-4">
                    <div className="aspect-square mb-2">
                      <img
                        src={`data:image/png;base64,${item.image}`}
                        alt={item.name}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="text-sm font-medium text-center truncate">
                      {item.name}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Przycisk losowania */}
          <div className="flex justify-center mb-8 mt-4">
            <Button
              size="lg"
              disabled={isDrawing || items.length === 0 || !userId || !token || walletBalance < currentCase?.price}
              onClick={handleDraw}
              className="px-8 py-6 text-lg"
            >
              {isDrawing ?
                "Losowanie..." :
                walletBalance < currentCase?.price ?
                  `Niewystarczające środki (potrzebujesz ${currentCase?.price.toFixed(2)} zł)` :
                  `Otwórz za ${currentCase?.price.toFixed(2)} zł`
              }
            </Button>
          </div>

          {/* Lista przedmiotów */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Zawartość skrzynki</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {items.map((item) => (
                <Card
                  key={item.id}
                  className="transition-transform hover:scale-105"
                  style={{
                    border: `2px solid ${item.rarityColor}`,
                  }}
                >
                  <CardContent className="p-4">
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
                        <Badge variant="secondary" className="w-full justify-center">
                          {item.price.toFixed(2)} zł
                        </Badge>
                        <Badge variant="outline" className="w-full justify-center">
                          {item.wearRatingName}
                        </Badge>
                      </div>
                      {userRole === 'Admin' && (
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => openDeleteDialog(item)}
                          className="w-full mt-2"
                        >
                          Usuń ze skrzynki
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Dialog z wynikiem */}
        <Dialog
          open={isResultDialogOpen}
          onOpenChange={() => { }} // Usuwamy możliwość zamknięcia przez kliknięcie poza oknem
        >
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Gratulacje!</DialogTitle>
              <DialogDescription>
                Wylosowałeś nowy przedmiot. Co chcesz z nim zrobić?
              </DialogDescription>
            </DialogHeader>

            {drawnItem && (
              <div className="flex flex-col items-center p-4">
                <Card
                  className="w-full mb-4"
                  style={{
                    border: `2px solid ${drawnItem.rarityColor}`,
                  }}
                >
                  <CardContent className="p-4">
                    <div className="aspect-square mb-4">
                      <img
                        src={`data:image/png;base64,${drawnItem.image}`}
                        alt={drawnItem.name}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="text-center space-y-2">
                      <h3 className="font-bold">{drawnItem.name}</h3>
                      <Badge variant="secondary">
                        {drawnItem.price.toFixed(2)} zł
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            <DialogFooter>
              <Button variant="secondary" onClick={handleSellItem}>
                Sprzedaj ({drawnItem?.price.toFixed(2)} zł)
              </Button>
              <Button onClick={handleAddToEquipment}>
                Dodaj do ekwipunku
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Dialog potwierdzenia usunięcia */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Potwierdź usunięcie</DialogTitle>
              <DialogDescription>
                Czy na pewno chcesz usunąć przedmiot "{itemToDelete?.name}" ze skrzynki?
                Tej akcji nie można cofnąć.
              </DialogDescription>
            </DialogHeader>
            <div className="flex justify-end space-x-2 mt-4">
              <Button variant="outline" onClick={closeDeleteDialog}>
                Anuluj
              </Button>
              <Button variant="destructive" onClick={handleDeleteItemFromCase}>
                Usuń
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}

export default CaseDetailsPage;
