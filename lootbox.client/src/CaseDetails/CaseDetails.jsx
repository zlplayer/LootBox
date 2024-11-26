import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import './CaseDetails.css';

function CaseDetails() {
    const { caseid } = useParams();
    const [caseDetails, setCaseDetails] = useState(null);

    useEffect(() => {
        fetchCaseDetails(caseid); // Pobieramy dane po ka¿dej zmianie caseid
    }, [caseid]);

    async function fetchCaseDetails(caseId) {
        try {
            console.log(`Fetching case details for: ${caseId}`);
            const response = await fetch(`http://localhost:5117/api/case/${caseId}/items`);
            console.log('Response:', response);
            if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`);
            }
            const data = await response.json();
            console.log('Data:', data);
            setCaseDetails(data);
        } catch (error) {
            console.error('Failed to fetch case details:', error);
        }
    }

    if (!caseDetails) {
        return <p>Loading case details...</p>;
    }

    return (
        <div>
            <h1>Case Details</h1>
            <div>
                <h2>Items:</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Image</th>
                            <th>Price</th>
                            <th>Rarity</th>
                            <th>Wear Rating</th>
                            <th>Type</th>
                        </tr>
                    </thead>
                    <tbody>
                        {caseDetails.map(item => (
                            <tr key={item.id}>
                                <td>{item.name}</td>
                                <td><img src={item.image} alt={item.name} width="50" height="50" /></td>
                                <td>${item.price}</td>
                                <td>{item.rarityColor}</td>
                                <td>{item.wearRatingName}</td>
                                <td>{item.typeItemName}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default CaseDetails;
