import { useState, useEffect } from 'react';
import './EmployeesTable.css';

const EmployeeTable = ({ reloadTrigger }) => {
  const [employees, setEmployees] = useState([]);
  const [visibleEmployees, setVisibleEmployees] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [searchField, setSearchField] = useState('FIRST_NAME'); // campo a filtrar
  const [searchTerm, setSearchTerm] = useState(''); // valor buscado

useEffect(() => {
  fetch('http://localhost:3000/oracle/employees')
    .then(res => res.json())
    .then(data => {
      setEmployees(data);
      setCurrentPage(1);
    })
    .catch(err => console.error('Error fetching employees:', err));
}, [reloadTrigger]); // ← 🔄 escucha recarga


  // Filtrar empleados según campo y término de búsqueda
  const filteredEmployees = employees.filter(emp => {
    if (!searchTerm.trim()) return true;

    const value = emp[searchField];
    if (!value) return false;

    // Formateo especial para fechas
    if (searchField === 'HIRE_DATE') {
      const hireDate = new Date(value).toLocaleDateString().toLowerCase();
      return hireDate.includes(searchTerm.toLowerCase());
    }

    return String(value).toLowerCase().includes(searchTerm.toLowerCase());
  });

  const totalPages = Math.ceil(filteredEmployees.length / perPage);

  useEffect(() => {
    const indexOfLast = currentPage * perPage;
    const indexOfFirst = indexOfLast - perPage;
    setVisibleEmployees(filteredEmployees.slice(indexOfFirst, indexOfLast));
  }, [filteredEmployees, currentPage, perPage]);

  return (
    <div className="employee-container">
      <h1>Empleados</h1>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
        <label htmlFor="perPage">Mostrar:</label>
        <select id="perPage" value={perPage} onChange={e => setPerPage(Number(e.target.value))}>
          <option value={10}>10</option>
          <option value={25}>25</option>
          <option value={50}>50</option>
        </select>

        <label htmlFor="searchField">Buscar por:</label>
        <select id="searchField" value={searchField} onChange={e => setSearchField(e.target.value)}>
          <option value="FIRST_NAME">Nombre</option>
          <option value="LAST_NAME">Apellido</option>
          <option value="EMAIL">Email</option>
          <option value="HIRE_DATE">Fecha de Ingreso</option>
        </select>

        <input
          type="text"
          placeholder="Buscar..."
          value={searchTerm}
          onChange={e => {
            setSearchTerm(e.target.value);
            setCurrentPage(1); // Reiniciar a página 1 cuando se filtra
          }}
        />
      </div>

      <table className="employee-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Apellido</th>
            <th>Email</th>
            <th>Fecha de Ingreso</th>
          </tr>
        </thead>
        <tbody>
          {visibleEmployees.map(emp => (
            <tr key={emp.EMPLOYEE_ID}>
              <td>{emp.EMPLOYEE_ID}</td>
              <td>{emp.FIRST_NAME}</td>
              <td>{emp.LAST_NAME}</td>
              <td>{emp.EMAIL}</td>
              <td>{new Date(emp.HIRE_DATE).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="pagination-controls">
        <button onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1}>
          Anterior
        </button>
        <span>Página {currentPage} de {totalPages}</span>
        <button onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages}>
          Siguiente
        </button>
      </div>
    </div>
  );
};

export default EmployeeTable;
