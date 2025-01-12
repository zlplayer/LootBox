import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Wallet, Plus } from 'lucide-react';

function WalletComponent() {
  const [balance, setBalance] = useState(0);
  const [isAddMoneyDialogOpen, setIsAddMoneyDialogOpen] = useState(false);
  const [amountToAdd, setAmountToAdd] = useState('');
  const [loading, setLoading] = useState(true);
  const userId = localStorage.getItem('id');
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchWalletBalance();
  }, []);

  const fetchWalletBalance = async () => {
    try {
      const response = await fetch(`/api/wallet?userId=${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch wallet balance');
      }

      const data = await response.json();
      setBalance(data.money);
    } catch (error) {
      console.error('Error fetching wallet balance:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddMoney = async () => {
    try {
      const response = await fetch(`/api/wallet/addMoney?userId=${userId}&money=${amountToAdd}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'accept': '*/*'
        },
        body: ''
      });

      if (!response.ok) {
        throw new Error('Failed to add money');
      }

      await fetchWalletBalance();
      setIsAddMoneyDialogOpen(false);
      setAmountToAdd('');
    } catch (error) {
      console.error('Error adding money:', error);
      alert('Nie udało się dodać środków do portfela');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-background">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">Portfel</h1>
            <p className="text-muted-foreground">Zarządzaj swoimi środkami</p>
          </div>
          <Button
            onClick={() => setIsAddMoneyDialogOpen(true)}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Doładuj środki
          </Button>
        </div>

        {/* Main Content */}
        <Card className="w-full md:w-96">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Dostępne środki
            </CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{balance.toFixed(2)} zł</div>
            <p className="text-xs text-muted-foreground">
              Twoje aktualne saldo
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Add Money Dialog */}
      <Dialog open={isAddMoneyDialogOpen} onOpenChange={setIsAddMoneyDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Doładuj portfel</DialogTitle>
            <DialogDescription>
              Wprowadź kwotę, którą chcesz dodać do swojego portfela
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Kwota</label>
              <div className="relative">
                <Input
                  type="number"
                  step="0.01"
                  value={amountToAdd}
                  onChange={(e) => setAmountToAdd(e.target.value)}
                  placeholder="0.00"
                  className="pl-2 pr-12"
                />
                <span className="absolute right-3 top-2 text-sm text-muted-foreground">
                  PLN
                </span>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddMoneyDialogOpen(false)}>
              Anuluj
            </Button>
            <Button onClick={handleAddMoney} disabled={!amountToAdd || parseFloat(amountToAdd) <= 0}>
              Doładuj
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default WalletComponent;