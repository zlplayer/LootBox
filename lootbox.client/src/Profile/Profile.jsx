/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import DeleteUserDialog from "@/Users/DeleteDialog";
import ChangePasswordDialog from "./ChangePasswordDialog";
import EditProfileDialog from "./EditProfileDialog";

import { Trash2, Pencil, Key } from "lucide-react"; // Dodajemy ikony z lucide-react

function Profile() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const userId = localStorage.getItem("id"); // ID użytkownika z localStorage
    const token = localStorage.getItem("token"); // Token JWT

    useEffect(() => {
        if (!token || !userId) {
            setError("No token or user ID found");
            setLoading(false);
            return;
        }

        const fetchUserData = async () => {
            try {
                const response = await fetch(`/api/account/user/${userId}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error("Failed to fetch user data");
                }

                const data = await response.json();
                setUser(data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [token, userId]);

    const handleDeleteAccount = async () => {
        if (!userId || !token) {
            setError("No user ID or token found");
            return;
        }

        try {
            const response = await fetch(`/api/account/${userId}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error("Failed to delete user account");
            }

            localStorage.clear();
            window.location.href = "/";
        } catch (error) {
            setError(error.message);
        }
    };

    if (loading) {
        return (
            <div className="max-w-md mx-auto mt-10">
                <Card>
                    <CardHeader>
                        <CardTitle>Loading...</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Skeleton className="h-6 w-1/2 mb-4" />
                        <Skeleton className="h-6 w-2/3 mb-4" />
                        <Skeleton className="h-6 w-full mb-4" />
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-md mx-auto mt-10">
                <Card>
                    <CardHeader>
                        <CardTitle>Error</CardTitle>
                        <CardDescription>{error}</CardDescription>
                    </CardHeader>
                </Card>
            </div>
        );
    }

    return (
        <div className="max-w-md mx-auto mt-10">
            <Card>
                <CardHeader>
                    <CardTitle>User Profile</CardTitle>
                    <CardDescription>Manage your account information and settings</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div>
                            <p className="text-sm font-medium">Username</p>
                            <p className="text-lg font-semibold">{user.userName}</p>
                        </div>
                        <Separator />
                        <div>
                            <p className="text-sm font-medium">Email</p>
                            <p className="text-lg font-semibold">{user.email}</p>
                        </div>
                        <Separator />
                        <div>
                            <p className="text-sm font-medium">Password</p>
                            <p className="text-lg font-semibold flex items-center">
                                *********
                                <span className="ml-2"> 
                                  {/* Dodajemy odstęp i ikonę Key przy ChangePasswordDialog */}
                                  <ChangePasswordDialog 
                                    trigger={
                                      <Button variant="outline" size="sm" className="flex items-center gap-1 ml-2">
                                        <Key className="w-4 h-4" />
                                        Change Password
                                      </Button>
                                    }
                                  />
                                </span>
                            </p>
                        </div>
                        <Separator />
                        <div className="flex justify-end gap-4">
                            {/* Delete User Dialog z ikoną kosza */}
                            <DeleteUserDialog
                                userName={user.userName}
                                onDelete={() => handleDeleteAccount(user.id)}
                                trigger={
                                    <Button variant="destructive" className="flex items-center gap-1">
                                        <Trash2 className="w-4 h-4" />
                                        Delete Account
                                    </Button>
                                }
                            />

                            {/* Edit Profile Dialog z ikoną ołówka */}
                            <EditProfileDialog 
                                user={user} 
                                onProfileUpdate={(updatedUser) => setUser(updatedUser)}
                                trigger={
                                    <Button variant="secondary" className="flex items-center gap-1">
                                        <Pencil className="w-4 h-4" />
                                        Edit Profile
                                    </Button>
                                }
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

export default Profile;
