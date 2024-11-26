/* eslint-disable no-unused-vars */
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Case.css';

function Case() {

    const [cases, setCase] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        allCase();
    }, []);


    const handleRowClick = (caseData) => {
        navigate(`/case/${caseData.id}/items`);
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
                </tr>
            </thead>
            <tbody>
                {cases.map(singleCase => (
                    <tr key={singleCase.id} onClick={()=> handleRowClick(singleCase)}>
                        <td>{singleCase.id}</td>
                        <td>{singleCase.name}</td>
                        <td>{singleCase.image}</td>
                        <td>{singleCase.price}</td>
                    </tr>
                ))}
            </tbody>
        </table>;

  return (
      <div>
          <h1>Case</h1>
          <p>This component demonstrates fetching data from the server.</p>
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