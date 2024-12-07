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
                <Button variant="primary">Change Role</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Change User Role</DialogTitle>
                </DialogHeader>
                <p>Please select the new role for this user.</p>
                <label htmlFor="roleSelect">
                    Role
                </label>
                <Select value={selectedRole} onValueChange={setSelectedRole}>
                    <SelectTrigger >
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectLabel>Roles</SelectLabel>
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
                        Cancel
                    </Button>
                    <Button  onClick={handleConfirm}>
                        Confirm Change
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default ChangeRoleDialog;
