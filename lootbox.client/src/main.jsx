import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { createRoot } from 'react-dom/client'
import './index.css'
import Case from './Case/Case.jsx'
import CaseDetails from './CaseDetails/CaseDetails.jsx'
import CreateCase from './CreateCase/CreateCase';
import UpdateCase from './UpdateCase/UpdateCase';
import Navbar from './Navbar/Navbar';
import Item from './Item/Item';
import CreateItem from './CreateItem/CreateItem';
import UpdateItem from './UpdateItem/UpdateItem.jsx';
import ChangePassword from './ChangePassword/ChangePassword';
import Profile from './Profile/Profile';
import Equipment from './Equipment/Equipment';
import Users from './Users/Users';
import AddItemsToCasePage from './AddItemsToCasePage/AddItemsToCasePage';
import ItemDetailsPage  from './ItemDetails/ItemDetails.jsx';
import WalletComponent from './Wallet/Wallet.jsx';
import RankingComponent from './Ranking/Ranking.jsx';
import ContractComponent from './Contract/Contract.jsx';
import AdminWithdrawalsPage from './AdminWithdrawals/AdminWithdrawals.jsx';


createRoot(document.getElementById('root')).render(
    <Router>
        <Navbar />
        <Routes>
            <Route path="/" element={<Case />} />
            <Route path="/case/:caseid/items" element={<CaseDetails />} />
            <Route path="/case/create" element={<CreateCase />} />
            <Route path="/case/:caseid/update" element={<UpdateCase />} />
            <Route path="/items" element={<Item />} />
            <Route path="/item/:id" element={<ItemDetailsPage />} />
            <Route path="/item/create" element={<CreateItem />} />
            <Route path="/item/:itemid/update" element={<UpdateItem />} />
            <Route path="/change-password" element={<ChangePassword />} />
            <Route path="profile" element={<Profile />} />
            <Route path="/equipment" element={<Equipment />} />
            <Route path="/users" element={<Users />} />
            <Route path="/case/:caseId/add-items" element={<AddItemsToCasePage />} />
            <Route path="/wallet" element={<WalletComponent />} />
            <Route path="/ranking" element={<RankingComponent />} />
            <Route path="/contracts" element={<ContractComponent />} />
            <Route path="/withdrawals" element={<AdminWithdrawalsPage />} />
            </Routes>
    </Router>
)
