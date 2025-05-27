import { useState, useEffect, useContext } from 'react';
import { FaTrashAlt, FaEdit } from 'react-icons/fa';

import './EmployeesTable.css';
import { EmployeesContext } from '../../context/EmployeesContext';
import EmployeesForm from '../employeesForm/EmployeesForm';

const EmployeesTable = () => {
  const { reloadTrigger, triggerReload } = useContext(EmployeesContext);

  const [employees, setEmployees] = useState([]);
  const [searchField, setSearchField] = useState('FIRST_NAME');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  const [editingEmployee, setEditingEmployee] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formMode, setFormMode] = useState('create');

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await fetch('http://localhost:3000/empleados');
        const data = await res.json();
        setEmployees(data);
        setCurrentPage(1);
      } catch (err) {
        console.error('Error fetching employees:', err);
      }
    };

    fetchEmployees();
  }, [reloadTrigger]);

  const handleDelete = async (id) => {
    const confirm = window.confirm(`¿Estás seguro de que querés eliminar al empleado con ID ${id}?`);
    if (!confirm) return;

    try {
      const res = await fetch(`http://localhost:3000/empleados/${id}`, {
        method: 'DELETE',
      });
      const msg = await res.text();
      alert(msg);
      triggerReload();
    } catch (err) {
      console.error('Error eliminando empleado:', err);
      alert('Error eliminando empleado');
    }
  };

  const filteredEmployees = employees.filter(emp => {
    if (!searchTerm.trim()) return true;
    const value = emp[searchField];
    if (!value) return false;

    if (searchField === 'HIRE_DATE') {
      const hireDate = new Date(value).toLocaleDateString().toLowerCase();
      return hireDate.includes(searchTerm.toLowerCase());
    }

    return String(value).toLowerCase().includes(searchTerm.toLowerCase());
  });

  const indexOfLast = currentPage * perPage;
  const indexOfFirst = indexOfLast - perPage;
  const visibleEmployees = filteredEmployees.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredEmployees.length / perPage);

  return (
    <div className="employee-container">
      <h1>Empleados</h1>

      <button onClick={() => {
        setFormMode('create');
        setEditingEmployee(null);
        setShowModal(true);
      }} style={{ margin: '1rem 0' }}>
        Nuevo +
      </button>

      <div className="employee-controls">
        <label>Mostrar:
          <select value={perPage} onChange={e => {
            setPerPage(Number(e.target.value));
            setCurrentPage(1);
          }}>
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
        </label>

        <label>Buscar por:
          <select value={searchField} onChange={e => {
            setSearchField(e.target.value);
            setSearchTerm('');
            setCurrentPage(1);
          }}>
            <option value="FIRST_NAME">Nombre</option>
            <option value="LAST_NAME">Apellido</option>
            <option value="EMAIL">Email</option>
            <option value="HIRE_DATE">Fecha de Ingreso</option>
          </select>
        </label>

        <input
          type="text"
          placeholder="Buscar..."
          value={searchTerm}
          onChange={e => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
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
            <th>Acciones</th>
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
              <td>
                <button
                  onClick={() => handleDelete(emp.EMPLOYEE_ID)}
                  className="icon-button delete"
                  title="Eliminar"
                >
                  <FaTrashAlt />
                </button>

                <button
                  onClick={() => {
                    setFormMode('edit');
                    setEditingEmployee(emp);
                    setShowModal(true);
                  }}
                  className="icon-button edit"
                  title="Actualizar"
                >
                  <FaEdit />
                </button>
              </td>

            </tr>
          ))}
        </tbody>
      </table>

      <div className="pagination">
        <button
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          « Anterior
        </button>

        <span>Página {currentPage} de {totalPages}</span>

        <button
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          Siguiente »
        </button>
      </div>



      {showModal && (
        <EmployeesForm
          mode={formMode}
          employeeData={editingEmployee}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

export default EmployeesTable;
