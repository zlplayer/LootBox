/* eslint-disable no-unused-vars */
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Case.css';

function Case() {

    const [cases, setCase] = useState([]);
    const navigate = useNavigate();

    const userRole = localStorage.getItem('userRole');  // Pobierz rolê u¿ytkownika z localStorage

    useEffect(() => {
        allCase();
    }, []);

    const handleRowClick = (caseData) => {
        navigate(`/case/${caseData.id}/items`);
    };

    const handleUpdateClick = (caseData) => {
        navigate(`/case/${caseData.id}/update`);
    };

    const handleCreateCase = () => {
        navigate('/case/create');
    };

    const handleDeleteCase = async (id) => {
        if (!window.confirm('Are you sure you want to delete this case?')) {
            return;
        }

        try {
            const response = await fetch(`api/case/${id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error(`Failed to delete case with ID ${id}: ${response.statusText}`);
            }

            // Usuwanie elementu z listy po stronie klienta
            setCase((prevCases) => prevCases.filter((singleCase) => singleCase.id !== id));
            alert('Case deleted successfully!');
        } catch (error) {
            console.error('Error deleting case:', error);
            alert('Failed to delete case. Please try again.');
        }
    };

    const contents = cases.length === 0
        ? <p><em>Loading...</em></p>
        : <table className='table table-striped' aria-labelledby='tabelLabel'>
            <thead>
                <tr>
                    <th>CaseId</th>
                    <th>CaseName</th>
                    <th>CaseImage</th>
                    <th>CasePrice</th>
                    {userRole === 'Admin' && (  // SprawdŸ rolê u¿ytkownika przed renderowaniem przycisków
                        <>
                            <th>Delete</th>
                            <th>Update</th>
                        </>
                    )}
                </tr>
            </thead>
            <tbody>
                {cases.map(singleCase => (
                    <tr key={singleCase.id}>
                        <td onClick={() => handleRowClick(singleCase)}>{singleCase.id}</td>
                        <td onClick={() => handleRowClick(singleCase)}>{singleCase.name}</td>
                        <td onClick={() => handleRowClick(singleCase)}>{singleCase.image}</td>
                        <td onClick={() => handleRowClick(singleCase)}>{singleCase.price} </td>
                        {userRole === 'Admin' && (  // SprawdŸ rolê u¿ytkownika przed renderowaniem przycisków
                            <>
                                <td>
                                    <button
                                        className="btn btn-danger"
                                        onClick={() => handleDeleteCase(singleCase.id)}
                                    >
                                        Delete
                                    </button>
                                </td>
                                <td>
                                    <button
                                        className="btn btn-primary"
                                        onClick={() => handleUpdateClick(singleCase)}
                                    >
                                        Update
                                    </button>
                                </td>
                            </>
                        )}
                    </tr>
                ))}
            </tbody>
        </table>;

    return (
        <div>
            <h1>Case</h1>
            <p>This component demonstrates fetching data from the server.</p>
            {userRole === 'Admin' && (  // SprawdŸ rolê u¿ytkownika przed renderowaniem przycisku Create
                <button className="btn btn-primary" onClick={handleCreateCase}>
                    Create New Case
                </button>
            )}
            {contents}
        </div>
    );

    async function allCase() {
        try {
            const response = await fetch('api/case');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setCase(data);
        } catch (error) {
            console.error('Failed to fetch cases:', error);
        }
    }
}

export default Case;
