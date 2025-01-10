import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { UserCircle2, Search, Filter, Shield, Trash2 } from 'lucide-react';
import DeleteUserDialog from "./DeleteDialog";
import ChangeRoleDialog from "./ChangeRoleDialog";

function Users() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [roleFilter, setRoleFilter] = useState("all");

    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('userRole');

    // Przekierowanie jeśli nie admin
    useEffect(() => {
        if (userRole !== 'Admin') {
            navigate('/');
        }
    }, [userRole, navigate]);

    // Pobieranie użytkowników
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch('/api/account/users', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch users');
                }

                const data = await response.json();
                setUsers(data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, [token]);

    const handleDeleteUser = async (userId) => {
        try {
            const response = await fetch(`/api/account/${userId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to delete user');
            }

            setUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    };

    const handleChangeUserRole = async (userId, roleId) => {
        try {
            const response = await fetch(`/api/account/changeRole/${userId}?roleId=${roleId}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to change user role');
            }

            // Odśwież listę użytkowników
            const updatedUsersResponse = await fetch('/api/account/users', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            
            if (updatedUsersResponse.ok) {
                const updatedUsers = await updatedUsersResponse.json();
                setUsers(updatedUsers);
            }
        } catch (error) {
            console.error('Error changing user role:', error);
        }
    };

    // Filtrowanie użytkowników
    const filteredUsers = users.filter(user => {
        const matchesSearch = user.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            user.email.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesRole = roleFilter === "all" || user.role === roleFilter;
        return matchesSearch && matchesRole;
    });

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
            </div>
        );
    }

    return (
        <div className="min-h-screen p-6 bg-background">
            <div className="max-w-7xl mx-auto space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Zarządzanie użytkownikami</CardTitle>
                        <CardDescription>
                            Przeglądaj i zarządzaj użytkownikami systemu
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {/* Filtry */}
                        <div className="flex flex-col md:flex-row gap-4 mb-6">
                            <div className="flex-1 relative">
                                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Szukaj użytkownika..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-8"
                                />
                            </div>
                            <Select value={roleFilter} onValueChange={setRoleFilter}>
                                <SelectTrigger className="w-full md:w-[200px]">
                                    <Shield className="w-4 h-4 mr-2" />
                                    <SelectValue placeholder="Filtruj po roli" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Wszystkie role</SelectItem>
                                    <SelectItem value="Admin">Administrator</SelectItem>
                                    <SelectItem value="User">Użytkownik</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Tabela użytkowników */}
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-48">Użytkownik</TableHead>
                                        <TableHead>Email</TableHead>
                                        <TableHead>Rola</TableHead>
                                        <TableHead className="text-right">Akcje</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredUsers.map((user) => (
                                        <TableRow key={user.id}>
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <Avatar>
                                                        <AvatarFallback>
                                                            {user.userName[0]?.toUpperCase()}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <div className="font-medium">
                                                            {user.userName}
                                                        </div>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>{user.email}</TableCell>
                                            <TableCell>
                                                <Badge 
                                                    variant={user.role === "Admin" ? "default" : "secondary"}
                                                    className="gap-1"
                                                >
                                                    <Shield className="w-3 h-3" />
                                                    {user.role}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    <ChangeRoleDialog
                                                        user={user}
                                                        onChangeRole={(roleId) => handleChangeUserRole(user.id, roleId)}
                                                    />
                                                    <DeleteUserDialog
                                                        user={user}
                                                        onDelete={() => handleDeleteUser(user.id)}
                                                    />
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

export default Users;