import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { createRoot } from 'react-dom/client'
import './index.css'
import Case from './Case/Case.jsx'
import CaseDetails from './CaseDetails/CaseDetails.jsx'
import CreateCase from './CreateCase/CreateCase';
import UpdateCase from './UpdateCase/UpdateCase';
import Navbar from './Navbar/Navbar';

createRoot(document.getElementById('root')).render(
    <Router>
        <Navbar />
        <Routes>
            <Route path="/" element={<Case />} />
            <Route path="/case/:caseid/items" element={<CaseDetails />} />
            <Route path="/case/create" element={<CreateCase />} />
            <Route path="/case/:caseid/update" element={<UpdateCase /> }/>
        </Routes>
    </Router>
)
