import React, { useState, useEffect } from 'react';

const EmployeeTable = () => {
  const [employees, setEmployees] = useState([]);
  const [visibleEmployees, setVisibleEmployees] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  useEffect(() => {
    fetch('http://localhost:3000/oracle/employees')
      .then(res => res.json())
      .then(data => {
        setEmployees(data);
        setCurrentPage(1);
      })
      .catch(err => console.error('Error fetching employees:', err));
  }, []);

  useEffect(() => {
    const indexOfLast = currentPage * perPage;
    const indexOfFirst = indexOfLast - perPage;
    setVisibleEmployees(employees.slice(indexOfFirst, indexOfLast));
  }, [employees, currentPage, perPage]);

  const totalPages = Math.ceil(employees.length / perPage);

  return (
    <div style={{ padding: '1rem' }}>
      <h1>Empleados</h1>

      <label htmlFor="perPage">Mostrar: </label>
      <select id="perPage" value={perPage} onChange={e => setPerPage(Number(e.target.value))}>
        <option value={10}>10</option>
        <option value={25}>25</option>
        <option value={50}>50</option>
      </select>

      <table border="1" cellPadding="5" cellSpacing="0" style={{ marginTop: '1rem', width: '100%' }}>
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

      <div style={{ marginTop: '1rem' }}>
        <button onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1}>
          Anterior
        </button>
        <span style={{ margin: '0 1rem' }}>Página {currentPage} de {totalPages}</span>
        <button onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages}>
          Siguiente
        </button>
      </div>
    </div>
  );
};

export default EmployeeTable;
