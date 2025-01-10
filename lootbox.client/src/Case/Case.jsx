import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
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
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Plus, Trash2, Edit, Search, ChevronsUpDown } from 'lucide-react';
import CreateCase from '@/CreateCase/CreateCase';
import UpdateCase from '@/UpdateCase/UpdateCase';

function CasePage() {
    const [cases, setCases] = useState([]);
    const [selectedCase, setSelectedCase] = useState(null);
    const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [isCreateDialogOpen, setCreateDialogOpen] = useState(false);
    const [isUpdateDialogOpen, setUpdateDialogOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [sortOrder, setSortOrder] = useState("name-asc");
    const [loading, setLoading] = useState(true);

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
            setCases(data);
        } catch (error) {
            console.error('Failed to fetch cases:', error);
        } finally {
            setLoading(false);
        }
    }

    const handleRowClick = (caseData) => {
        navigate(`/case/${caseData.id}/items`);
    };

    const handleUpdateClick = (caseData, e) => {
        e.stopPropagation();
        setSelectedCase(caseData);
        setUpdateDialogOpen(true);
    };

    const closeUpdateDialog = () => {
        setSelectedCase(null);
        setUpdateDialogOpen(false);
    };

    const openDeleteDialog = (caseData, e) => {
        e.stopPropagation();
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
                throw new Error(`Failed to delete case with ID ${selectedCase.id}`);
            }

            setCases((prevCases) => prevCases.filter((singleCase) => singleCase.id !== selectedCase.id));
            closeDeleteDialog();
        } catch (error) {
            console.error('Error deleting case:', error);
            alert('Failed to delete case. Please try again.');
        }
    };

    // Filtrowanie i sortowanie
    const filteredAndSortedCases = cases
        .filter(caseItem => caseItem.name.toLowerCase().includes(searchQuery.toLowerCase()))
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
                        <h1 className="text-3xl font-bold">CS Lootbox</h1>
                        <p className="text-muted-foreground">Wybierz skrzynkę i sprawdź co kryje się w środku!</p>
                    </div>
                    {userRole === 'Admin' && (
                        <Button
                            onClick={() => setCreateDialogOpen(true)}
                            className="flex items-center gap-2"
                        >
                            <Plus className="w-4 h-4" />
                            Dodaj skrzynkę
                        </Button>
                    )}
                </div>

                {/* Filters */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="relative col-span-1 md:col-span-2">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Wyszukaj skrzynkę..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-8"
                        />
                    </div>
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

                {/* Cases Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    {filteredAndSortedCases.map(singleCase => (
                        <Card
                            key={singleCase.id}
                            onClick={() => handleRowClick(singleCase)}
                            className="overflow-hidden cursor-pointer group transition-all duration-200 hover:shadow-lg relative bg-card hover:bg-accent"
                        >
                            <div className="relative aspect-square">
                                <img
                                    src={`data:image/png;base64,${singleCase.image}`}
                                    alt={singleCase.name}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                                <div className="absolute bottom-0 left-0 right-0 p-4">
                                    <Badge variant="secondary" className="w-full justify-center text-lg font-semibold mb-1">
                                        {singleCase.price.toFixed(2)} zł
                                    </Badge>
                                </div>
                            </div>
                            <CardHeader className="text-center">
                                <CardTitle className="font-semibold">{singleCase.name}</CardTitle>
                                <CardDescription>Sprawdź zawartość skrzynki!</CardDescription>
                            </CardHeader>
                            {userRole === 'Admin' && (
                                <CardContent>
                                    <div className="flex gap-2">
                                        <Button
                                            variant="destructive"
                                            size="sm"
                                            onClick={(e) => openDeleteDialog(singleCase, e)}
                                            className="w-full"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                        <Button
                                            variant="secondary"
                                            size="sm"
                                            onClick={(e) => handleUpdateClick(singleCase, e)}
                                            className="w-full"
                                        >
                                            <Edit className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </CardContent>
                            )}
                        </Card>
                    ))}
                </div>

                {/* Create Dialog */}
                <Dialog open={isCreateDialogOpen} onOpenChange={setCreateDialogOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Nowa skrzynka</DialogTitle>
                            <DialogDescription>
                                Wprowadź dane nowej skrzynki
                            </DialogDescription>
                        </DialogHeader>
                        <CreateCase 
                            onClose={() => setCreateDialogOpen(false)} 
                            onSuccess={allCase} 
                        />
                    </DialogContent>
                </Dialog>

                {/* Update Dialog */}
                <Dialog open={isUpdateDialogOpen} onOpenChange={setUpdateDialogOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Edycja skrzynki</DialogTitle>
                            <DialogDescription>
                                Zaktualizuj dane skrzynki
                            </DialogDescription>
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

                {/* Delete Dialog */}
                <Dialog open={isDeleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Potwierdź usunięcie</DialogTitle>
                            <DialogDescription>
                                Czy na pewno chcesz usunąć skrzynkę "{selectedCase?.name}"?
                                Tej akcji nie można cofnąć.
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
        </div>
    );
}

export default CasePage;