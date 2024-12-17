import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import axios from 'axios';

import {
  Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Tooltip, TooltipProvider, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { Trash2 } from 'lucide-react';

function CaseDetailsPage() {
  const { caseid } = useParams();
  const userId = localStorage.getItem("id");
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const userRole = localStorage.getItem("userRole");

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [drawnItem, setDrawnItem] = useState(null);
  const [isResultDialogOpen, setResultDialogOpen] = useState(false);

  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  const drawIntervalRef = useRef(null);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await axios.get(`/api/case/${caseid}/items`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        setItems(response.data);
      } catch (err) {
        console.error("Error fetching case details:", err);
        setError("Nie udało się pobrać zawartości skrzynki.");
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, [caseid, token]);

  const handleDraw = async () => {
    if (items.length === 0 || isDrawing) return;
    setIsDrawing(true);
    setDrawnItem(null);

    // Animacja losowania
    let currentIndex = 0;
    drawIntervalRef.current = setInterval(() => {
      currentIndex = (currentIndex + 1) % items.length;
      setActiveIndex(currentIndex);
    }, 100);

    try {
      const response = await axios.post(`/api/case/${caseid}/draw`, {}, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const resultItem = response.data;

      setTimeout(() => {
        clearInterval(drawIntervalRef.current);
        const chosenIndex = items.findIndex(it => it.id === resultItem.id);
        setActiveIndex(chosenIndex !== -1 ? chosenIndex : 0);
        setDrawnItem(resultItem);
        setIsDrawing(false);
        setResultDialogOpen(true);
      }, 3000); // symulacja 3s losowania
    } catch (err) {
      console.error("Error drawing item:", err);
      alert("Nie udało się wylosować przedmiotu.");
      clearInterval(drawIntervalRef.current);
      setIsDrawing(false);
    }
  };

  const openDeleteDialog = (item) => {
    setItemToDelete(item);
    setDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setItemToDelete(null);
    setDeleteDialogOpen(false);
  };

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

      // Po udanym usunięciu, usuń przedmiot z listy
      setItems(prevItems => prevItems.filter(it => it.id !== itemToDelete.id));

      closeDeleteDialog();
      alert('Przedmiot został usunięty ze skrzynki.');
    } catch (error) {
      console.error('Error deleting item from case:', error);
      alert('Failed to delete item from case. Please try again.');
    }
  };

  const handleAddToEquipment = async () => {
    if (!drawnItem) return;
    try {
      await axios.post(`/api/equipment?itemId=${drawnItem.id}&userId=${userId}`, {}, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      alert("Przedmiot dodany do ekwipunku!");
      setResultDialogOpen(false);
      setDrawnItem(null);
    } catch (error) {
      console.error("Error adding to equipment:", error);
      alert("Nie udało się dodać przedmiotu do ekwipunku.");
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Zawartość skrzynki</h1>
        <div className="grid grid-cols-5 gap-4">
          {Array.from({ length: 10 }, (_, i) => (
            <Skeleton key={i} className="w-full h-32" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return <p className="p-8 text-red-500">{error}</p>;
  }

  return (
    <TooltipProvider>
      <div className="min-h-screen w-full p-8 space-y-6">
        {/* Górny pasek przedmiotów (karuzela) i przycisk Otwórz */}
        <div className="flex flex-col space-y-4">
          <ScrollArea className="w-full max-w-full">
            <div className="flex gap-4">
              {items.map((item, index) => (
                <Card
                  key={item.id}
                  className={`transition-transform cursor-pointer ${activeIndex === index ? "scale-110" : "scale-100"} ${isDrawing ? "opacity-50" : "opacity-100"}`}
                  style={{
                    border: `2px solid ${item.rarityColor}`,
                    boxShadow: `0 0 8px ${item.rarityColor}`
                  }}
                >
                  <CardHeader className="flex flex-col items-center text-center pt-4 pb-2">
                    <CardTitle className="font-semibold">{item.name}</CardTitle>
                    <CardDescription className="text-xs">Szansa: ???</CardDescription>
                  </CardHeader>
                  <CardContent className="p-2">
                    <AspectRatio ratio={1 / 1} className="overflow-hidden rounded-lg">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <img
                            src={item.image?.startsWith('data:image') ? item.image : `data:image/png;base64,${item.image}`}
                            alt={item.name}
                            className="object-cover w-full h-full"
                          />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{item.name}</p>
                        </TooltipContent>
                      </Tooltip>
                    </AspectRatio>
                  </CardContent>
                  {/* Tutaj nie dodajemy przycisku Delete, bo nie chcemy go w animacji losowania */}
                </Card>
              ))}
            </div>
          </ScrollArea>
          <div className="flex justify-center">
            <Button onClick={handleDraw} disabled={isDrawing || items.length === 0} variant="primary">
              {isDrawing ? "Losowanie..." : "Otwórz"}
            </Button>
            {userRole === 'Admin' && (
              <Button
                variant="secondary"
                onClick={() => navigate(`/case/${caseid}/add-items`)}
              >
                Dodaj przedmioty do skrzynki
              </Button>
            )}
          </div>
        </div>

        {/* Sekcja: Zawartość skrzynki (grid) */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Zawartość skrzynki</h2>
          <div className="grid grid-cols-6 gap-6">
            {items.map((item) => (
              <Card
                key={item.id}
                className="transition-transform hover:scale-105 hover:shadow-lg"
                style={{
                  border: `2px solid ${item.rarityColor}`,
                  boxShadow: `0 0 8px ${item.rarityColor}`
                }}
              >
                <CardHeader className="text-center pt-4 pb-2">
                  <CardTitle className="font-semibold flex flex-col items-center justify-center">
                    <span>{item.name}</span>
                    <span className="text-xs text-gray-500 mt-1">
                      {item.probability ? `${item.probability}%` : `???%`}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <AspectRatio ratio={1 / 1} className="overflow-hidden rounded-lg">
                    <img
                      src={item.image?.startsWith('data:image') ? item.image : `data:image/png;base64,${item.image}`}
                      alt={item.name}
                      className="object-cover w-full h-full"
                    />
                  </AspectRatio>
                  <Separator
                    className="my-4"
                    style={{
                      borderColor: item.rarityColor,
                      borderWidth: "1px",
                      boxShadow: `0 0 5px ${item.rarityColor}`
                    }}
                  />
                  <div className="flex flex-col items-center space-y-2">
                    <Badge variant="outline">{item.price} zł</Badge>
                    <Badge variant="outline">Wear: {item.wearRatingName}</Badge>
                    <Badge variant="outline">Typ: {item.typeItemName}</Badge>
                  </div>
                </CardContent>
                {/* Przycisk usuwania przedmiotu widoczny tylko w zawartości skrzynki, jeśli Admin */}
                {userRole === 'Admin' && (
                  <CardFooter className="flex justify-center gap-2 pb-4 mt-4">
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => openDeleteDialog(item)}
                    >
                      <Trash2 className="w-4 h-4 mr-1" /> Delete
                    </Button>
                  </CardFooter>
                )}
              </Card>
            ))}
          </div>
        </div>

        {/* Dialog po wylosowaniu */}
        <Dialog open={isResultDialogOpen} onOpenChange={setResultDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Wylosowany przedmiot</DialogTitle>
              <DialogDescription>
                Otrzymałeś przedmiot z tej skrzynki. Czy chcesz dodać go do ekwipunku?
              </DialogDescription>
            </DialogHeader>
            {drawnItem && (
              <div className="flex flex-col items-center space-y-4 mt-4">
                <Card
                  style={{
                    border: `2px solid ${drawnItem.rarityColor}`,
                    boxShadow: `0 0 8px ${drawnItem.rarityColor}`
                  }}
                >
                  <CardHeader className="text-center">
                    <CardTitle className="font-semibold">{drawnItem.name}</CardTitle>
                    <CardDescription className="text-sm">Twój nowy skarb!</CardDescription>
                  </CardHeader>
                  <CardContent className="p-4">
                    <AspectRatio ratio={1 / 1} className="overflow-hidden rounded-lg">
                      <img
                        src={drawnItem.image?.startsWith('data:image') ? drawnItem.image : `data:image/png;base64,${drawnItem.image}`}
                        alt={drawnItem.name}
                        className="object-cover w-full h-full"
                      />
                    </AspectRatio>
                    <Separator
                      className="my-4"
                      style={{
                        borderColor: drawnItem.rarityColor,
                        borderWidth: "1px",
                        boxShadow: `0 0 10px ${drawnItem.rarityColor}`
                      }}
                    />
                    <div className="flex flex-col items-center space-y-2">
                      <Badge variant="outline">{drawnItem.price} zł</Badge>
                      <Badge variant="outline">Wear: {drawnItem.wearRatingName}</Badge>
                      <Badge variant="outline">Typ: {drawnItem.typeItemName}</Badge>
                    </div>
                  </CardContent>
                </Card>
                <div className="flex justify-end gap-4 mt-4">
                  <Button variant="outline" onClick={() => setResultDialogOpen(false)}>
                    Odrzuć
                  </Button>
                  <Button variant="primary" onClick={handleAddToEquipment}>
                    Dodaj do ekwipunku
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Potwierdź usunięcie</DialogTitle>
              <DialogDescription>
                Czy na pewno chcesz usunąć "<strong>{itemToDelete?.name}</strong>" z ekwipunku?
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
    </TooltipProvider>
  );
}

export default CaseDetailsPage;
