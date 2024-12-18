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

const ChangePasswordDialog = ({ onPasswordChange }) => {
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    const userId = localStorage.getItem("id");

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            setError("Hasła nie są takie same.");
            return;
        }

        setError(null);
        setLoading(true);

        try {
            const response = await fetch(`/api/account/changePassword/${userId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    newPassword,
                    confirmPassword,
                }),
            });

            if (!response.ok) {
                throw new Error("Nie udało się zmienić hasła.");
            }

            alert("Hasło zostało zmienione pomyślnie.");
            setIsOpen(false);
            if (onPasswordChange) onPasswordChange();
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="outline">Zmień hasło</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Zmień hasło</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    {error && (
                        <div className="mb-4 text-red-500 text-sm">
                            {error}
                        </div>
                    )}
                    <div className="mb-4">
                        <label htmlFor="newPassword" className="block text-sm font-medium">
                            Nowe hasło
                        </label>
                        <Input
                            id="newPassword"
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="Wprowadź nowe hasło"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="confirmPassword" className="block text-sm font-medium">
                            Potwierdź hasło
                        </label>
                        <Input
                            id="confirmPassword"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Powtórz nowe hasło"
                            required
                        />
                    </div>
                    <DialogFooter>
                        <Button variant="secondary" onClick={() => setIsOpen(false)}>
                            Anuluj
                        </Button>
                        <Button type="submit" disabled={loading}>
                            {loading ? "Zmiana..." : "Zmień"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default ChangePasswordDialog;
