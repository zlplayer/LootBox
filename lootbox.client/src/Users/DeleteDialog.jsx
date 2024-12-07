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
            <Button variant="destructive">Delete</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
                    <AlertDialogDescription>
                        Are you sure you want to delete the user "{userName}"? This action cannot be undone.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel asChild>
                        <Button variant="secondary" onClick={() => setIsOpen(false)}>Cancel</Button>
                    </AlertDialogCancel>
                    <AlertDialogAction asChild>
                        <Button onClick={handleConfirm}>Yes</Button>
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default DeleteUserDialog;
