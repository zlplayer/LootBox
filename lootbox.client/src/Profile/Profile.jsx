/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import DeleteUserDialog from "@/Users/DeleteDialog";
import ChangePasswordDialog from "./ChangePasswordDialog";
import EditProfileDialog from "./EditProfileDialog";

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
                            <p className="text-lg font-semibold">
                                ********* <ChangePasswordDialog />
                            </p>
                        </div>
                        <Separator />
                        <div className="flex justify-end gap-4">
                            <DeleteUserDialog
                                userName={user.userName}
                                onDelete={() => handleDeleteAccount(user.id)}
                            />
                            <EditProfileDialog user={user} onProfileUpdate={(updatedUser) => setUser(updatedUser)} />
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

export default Profile;
