/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button";

function Users() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const navigate = useNavigate();

    const token = localStorage.getItem('token');  // Token JWT
    const userRole = localStorage.getItem('userRole');  // Rola u�ytkownika

    useEffect(() => {
        // Sprawdzenie, czy u�ytkownik jest administratorem
        if (userRole !== 'Admin') {
            navigate('/'); // Je�li u�ytkownik nie jest administratorem, przekieruj go na stron� g��wn�
        } else {
            // Wykonaj zapytanie do endpointu /api/account/users, je�li u�ytkownik ma rol� admin
            const fetchUsers = async () => {
                try {
                    const response = await fetch('/api/account/users', {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`,  // Przekazanie tokenu w nag��wku
                        },
                    });

                    if (!response.ok) {
                        throw new Error('Failed to fetch users');
                    }

                    const data = await response.json();
                    setUsers(data);  // Zapisz dane u�ytkownik�w w stanie
                } catch (error) {
                    setError(error.message);
                } finally {
                    setLoading(false);
                }
            };

            fetchUsers();  // Wywo�aj funkcj� fetchUsers
        }
    }, [token, userRole, navigate]);

    // Funkcja do usuwania u�ytkownika
    const handleDeleteUser = async (userId) => {
        if (window.confirm("Are you sure you want to delete this user?")) {
            try {
                const response = await fetch(`/api/account/${userId}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,  // Przekazanie tokenu w nag��wku
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to delete user');
                }

                // Po usuni�ciu u�ytkownika, zaktualizuj list� u�ytkownik�w
                setUsers((prevUsers) => prevUsers.filter(user => user.id !== userId));
                alert('User deleted successfully');
            } catch (error) {
                setError(error.message);
            }
        }
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>Error: {error}</p>;
    }

    return (
        <div>
            <h2>All Users</h2>
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
                                <Button variant="destructive"
                                    onClick={() => handleDeleteUser(user.id)}
                                >
                                    Delete
                                </Button>
                            </TableCell>
                            <TableCell>
                                <Button variant="destructive"
                                    onClick={() => handleDeleteUser(user.id)}
                                >
                                    Delete
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}

export default Users;
