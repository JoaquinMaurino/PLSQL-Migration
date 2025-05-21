import { useState, useContext, useEffect } from 'react';
import { EmployeesContext } from '../../context/EmployeesContext';
import './EmployeesForm.css';

const initialForm = {
  FIRST_NAME: '',
  LAST_NAME: '',
  EMAIL: '',
  PHONE_NUMBER: '',
  HIRE_DATE: '',
  JOB_ID: '',
  SALARY: '',
  COMMISSION_PCT: '',
  MANAGER_ID: '',
  DEPARTMENT_ID: '',
};

const EmployeesForm = ({ mode = 'create', employeeData = null, onClose }) => {
  const { triggerReload } = useContext(EmployeesContext);
  const [formData, setFormData] = useState(initialForm);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (mode === 'edit' && employeeData) {
      console.log('Employee data recibido: ', employeeData);

      const normalizedData = {
        FIRST_NAME: employeeData.FIRST_NAME || '',
        LAST_NAME: employeeData.LAST_NAME || '',
        EMAIL: employeeData.EMAIL || '',
        PHONE_NUMBER: employeeData.PHONE_NUMBER || '',
        HIRE_DATE: employeeData.HIRE_DATE
          ? new Date(employeeData.HIRE_DATE).toISOString().split('T')[0]
          : '',
        JOB_ID: employeeData.JOB_ID || '',
        SALARY: employeeData.SALARY != null ? String(employeeData.SALARY) : '',
        COMMISSION_PCT: employeeData.COMMISSION_PCT != null ? String(employeeData.COMMISSION_PCT) : '',
        MANAGER_ID: employeeData.MANAGER_ID != null ? String(employeeData.MANAGER_ID) : '',
        DEPARTMENT_ID: employeeData.DEPARTMENT_ID != null ? String(employeeData.DEPARTMENT_ID) : '',
      };

      setFormData(normalizedData);
    }
  }, [mode, employeeData]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);


  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();

    const body = {
      ...formData,
      SALARY: formData.SALARY ? parseFloat(formData.SALARY) : null,
      COMMISSION_PCT: formData.COMMISSION_PCT ? parseFloat(formData.COMMISSION_PCT) : null,
      MANAGER_ID: formData.MANAGER_ID ? parseInt(formData.MANAGER_ID) : null,
      DEPARTMENT_ID: formData.DEPARTMENT_ID ? parseInt(formData.DEPARTMENT_ID) : null,
    };

    const url = mode === 'edit'
      ? `http://localhost:3000/oracle/actualizar-employee/${employeeData.EMPLOYEE_ID}`
      : 'http://localhost:3000/oracle/alta-employee';

    const method = mode === 'edit' ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const result = await res.text();
      setMessage(result);
      triggerReload();
      onClose(); // cierra el modal
    } catch (err) {
      console.error('Error en formulario:', err);
      setMessage('Error al procesar');
    }
  };

  return (
    <div className="modal-container">
      <div className="modal-content">
        <span className="close-btn" onClick={onClose}>&times;</span>
        <h2>{mode === 'edit' ? 'Actualizar Empleado' : 'Alta de Empleado'}</h2>
        <form onSubmit={handleSubmit}>
          {Object.keys(initialForm).map(field => (
            <label key={field}>
              {field.replace(/_/g, ' ')}:
              <input
                type={field === 'HIRE_DATE' ? 'date' : 'text'}
                name={field}
                value={formData[field]}
                onChange={handleChange}
                required={['LAST_NAME', 'EMAIL', 'HIRE_DATE', 'JOB_ID'].includes(field)}
              />
            </label>
          ))}
          <button type="submit">
            {mode === 'edit' ? 'Actualizar Empleado' : 'Cargar Empleado'}
          </button>
        </form>
        {message && <p><strong>{message}</strong></p>}
      </div>
    </div>
  );
};

export default EmployeesForm;