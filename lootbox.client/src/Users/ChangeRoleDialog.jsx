import React, { useState } from "react";
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogFooter,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button"

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

const roles = [
    { id: 1, name: "User" },
    { id: 2, name: "Admin" },
];

const ChangeRoleDialog = ({ currentRole, onChangeRole }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedRole, setSelectedRole] = useState(
        roles.find((role) => role.name === currentRole)?.id || 1
    );

    const handleConfirm = () => {
        onChangeRole(selectedRole);
        setIsOpen(false);
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="primary">Zmień role</Button>
            </DialogTrigger>
            <DialogContent className="max-w-7xl mx-auto mb-8">
                <DialogHeader>
                    <DialogTitle>Zmień role uzytkownika</DialogTitle>
                </DialogHeader>
                <p>Wybierz role dla tego uzytkownika.</p>
                <label htmlFor="roleSelect">
                    Role
                </label>
                <Select value={selectedRole} onValueChange={setSelectedRole}>
                    <SelectTrigger >
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectLabel>Role</SelectLabel>
                            {roles.map((role) => (
                                <SelectItem key={role.id} value={role.id}>
                                    {role.name}
                                </SelectItem>
                            ))}
                        </SelectGroup>
                    </SelectContent>
                </Select>
                <DialogFooter>
                    <Button variant="secondary" onClick={() => setIsOpen(false)}>
                        Anuluj
                    </Button>
                    <Button  onClick={handleConfirm}>
                        Zmień role
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default ChangeRoleDialog;
