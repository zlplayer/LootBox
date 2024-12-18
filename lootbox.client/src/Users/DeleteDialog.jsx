import React, { useState } from "react";
import { Button } from "@/components/ui/button"

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";


const DeleteUserDialog = ({ userName, onDelete }) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleConfirm = () => {
        onDelete();
        setIsOpen(false); // Zamknij dialog po potwierdzeniu
    };

    return (
        <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
            <AlertDialogTrigger asChild>
            <Button variant="destructive">Usuń konto</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Potwierdź usunięcie konta</AlertDialogTitle>
                    <AlertDialogDescription>
                        Jesteś pewien że chcesz usunąć użytkownika "{userName}"? Tej akcji nie można cofnąć.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel asChild>
                        <Button variant="secondary" onClick={() => setIsOpen(false)}>Anuluj</Button>
                    </AlertDialogCancel>
                    <AlertDialogAction asChild>
                        <Button onClick={handleConfirm}>Tak</Button>
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default DeleteUserDialog;
