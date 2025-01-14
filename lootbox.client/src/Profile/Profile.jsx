import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
    UserCircle2, 
    KeyRound, 
    LogOut, 
    Shield,
    Link as LinkIcon,
    ExternalLink
} from 'lucide-react';
import { useNavigate } from "react-router-dom";
import DeleteUserDialog from "@/Users/DeleteDialog";
import ChangePasswordDialog from "./ChangePasswordDialog";
import EditProfileDialog from "./EditProfileDialog";

function Profile() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isChangePasswordDialogOpen, setIsChangePasswordDialogOpen] = useState(false);
    const [isTradeLinkDialogOpen, setIsTradeLinkDialogOpen] = useState(false);
    const [tradeLink, setTradeLink] = useState("");

    const userId = localStorage.getItem("id");
    const token = localStorage.getItem("token");
    const navigate = useNavigate();

    useEffect(() => {
        fetchUserData();
    }, []);

    const fetchUserData = async () => {
        try {
            const response = await fetch(`/api/account/user/${userId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch user data');
            }

            const data = await response.json();
            setUser(data);
            setTradeLink(data.tradeLink || '');
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteAccount = async () => {
        try {
            const response = await fetch(`/api/account/${userId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
            });

            if (!response.ok) {
                throw new Error('Failed to delete account');
            }

            localStorage.clear();
            navigate('/');
        } catch (error) {
            setError(error.message);
        }
    };

    const handleUpdateTradeLink = async () => {
        try {
            const response = await fetch(`/api/account/updateTradeLink?userId=${userId}&tradeLink=${tradeLink}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
            });

            if (!response.ok) {
                throw new Error('Nie udało się zaktualizować TradeLink');
            }

            await fetchUserData();
            setIsTradeLinkDialogOpen(false);
        } catch (error) {
            console.error('Error updating trade link:', error);
            alert('Nie udało się zaktualizować TradeLink');
        }
    };

    const validateTradeLink = (link) => {
        return link.startsWith('https://steamcommunity.com/tradeoffer/new/');
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate('/');
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
            </div>
        );
    }

    return (
        <div className="min-h-screen p-6 bg-background">
            <div className="max-w-4xl mx-auto space-y-6">
                {/* Profil użytkownika */}
                <Card>
                    <CardHeader className="space-y-4">
                        <div className="flex items-start justify-between">
                            <div className="flex items-center gap-4">
                                <Avatar className="w-20 h-20">
                                    <AvatarFallback className="text-2xl">
                                        {user?.userName?.[0]?.toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <CardTitle className="text-2xl">{user?.userName}</CardTitle>
                                    <CardDescription>{user?.email}</CardDescription>
                                    <Badge variant="outline" className="mt-2">
                                        <Shield className="w-3 h-3 mr-1" />
                                        {user?.role}
                                    </Badge>
                                </div>
                            </div>
                            <Button variant="outline" onClick={handleLogout} className="gap-2">
                                <LogOut className="w-4 h-4" />
                                Wyloguj się
                            </Button>
                        </div>
                    </CardHeader>
                </Card>

                {/* Karty z ustawieniami */}
                <Tabs defaultValue="account" className="space-y-4">
                    <TabsList>
                        <TabsTrigger value="account" className="gap-2">
                            <UserCircle2 className="w-4 h-4" />
                            Konto
                        </TabsTrigger>
                        <TabsTrigger value="security" className="gap-2">
                            <KeyRound className="w-4 h-4" />
                            Bezpieczeństwo
                        </TabsTrigger>
                        <TabsTrigger value="steam" className="gap-2">
                            <LinkIcon className="w-4 h-4" />
                            Steam
                        </TabsTrigger>
                    </TabsList>

                    {/* Zakładka Konto */}
                    <TabsContent value="account">
                        <Card>
                            <CardHeader>
                                <CardTitle>Informacje o koncie</CardTitle>
                                <CardDescription>
                                    Zarządzaj swoimi danymi i ustawieniami konta
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Nazwa użytkownika</label>
                                    <p className="text-lg">{user?.userName}</p>
                                </div>
                                <Separator />
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Email</label>
                                    <p className="text-lg">{user?.email}</p>
                                </div>
                            </CardContent>
                            <CardFooter className="flex justify-between">
                                <EditProfileDialog
                                    open={isEditDialogOpen}
                                    onOpenChange={setIsEditDialogOpen}
                                    user={user}
                                    onProfileUpdate={(updatedUser) => setUser(updatedUser)}
                                />
                                <DeleteUserDialog
                                    open={isDeleteDialogOpen}
                                    onOpenChange={setIsDeleteDialogOpen}
                                    userName={user?.userName}
                                    onDelete={handleDeleteAccount}
                                />
                            </CardFooter>
                        </Card>
                    </TabsContent>

                    {/* Zakładka Bezpieczeństwo */}
                    <TabsContent value="security">
                        <Card>
                            <CardHeader>
                                <CardTitle>Bezpieczeństwo</CardTitle>
                                <CardDescription>
                                    Zarządzaj hasłem i zabezpieczeniami konta
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Hasło</label>
                                    <p className="text-lg">••••••••</p>
                                </div>
                            </CardContent>
                            <CardFooter>
                                <ChangePasswordDialog
                                    open={isChangePasswordDialogOpen}
                                    onOpenChange={setIsChangePasswordDialogOpen}
                                />
                            </CardFooter>
                        </Card>
                    </TabsContent>

                    {/* Zakładka Steam */}
                    <TabsContent value="steam">
                        <Card>
                            <CardHeader>
                                <CardTitle>Ustawienia Steam</CardTitle>
                                <CardDescription>
                                    Zarządzaj swoimi ustawieniami Steam Trade
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <label className="text-sm font-medium">Trade URL</label>
                                        <Button 
                                            variant="ghost" 
                                            size="sm"
                                            className="text-xs"
                                            onClick={() => window.open('https://steamcommunity.com/my/tradeoffers/privacy#trade_offer_access_url', '_blank')}
                                        >
                                            Jak znaleźć Trade URL?
                                            <ExternalLink className="w-3 h-3 ml-1" />
                                        </Button>
                                    </div>
                                    {user?.tradeLink ? (
                                        <div className="flex items-center justify-between bg-muted p-3 rounded-md">
                                            <p className="text-sm truncate max-w-[300px]">{user.tradeLink}</p>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => setIsTradeLinkDialogOpen(true)}
                                            >
                                                Edytuj
                                            </Button>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center gap-4 bg-muted/50 p-6 rounded-lg">
                                            <LinkIcon className="w-8 h-8 text-muted-foreground" />
                                            <div className="text-center">
                                                <p className="text-sm text-muted-foreground">
                                                    Nie ustawiono jeszcze Trade URL
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    Trade URL jest wymagany do wypłacania przedmiotów
                                                </p>
                                            </div>
                                            <Button
                                                variant="default"
                                                onClick={() => setIsTradeLinkDialogOpen(true)}
                                            >
                                                Ustaw Trade URL
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>

                {/* Dialog edycji TradeLink */}
                <Dialog open={isTradeLinkDialogOpen} onOpenChange={setIsTradeLinkDialogOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Trade URL Steam</DialogTitle>
                            <DialogDescription>
                                Wprowadź swój Trade URL ze Steam, aby móc wypłacać przedmioty
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="tradeLink">Trade URL</Label>
                                <Input
                                    id="tradeLink"
                                    value={tradeLink}
                                    onChange={(e) => setTradeLink(e.target.value)}
                                    placeholder="https://steamcommunity.com/tradeoffer/new/..."
                                    className={!validateTradeLink(tradeLink) && tradeLink ? "border-red-500" : ""}
                                />
                                {!validateTradeLink(tradeLink) && tradeLink && (
                                    <p className="text-xs text-red-500">
                                        Nieprawidłowy format Trade URL
                                    </p>
                                )}
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsTradeLinkDialogOpen(false)}>
                                Anuluj
                            </Button>
                            <Button 
                                onClick={handleUpdateTradeLink}
                                disabled={!validateTradeLink(tradeLink)}
                            >
                                {!validateTradeLink(tradeLink) ? 'Nieprawidłowy Trade URL' : 'Zapisz'}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
}

export default Profile;