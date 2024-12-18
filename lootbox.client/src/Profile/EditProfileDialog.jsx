import React, { useState } from "react";
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const EditProfileDialog = ({ user, onProfileUpdate }) => {
    const [userName, setUserName] = useState(user?.userName || "");
    const [email, setEmail] = useState(user?.email || "");
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    const userId = localStorage.getItem("id");
    const token = localStorage.getItem("token");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);
    
        try {
            const response = await fetch(`/api/account/${userId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    userName,
                    email,
                }),
            });
    
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Failed to update profile: ${errorText}`);
            }
    
            const responseData = await response.text();
            const updatedUser = responseData ? JSON.parse(responseData) : {};
            setIsOpen(false);
            if (onProfileUpdate) onProfileUpdate(updatedUser);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };
    

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="outline">Edytuj profil</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edytuj profil</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    {error && (
                        <div className="mb-4 text-red-500 text-sm">
                            {error}
                        </div>
                    )}
                    <div className="mb-4">
                        <label htmlFor="userName" className="block text-sm font-medium">
                            Nazwa użytkownika
                        </label>
                        <Input
                            id="userName"
                            type="text"
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-sm font-medium">
                            Email
                        </label>
                        <Input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <DialogFooter>
                        <Button variant="secondary" onClick={() => setIsOpen(false)}>
                            Anuluj
                        </Button>
                        <Button type="submit" disabled={loading}>
                            {loading ? "Zapisywanie..." : "Zapisz"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default EditProfileDialog;
