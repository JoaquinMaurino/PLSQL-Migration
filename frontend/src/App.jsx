import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

import EmployeeTable from './components/employeesTable/EmployeesTable';
import EmployeeForm from './components/employeesForm/EmployeesForm';

function App() {
  const [reloadTrigger, setReloadTrigger] = useState(false);

  return (
    <Router>
      <div className="app-container">
        <nav style={{ marginBottom: '1rem' }}>
          <Link to="/empleados" style={{ marginRight: '1rem' }}>Empleados</Link>
          <Link to="/alta">Alta Empleado</Link>
        </nav>

        <Routes>
          <Route
            path="/empleados"
            element={<EmployeeTable reloadTrigger={reloadTrigger} />}
          />
          <Route
            path="/alta"
            element={<EmployeeForm onSuccess={() => setReloadTrigger(!reloadTrigger)} />}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
