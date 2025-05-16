import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState } from 'react';

import Navbar from './components/navbar/Navbar';
import EmployeeTable from './components/employeesTable/EmployeesTable';
import EmployeeForm from './components/employeesForm/EmployeesForm';

function App() {
  const [reloadTrigger, setReloadTrigger] = useState(false);

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={
            <div style={{ textAlign: 'center', marginTop: '2rem' }}>
              <h2>Bienvenido</h2>
              <p>Seleccioná una opción del menú</p>
            </div>
          }
        />
        <Route
          path="/empleados"
          element={<EmployeeTable reloadTrigger={reloadTrigger} />}
        />
        <Route
          path="/alta"
          element={<EmployeeForm onSuccess={() => setReloadTrigger(!reloadTrigger)} />}
        />
      </Routes>
    </Router>
  );
}

export default App;
