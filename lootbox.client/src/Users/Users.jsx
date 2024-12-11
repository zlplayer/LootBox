/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

import { Trash2, UserCog } from 'lucide-react';

import DeleteUserDialog from "./DeleteDialog"; // Import dialogu do usuwania
import ChangeRoleDialog from "./ChangeRoleDialog"; // Import dialogu do zmiany roli

function Users() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const navigate = useNavigate();

    const token = localStorage.getItem('token'); // Token JWT
    const userRole = localStorage.getItem('userRole'); // Rola użytkownika

    // Funkcja do pobierania użytkowników
    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/account/users', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`, // Przekazanie tokenu w nagłówku
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch users');
            }

            const data = await response.json();
            setUsers(data); // Zapisz dane użytkowników w stanie
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (userRole !== 'Admin') {
            navigate('/'); // Jeżeli użytkownik nie jest administratorem, przekieruj go na stronę główną
        } else {
            fetchUsers(); // Wywołaj funkcję fetchUsers
        }
    }, [token, userRole, navigate]);

    // Funkcja do usuwania użytkownika
    const handleDeleteUser = async (userId) => {
        try {
            const response = await fetch(`/api/account/${userId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to delete user');
            }

            fetchUsers(); // Odśwież dane użytkowników
        } catch (error) {
            setError(error.message);
        }
    };

    // Funkcja do zmiany roli użytkownika
    const handleChangeUserRole = async (userId, roleId) => {
        try {
            const response = await fetch(`/api/account/changeRole/${userId}?roleId=${roleId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to change user role');
            }

            fetchUsers(); // Odśwież dane użytkowników
        } catch (error) {
            setError(error.message);
        }
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>Error: {error}</p>;
    }

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead></TableHead>
                    <TableHead>User Name</TableHead>
                    <TableHead>E-mail</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Delete</TableHead>
                    <TableHead>Change Role</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {users.map((user) => (
                    <TableRow key={user.id}>
                        <TableCell></TableCell>
                        <TableCell>{user.userName}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.role}</TableCell>
                        <TableCell>
                            <Button variant="destructive" className="flex items-center gap-1">
                                <Trash2 className="w-4 h-4"/>
                                <DeleteUserDialog
                                    userName={user.userName}
                                    onDelete={() => handleDeleteUser(user.id)}
                                />
                            </Button>
                        </TableCell>
                        <TableCell>
                            <Button variant="secondary" className="flex items-center gap-1">
                                <UserCog className="w-4 h-4"/>
                                <ChangeRoleDialog
                                    currentRole={user.role}
                                    onChangeRole={(roleId) => handleChangeUserRole(user.id, roleId)}
                                />
                            </Button>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}

export default Users;
