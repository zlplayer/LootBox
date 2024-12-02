import React, { useState, useEffect } from 'react';

function Equipment() {
    const [equipment, setEquipment] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const userId = localStorage.getItem('id');  // Zak³adam, ¿e masz zapisane ID u¿ytkownika w localStorage

    // Pobierz dane sprzêtu u¿ytkownika
    useEffect(() => {
        const fetchEquipment = async () => {
            try {
                const response = await fetch(`/api/equipment/${userId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}` // Autoryzacja za pomoc¹ tokenu JWT
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch equipment');
                }

                const data = await response.json();
                setEquipment(data); // Ustawienie danych w stanie
            } catch (error) {
                setError(error.message); // Ustawienie b³êdu w przypadku niepowodzenia
            } finally {
                setLoading(false);  // Zakoñczenie ³adowania
            }
        };

        fetchEquipment(); // Wywo³anie funkcji do pobierania danych
    }, [userId]);

    // Funkcja do usuwania sprzêtu
    const handleDeleteEquipment = async (id) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this equipment?');
        if (!confirmDelete) return;

        try {
            const response = await fetch(`/api/equipment/${id}`, {
                method: 'DELETE',  // Metoda do usuwania
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`, // Autoryzacja za pomoc¹ tokenu JWT
                },
            });

            if (!response.ok) {
                throw new Error('Failed to delete equipment');
            }

            // Po udanym usuniêciu, usuñ sprzêt z tabeli
            setEquipment(equipment.filter(item => item.id !== id));
        } catch (error) {
            setError(error.message); // Obs³uguje b³êdy
        }
    };

    // £adowanie, jeœli dane s¹ w trakcie ³adowania
    if (loading) {
        return <p>Loading equipment...</p>;
    }

    // Wyœwietlanie b³êdów, jeœli coœ posz³o nie tak
    if (error) {
        return <p>Error: {error}</p>;
    }

    return (
        <div>
            <h2>Equipment List</h2>
            <table className="table">
                <thead>
                    <tr>
                        <th>Equipment Name</th>
                        <th>Equipment Image</th>
                        <th>Equipment Price</th>
                        <th>Equipment Rarity Color</th>
                        <th>Equipment Wear Rating</th>
                        <th>Equipment Type</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {equipment.map((item) => (
                        <tr key={item.id}>
                            <td>{item.name}</td>
                            <td>
                                <img src={item.image} alt={item.name} width={50} height={50} />
                            </td>
                            <td>{item.price}</td>
                            <td>
                                <span style={{ color: item.rarityColor }}>{item.rarityColor}</span>
                            </td>
                            <td>{item.wearRatingName}</td>
                            <td>{item.typeItemName}</td>
                            <td>
                                <button
                                    className="btn btn-danger"
                                    onClick={() => handleDeleteEquipment(item.id)}
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default Equipment;
