import { useParams, useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ChevronLeft,
  Box,
  Banknote,
  Star,
  CircleDot,
  Archive,
} from 'lucide-react';

function ItemDetailsPage() {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchItemDetails = async () => {
      try {
        const response = await fetch(`/api/item/${id}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch item details: ${response.statusText}`);
        }
        const data = await response.json();
        setItem(data);
      } catch (err) {
        console.error("Error fetching item details:", err);
      }
    };

    const fetchCasesForItem = async () => {
      try {
        const response = await fetch(`/api/item/case/${id}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch cases for item: ${response.statusText}`);
        }
        const data = await response.json();
        setCases(data);
      } catch (err) {
        console.error("Error fetching cases for item:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchItemDetails();
    fetchCasesForItem();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-background">
      <div className="max-w-7xl mx-auto">
        {/* Nagłówek z przyciskiem powrotu */}
        <div className="mb-8">
          <Button
            variant="ghost"
            className="mb-4"
            onClick={() => navigate('/items')}
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Powrót do listy przedmiotów
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Kolumna lewa - główne informacje i obraz */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>{item?.name}</CardTitle>
              <CardDescription>Szczegółowe informacje o przedmiocie</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Obraz przedmiotu */}
                <Card className="bg-muted/50 flex items-center justify-center p-6">
                  <div className="aspect-square w-full relative">
                    <img
                      src={`data:image/png;base64,${item?.image}`}
                      alt={item?.name}
                      className="object-contain w-full h-full"
                    />
                  </div>
                </Card>

                {/* Podstawowe informacje */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Specyfikacja</h3>
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <Box className="w-4 h-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Typ:</span>
                        <span className="font-medium">{item?.typeItemName}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Banknote className="w-4 h-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Cena:</span>
                        <span className="font-medium">{item?.price.toFixed(2)} zł</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Star className="w-4 h-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Rzadkość:</span>
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: item?.rarityColor }}
                          />
                          <span className="font-medium">{item?.rarityColor}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <CircleDot className="w-4 h-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Stan zużycia:</span>
                        <span className="font-medium">{item?.wearRatingName}</span>
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Status przedmiotu</h3>
                    <div className="flex gap-2 flex-wrap">
                      <Badge variant="outline">ID: {item?.id}</Badge>
                      <Badge>{item?.wearRatingName}</Badge>
                      <Badge variant="secondary">{item?.typeItemName}</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Kolumna prawa - dostępność w skrzynkach */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Archive className="w-5 h-5" />
                Dostępność w skrzynkach
              </CardTitle>
              <CardDescription>
                Skrzynki zawierające ten przedmiot
              </CardDescription>
            </CardHeader>
            <CardContent>
              {cases.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">
                  Ten przedmiot nie jest obecnie dostępny w żadnej skrzynce.
                </p>
              ) : (
                <ScrollArea className="h-[400px] pr-4">
                  <div className="space-y-4">
                    {cases.map((caseItem) => (
                      <Card
                        key={caseItem.caseId}
                        className="cursor-pointer hover:bg-accent transition-colors"
                        onClick={() => navigate(`/case/${caseItem.caseId}/items`)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center gap-4">
                            <div className="w-16 h-16 relative flex-shrink-0">
                              <img
                                src={`data:image/png;base64,${caseItem.caseImage}`}
                                alt={caseItem.caseName}
                                className="object-contain w-full h-full"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium truncate">
                                {caseItem.caseName}
                              </h4>
                              <p className="text-sm text-muted-foreground">
                                {caseItem.casePrice.toFixed(2)} zł
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default ItemDetailsPage;