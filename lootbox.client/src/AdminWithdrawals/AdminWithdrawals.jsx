import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Search,
  CheckCircle2,
  ExternalLink,
  Clock,
  ArrowUpFromLine,
} from 'lucide-react';

function AdminWithdrawalsPage() {
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedWithdrawal, setSelectedWithdrawal] = useState(null);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('userRole');

  useEffect(() => {
    if (userRole !== 'Admin') {
      window.location.href = '/';
      return;
    }
    fetchWithdrawals();
  }, []);

  const fetchWithdrawals = async () => {
    try {
      const response = await fetch('/api/ItemWithdrawal', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) throw new Error('Nie udało się pobrać danych o wypłatach');

      const data = await response.json();
      setWithdrawals(data);
    } catch (error) {
      console.error('Error fetching withdrawals:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptWithdrawal = async (id) => {
    try {
      const response = await fetch(`/api/ItemWithdrawal?id=${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) throw new Error('Nie udało się zaakceptować wypłaty');

      await fetchWithdrawals();
      setIsConfirmDialogOpen(false);
      setSelectedWithdrawal(null);
    } catch (error) {
      console.error('Error accepting withdrawal:', error);
      alert('Nie udało się zaakceptować wypłaty');
    }
  };

  const filteredWithdrawals = withdrawals.filter(withdrawal => 
    withdrawal.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    withdrawal.userName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
        {/* Nagłówek */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">Zarządzanie wypłatami</h1>
            <p className="text-muted-foreground">
              Zarządzaj wypłatami przedmiotów użytkowników
            </p>
          </div>
        </div>

        {/* Filtrowanie */}
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Szukaj po nazwie przedmiotu lub użytkowniku..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>

        {/* Lista wypłat */}
        <Card>
          <CardHeader>
            <CardTitle>Lista wypłat</CardTitle>
            <CardDescription>
              Lista wszystkich wypłat przedmiotów oczekujących na akceptację
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Użytkownik</TableHead>
                    <TableHead>Przedmiot</TableHead>
                    <TableHead>Trade URL</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Akcje</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredWithdrawals.map((withdrawal) => (
                    <TableRow key={withdrawal.id}>
                      <TableCell>{withdrawal.userName}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10">
                            <img
                              src={`data:image/png;base64,${withdrawal.image}`}
                              alt={withdrawal.name}
                              className="w-full h-full object-contain"
                            />
                          </div>
                          <div>
                            <div className="font-medium">{withdrawal.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {withdrawal.price.toFixed(2)} zł
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-xs"
                          onClick={() => window.open(withdrawal.tradeLink, '_blank')}
                        >
                          Otwórz Trade URL
                          <ExternalLink className="w-3 h-3 ml-1" />
                        </Button>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className={withdrawal.isAccepted ? 
                            "bg-green-500/20 text-green-600" : 
                            "bg-yellow-500/20 text-yellow-600"
                          }
                        >
                          {withdrawal.isAccepted ? (
                            <>
                              <CheckCircle2 className="w-3 h-3 mr-1" />
                              Zaakceptowano
                            </>
                          ) : (
                            <>
                              <Clock className="w-3 h-3 mr-1" />
                              Oczekuje
                            </>
                          )}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {!withdrawal.isAccepted && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedWithdrawal(withdrawal);
                              setIsConfirmDialogOpen(true);
                            }}
                          >
                            <ArrowUpFromLine className="w-4 h-4 mr-2" />
                            Akceptuj wypłatę
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredWithdrawals.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center p-8">
                        <div className="flex flex-col items-center justify-center text-muted-foreground gap-2">
                          <CheckCircle2 className="w-8 h-8" />
                          <p>Brak wypłat do przetworzenia</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Dialog potwierdzenia */}
      <AlertDialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Potwierdź akceptację wypłaty</AlertDialogTitle>
            <AlertDialogDescription>
              Czy na pewno chcesz zaakceptować wypłatę przedmiotu "{selectedWithdrawal?.name}" dla użytkownika {selectedWithdrawal?.userName}?
              Po zaakceptowaniu należy wysłać przedmiot na podany Trade URL.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Anuluj</AlertDialogCancel>
            <AlertDialogAction onClick={() => handleAcceptWithdrawal(selectedWithdrawal?.id)}>
              Akceptuj wypłatę
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default AdminWithdrawalsPage;