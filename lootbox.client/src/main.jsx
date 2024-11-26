import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { createRoot } from 'react-dom/client'
import './index.css'
import Case from './Case/Case.jsx'
import CaseDetails from './CaseDetails/CaseDetails.jsx'

createRoot(document.getElementById('root')).render(
    <Router>
        <Routes>
            <Route path="/" element={<Case />} />
            <Route path="/case/:caseid/items" element={<CaseDetails />} />
        </Routes>
    </Router>
)
