import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Item.css';
function Item() {

    const [item, setItem] = useState([]);
    const navigate = useNavigate();

    const handleCreateItem = () => {
        navigate('/item/create');
    };

    const handleUpdateItem = (item) => {
        navigate(`/item/${item.id}/update`);
    };

    useEffect(() => {
        allItems();
    }, [])

    const handleDeleteItem = async (id) => {
        if (!window.confirm('Are you sure you want to delete this case?')) {
            return;
        }

        try {
            const response = await fetch(`api/item/${id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error(`Failed to delete case with ID ${id}: ${response.statusText}`);
            }

            // Usuwanie elementu z listy po stronie klienta
            setItem((prevItems) => prevItems.filter((item) => item.id !== id));
            alert('Case deleted successfully!');
        } catch (error) {
            console.error('Error deleting case:', error);
            alert('Failed to delete case. Please try again.');
        }
    };

    const contents = <table className='table table-striped' aria-labelledby='tabelLabel'>
        <thead>
            <tr>
                <th>ItemID</th>
                <th>ItemName</th>
                <th>ItemImage</th>
                <th>ItemPrice</th>
                <th>ItemRarityColor</th>
                <th>ItemWearRatingName</th>
                <th>ItemTypeItemName</th>
            </tr>
        </thead>
        <tbody>
            {item.map((item) =>
                <tr key={item.id}>
                    <td>{item.id}</td>
                    <td>{item.name}</td>
                    <td>{item.image}</td>
                    <td>{item.price}</td>
                    <td>{item.rarityColor}</td>
                    <td>{item.wearRatingName}</td>
                    <td>{item.typeItemName}</td>
                    <td>
                        <button className="btn btn-danger" onClick={() => handleDeleteItem(item.id)}>
                            Delete
                        </button>
                    </td>
                    <td>
                            <button
                                className="btn btn-primary"
                                onClick={() => handleUpdateItem(item)}
                            >
                                Update
                            </button>
                        </td>
                </tr>
            )}
        </tbody>
    </table>;

    return (
        <div>
            <h1>Items</h1>
            <p>This component demonstrates fetching data from the server.</p>
            <button className="btn btn-primary" onClick={handleCreateItem}>
                Create New Case
            </button>
            {contents}
        </div>
    )


    async function allItems() {
        const response = await fetch('api/item');

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setItem(data);
    }
}

export default Item;
