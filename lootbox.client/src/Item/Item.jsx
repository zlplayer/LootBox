import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    CardFooter,
} from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
  } from '@/components/ui/dialog';
  
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Tooltip, TooltipProvider, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Plus, Trash2, Edit } from 'lucide-react';
import CreateItem from '@/CreateItem/CreateItem';
import UpdateItem from '@/UpdateItem/UpdateItem';

function ItemPage() {
    const [items, setItems] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);
    const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [isCreateDialogOpen, setCreateDialogOpen] = useState(false);
    const [isUpdateDialogOpen, setUpdateDialogOpen] = useState(false);

    const navigate = useNavigate();
    const userRole = localStorage.getItem('userRole');

    useEffect(() => {
        allItems();
    }, []);

    async function allItems() {
        try {
            const response = await fetch('api/item');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setItems(data);
        } catch (error) {
            console.error('Failed to fetch items:', error);
        }
    }

    const handleRowClick = (itemData) => {
        // Przejście do nowej strony z detalami przedmiotu
        navigate(`/item/${itemData.id}`);
    };

    const handleUpdateClick = (itemData) => {
        setSelectedItem(itemData);
        setUpdateDialogOpen(true);
    };

    const closeUpdateDialog = () => {
        setSelectedItem(null);
        setUpdateDialogOpen(false);
    };

    const openDeleteDialog = (itemData) => {
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
                throw new Error(`Failed to delete item with ID ${selectedItem.id}: ${response.statusText}`);
            }

            setItems((prevItems) => prevItems.filter((singleItem) => singleItem.id !== selectedItem.id));
            closeDeleteDialog();
        } catch (error) {
            console.error('Error deleting item:', error);
            alert('Failed to delete item. Please try again.');
        }
    };

    return (
        <TooltipProvider>
            <div className="min-h-screen w-full p-8">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-3xl font-bold">Lista Itemów</h1>
                    {userRole === 'Admin' && (
                        <Button
                            onClick={() => setCreateDialogOpen(true)}
                            variant="default"
                            className="flex items-center gap-2"
                        >
                            <Plus className="w-4 h-4" />
                            Create New Item
                        </Button>
                    )}
                </div>
                <p className="mb-8">Tutaj znajdziesz wszystkie dostępne itemy! Kliknij w kartę aby zobaczyć szczegóły lub edytuj/usuń je, jeśli masz odpowiednie uprawnienia.</p>

                {items.length === 0 ? (
                    <p className="text-center"><em>Loading...</em></p>
                ) : (
                    <div className="grid grid-cols-5 gap-6">
                        {items.map(singleItem => (
                            <Card
                                key={singleItem.id}
                                className="transition-transform cursor-pointer hover:scale-105 hover:shadow-lg"
                                onClick={() => handleRowClick(singleItem)}
                                style={{
                                    border: `3px solid ${singleItem.rarityColor}`,
                                    boxShadow: `0 0 12px ${singleItem.rarityColor}`
                                }}
                            >
                                <CardHeader className="flex flex-col items-center justify-center text-center pt-4 pb-2">
                                    <CardTitle className="font-semibold">{singleItem.name}</CardTitle>
                                    <CardDescription className="text-sm">Ekskluzywny item</CardDescription>
                                </CardHeader>
                                <CardContent className="p-4">
                                    <AspectRatio ratio={1 / 1} className="overflow-hidden rounded-lg">
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <img
                                                    src={`data:image/png;base64,${singleItem.image}`}
                                                    alt={singleItem.name}
                                                    className="object-cover w-full h-full"
                                                />
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>Zobacz, jak wygląda ten niesamowity przedmiot!</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </AspectRatio>
                                    <Separator
                                        className="my-4"
                                        style={{
                                            borderColor: singleItem.rarityColor,
                                            borderWidth: "1px",
                                            boxShadow: `0 0 10px ${singleItem.rarityColor}`
                                        }}
                                    />
                                    <div className="flex flex-col items-center space-y-2">
                                        <Badge variant="outline">
                                            {singleItem.price} zł
                                        </Badge>
                                        <Badge variant="outline">
                                            Wear Rating: {singleItem.wearRatingName}
                                        </Badge>
                                        <Badge variant="outline">
                                            Typ: {singleItem.typeItemName}
                                        </Badge>
                                    </div>
                                </CardContent>
                                {userRole === 'Admin' && (
                                    <CardFooter className="flex justify-center gap-2 pb-4 mt-4">
                                        <Button
                                            variant="destructive"
                                            size="sm"
                                            onClick={(e) => { e.stopPropagation(); openDeleteDialog(singleItem); }}
                                        >
                                            <Trash2 className="w-4 h-4 mr-1" /> Delete
                                        </Button>
                                        <Button
                                            variant="secondary"
                                            size="sm"
                                            onClick={(e) => { e.stopPropagation(); handleUpdateClick(singleItem); }}
                                            className="flex items-center gap-1"
                                        >
                                            <Edit className="w-4 h-4" />
                                            Update
                                        </Button>
                                    </CardFooter>
                                )}
                            </Card>

                        ))}
                    </div>
                )}

                {/* Update Item Dialog */}
                <Dialog open={isUpdateDialogOpen} onOpenChange={setUpdateDialogOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Update Item</DialogTitle>
                            <DialogDescription>Uaktualnij dane wybranego itemu.</DialogDescription>
                        </DialogHeader>
                        {selectedItem && (
                            <UpdateItem
                                itemId={selectedItem.id}
                                onClose={closeUpdateDialog}
                                onSuccess={allItems}
                            />
                        )}
                    </DialogContent>
                </Dialog>

                {/* Create Item Dialog */}
                <Dialog open={isCreateDialogOpen} onOpenChange={setCreateDialogOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Create a New Item</DialogTitle>
                            <DialogDescription>Wypełnij dane, aby utworzyć nowy item.</DialogDescription>
                        </DialogHeader>
                        <CreateItem onClose={() => setCreateDialogOpen(false)} onSuccess={allItems} />
                    </DialogContent>
                </Dialog>

                {/* Delete Confirmation Dialog */}
                <Dialog open={isDeleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Potwierdź usunięcie</DialogTitle>
                            <DialogDescription>
                                Czy na pewno chcesz usunąć item "<strong>{selectedItem?.name}</strong>"? Tej akcji nie można cofnąć.
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
        </TooltipProvider>
    );
}

export default ItemPage;
