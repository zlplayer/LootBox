import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Tooltip, TooltipProvider, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useNavigate } from 'react-router-dom';
import { Trash2 } from 'lucide-react';

function EquipmentPage() {
    const [equipment, setEquipment] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedEquipment, setSelectedEquipment] = useState(null);
    const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);

    const userId = localStorage.getItem('id');
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('userRole');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchEquipment = async () => {
            try {
                const response = await fetch(`/api/equipment/${userId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch equipment');
                }

                const data = await response.json();
                setEquipment(data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchEquipment();
    }, [userId, token]);

    const handleRowClick = (equipData) => {
        // Możesz np. przekierować do szczegółów ekwipunku:
        // navigate(`/equipment/${equipData.id}/details`);
        // Na razie puste.
    };

    const openDeleteDialog = (equipData) => {
        setSelectedEquipment(equipData);
        setDeleteDialogOpen(true);
    };

    const closeDeleteDialog = () => {
        setSelectedEquipment(null);
        setDeleteDialogOpen(false);
    };

    const handleDeleteEquipment = async () => {
        if (!selectedEquipment) return;

        try {
            const response = await fetch(`/api/equipment/${selectedEquipment.id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to delete equipment');
            }

            setEquipment((prevEquip) => prevEquip.filter((item) => item.id !== selectedEquipment.id));
            closeDeleteDialog();
        } catch (error) {
            console.error('Error deleting equipment:', error);
            alert('Failed to delete equipment. Please try again.');
        }
    };

    if (loading) {
        return <p className="p-8">Loading equipment...</p>;
    }

    if (error) {
        return <p className="p-8 text-red-500">Error: {error}</p>;
    }

    return (
        <TooltipProvider>
            <div className="min-h-screen w-full p-8">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-3xl font-bold">Twój Ekwipunek</h1>
                    <p className="text-sm text-gray-500">Sprawdź swoje przedmioty!</p>
                </div>
                {equipment.length === 0 ? (
                    <p className="text-center"><em>Brak przedmiotów w ekwipunku.</em></p>
                ) : (
                    <div className="grid grid-cols-5 gap-6">
                        {equipment.map(item => (
                            <Card
                                key={item.id}
                                className="transition-transform cursor-pointer hover:scale-105 hover:shadow-lg"
                                onClick={() => handleRowClick(item)}
                                style={{
                                    border: `3px solid ${item.rarityColor}`,
                                    boxShadow: `0 0 12px ${item.rarityColor}`
                                }}
                            >
                                <CardHeader className="flex flex-col items-center justify-center text-center pt-4 pb-2">
                                    <CardTitle className="font-semibold">{item.name}</CardTitle>
                                    <CardDescription className="text-sm">Przedmiot z Twojego ekwipunku</CardDescription>
                                </CardHeader>
                                <CardContent className="p-4">
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
                                                <p>Przedmiot: {item.name}</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </AspectRatio>
                                    <Separator
                                        className="my-4"
                                        style={{
                                            borderColor: item.rarityColor,
                                            borderWidth: "1px",
                                            boxShadow: `0 0 10px ${item.rarityColor}`
                                        }}
                                    />
                                    <div className="flex flex-col items-center space-y-2">
                                        <Badge variant="outline">
                                            {item.price} zł
                                        </Badge>
                                        <Badge variant="outline">
                                            Wear Rating: {item.wearRatingName}
                                        </Badge>
                                        <Badge variant="outline">
                                            Typ: {item.typeItemName}
                                        </Badge>
                                    </div>
                                </CardContent>
                                <CardFooter className="flex justify-center gap-2 pb-4 mt-4">
                                    <Button
                                        variant="destructive"
                                        size="sm"
                                        onClick={(e) => { e.stopPropagation(); openDeleteDialog(item); }}
                                    >
                                        <Trash2 className="w-4 h-4 mr-1" /> Delete
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                )}

                {/* Delete Confirmation Dialog */}
                <Dialog open={isDeleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Potwierdź usunięcie</DialogTitle>
                            <DialogDescription>
                                Czy na pewno chcesz usunąć "<strong>{selectedEquipment?.name}</strong>" z ekwipunku?
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
        </TooltipProvider>
    );
}

export default EquipmentPage;
