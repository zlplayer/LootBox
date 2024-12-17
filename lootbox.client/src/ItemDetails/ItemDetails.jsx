import { useParams, useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { ScrollArea } from "@/components/ui/scroll-area";


function ItemDetailsPage() {
    const { id } = useParams();
    const [item, setItem] = useState(null);
    const [cases, setCases] = useState([]);
    const [loading, setLoading] = useState(true);
    const [casesLoading, setCasesLoading] = useState(false);
    const [error, setError] = useState(null);
    const [casesError, setCasesError] = useState(null);
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
                setError("Nie udało się pobrać szczegółów itemu.");
            } finally {
                setLoading(false);
            }
        };
        fetchItemDetails();
    }, [id]);

    useEffect(() => {
        const fetchCasesForItem = async () => {
            if (!item) return;
            setCasesLoading(true);
            try {
                const response = await fetch(`/api/item/case/${item.id}`);
                if (!response.ok) {
                    throw new Error(`Failed to fetch cases for item: ${response.statusText}`);
                }
                const data = await response.json();
                setCases(data);
            } catch (err) {
                console.error("Error fetching cases for item:", err);
                setCasesError("Nie udało się pobrać listy skrzynek dla tego przedmiotu.");
            } finally {
                setCasesLoading(false);
            }
        };
        if (item) {
            fetchCasesForItem();
        }
    }, [item]);

    if (loading) return <p className="p-8">Ładowanie szczegółów...</p>;
    if (error) return <p className="p-8 text-red-500">{error}</p>;

    return (
        <div className="p-8">
            <Card>
                <CardHeader>
                    <CardTitle>
                        <h1 className="scroll-m-20 text-3xl font-bold tracking-tight">
                            Szczegóły itemu: {item.name}
                        </h1>
                    </CardTitle>
                    <CardDescription>
                        <p>Dane dotyczące wybranego przedmiotu.</p>
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col items-center space-y-4">
                        <div className="w-64">
                            <AspectRatio ratio={1}>
                                <img
                                    src={`data:image/png;base64,${item.image}`}
                                    alt={item.name}
                                    className="object-cover w-full h-full rounded-md border border-gray-300"
                                />
                            </AspectRatio>
                        </div>
                        <p className="text-xl">{item.price} zł</p>
                        <p>Rzadkość (Kolor): {item.rarityColor}</p>
                        <p>Wear Rating: {item.wearRatingName}</p>
                        <p>Typ: {item.typeItemName}</p>

                        <Separator className="my-8" />

                        <div className="w-full">
                            <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight mb-4">
                                Skrzynki, z których można zdobyć ten przedmiot:
                            </h2>
                            {casesLoading && <p>Ładowanie skrzynek...</p>}
                            {casesError && <p className="text-red-500">{casesError}</p>}
                            {!casesLoading && !casesError && cases.length === 0 && (
                                <p>Brak skrzynek dla tego przedmiotu.</p>
                            )}
                            {!casesLoading && !casesError && cases.length > 0 && (
                                <ScrollArea className="w-full">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
                                        {cases.map((caseItem) => (
                                            <Card
                                                key={caseItem.id}
                                                className="w-full hover:scale-105 transition-transform cursor-pointer"
                                                onClick={() => navigate(`/case/${caseItem.caseId}/items`)}
                                            >
                                                <CardContent className="p-6">
                                                    <div className="flex flex-col space-y-4">
                                                        <div className="h-48 flex items-center justify-center bg-muted rounded-md">
                                                            <img
                                                                src={`data:image/png;base64,${caseItem.caseImage}`}
                                                                alt={caseItem.caseName}
                                                                className="max-h-full max-w-full object-contain p-2"
                                                            />
                                                        </div>
                                                        <div className="space-y-3">
                                                            <h3 className="font-semibold text-lg truncate">{caseItem.caseName}</h3>
                                                            <p className="text-sm text-muted-foreground">
                                                                ID skrzynki: {caseItem.caseId}
                                                            </p>
                                                            <p className="text-lg font-semibold">
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
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

export default ItemDetailsPage;