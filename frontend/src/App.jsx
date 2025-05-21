import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/navbar/Navbar';
import EmployeeTable from './components/employeesTable/EmployeesTable';

function App() {
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
        <Route path="/empleados" element={<EmployeeTable />} />
      </Routes>
    </Router>
  );
}

export default App;
