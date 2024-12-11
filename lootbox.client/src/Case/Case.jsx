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
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Tooltip, TooltipProvider, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Plus, Trash2, Edit } from 'lucide-react';
import CreateCase from '@/CreateCase/CreateCase';
import UpdateCase from '@/UpdateCase/UpdateCase';

function CasePage() {
    const [cases, setCase] = useState([]);
    const [selectedCase, setSelectedCase] = useState(null);
    const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [isCreateDialogOpen, setCreateDialogOpen] = useState(false);
    const [isUpdateDialogOpen, setUpdateDialogOpen] = useState(false);

    const navigate = useNavigate();
    const userRole = localStorage.getItem('userRole');

    useEffect(() => {
        allCase();
    }, []);

    async function allCase() {
        try {
            const response = await fetch('api/case');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setCase(data);
        } catch (error) {
            console.error('Failed to fetch cases:', error);
        }
    }

    const handleRowClick = (caseData) => {
        navigate(`/case/${caseData.id}/items`);
    };

    const handleUpdateClick = (caseData) => {
        setSelectedCase(caseData); // Ustawiamy wybraną skrzynkę
        setUpdateDialogOpen(true); // Otwieramy dialog
    };

    const closeUpdateDialog = () => {
        setSelectedCase(null); // Czyścimy wybraną skrzynkę
        setUpdateDialogOpen(false); // Zamykamy dialog
    };

    const openDeleteDialog = (caseData) => {
        setSelectedCase(caseData);
        setDeleteDialogOpen(true);
    };

    const closeDeleteDialog = () => {
        setSelectedCase(null);
        setDeleteDialogOpen(false);
    };

    const handleDeleteCase = async () => {
        if (!selectedCase) return;
        try {
            const response = await fetch(`api/case/${selectedCase.id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error(`Failed to delete case with ID ${selectedCase.id}: ${response.statusText}`);
            }

            setCase((prevCases) => prevCases.filter((singleCase) => singleCase.id !== selectedCase.id));
            closeDeleteDialog();
            alert('Case deleted successfully!');
        } catch (error) {
            console.error('Error deleting case:', error);
            alert('Failed to delete case. Please try again.');
        }
    };

    return (
        <TooltipProvider>
            <div className="min-h-screen w-full p-8">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-3xl font-bold">CS Lootbox Cases</h1>
                    {userRole === 'Admin' && (
                        <Button
                            onClick={() => setCreateDialogOpen(true)}
                            variant="default"
                            className="flex items-center gap-2"
                        >
                            <Plus className="w-4 h-4" />
                            Create New Case
                        </Button>
                    )}
                </div>
                <p className="mb-8">Wybierz swoją skrzynkę i sprawdź, co kryje się w środku!</p>

                {cases.length === 0 ? (
                    <p className="text-center"><em>Loading...</em></p>
                ) : (
                    <div className="grid grid-cols-5 gap-6">
                        {cases.map(singleCase => (
                            <Card
                                key={singleCase.id}
                                className="transition-transform cursor-pointer hover:scale-105 hover:shadow-lg"
                                onClick={() => handleRowClick(singleCase)}
                            >
                                <CardHeader className="flex flex-col items-center justify-center text-center pt-4 pb-2">
                                    <CardTitle className="font-semibold">{singleCase.name}</CardTitle>
                                    <CardDescription className="text-sm">Ekskluzywna skrzynka CS</CardDescription>
                                </CardHeader>
                                <CardContent className="p-4">
                                    <AspectRatio ratio={1 / 1} className="overflow-hidden rounded-lg">
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <img
                                                    src={`data:image/png;base64,${singleCase.image}`}
                                                    alt={singleCase.name}
                                                    className="object-cover w-full h-full"
                                                />
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>Otwórz i zobacz, co możesz wygrać!</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </AspectRatio>
                                    <Separator className="my-4" />
                                </CardContent>
                                <CardFooter className="flex justify-center items-center pb-4">
                                    <Badge variant="outline">
                                        {singleCase.price} zł
                                    </Badge>
                                </CardFooter>
                                {userRole === 'Admin' && (
                                    <div className="flex justify-center gap-2 pb-4">
                                        <Button
                                            variant="destructive"
                                            size="sm"
                                            onClick={(e) => { e.stopPropagation(); openDeleteDialog(singleCase); }}
                                        >
                                            <Trash2 className="w-4 h-4 mr-1" /> Delete
                                        </Button>
                                        <Button
                                            variant="secondary"
                                            size="sm"
                                            onClick={(e) => { e.stopPropagation(); handleUpdateClick(singleCase); }}
                                            className="flex items-center gap-1"
                                        >
                                            <Edit className="w-4 h-4" />
                                            Update
                                        </Button>
                                    </div>
                                )}
                            </Card>
                        ))}
                    </div>
                )}

                {/* Update Case Dialog */}
                <Dialog open={isUpdateDialogOpen} onOpenChange={setUpdateDialogOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Update Case</DialogTitle>
                            <DialogDescription>Update the details for the selected case.</DialogDescription>
                        </DialogHeader>
                        {selectedCase && (
                            <UpdateCase
                                caseId={selectedCase.id}
                                onClose={closeUpdateDialog}
                                onSuccess={allCase}
                            />
                        )}
                    </DialogContent>
                </Dialog>

                {/* Create Case Dialog */}
                <Dialog open={isCreateDialogOpen} onOpenChange={setCreateDialogOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Create a New Case</DialogTitle>
                            <DialogDescription>Fill in the details below to create a new case.</DialogDescription>
                        </DialogHeader>
                        <CreateCase onClose={() => setCreateDialogOpen(false)} onSuccess={allCase} />
                    </DialogContent>
                </Dialog>

                {/* Delete Confirmation Dialog */}
                <Dialog open={isDeleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Potwierdź usunięcie</DialogTitle>
                            <DialogDescription>
                                Czy na pewno chcesz usunąć skrzynkę "<strong>{selectedCase?.name}</strong>"? Tej akcji nie można cofnąć.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="flex justify-end space-x-2 mt-4">
                            <Button variant="outline" onClick={closeDeleteDialog}>
                                Anuluj
                            </Button>
                            <Button variant="destructive" onClick={handleDeleteCase}>
                                Usuń
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
        </TooltipProvider>
    );
}

export default CasePage;
