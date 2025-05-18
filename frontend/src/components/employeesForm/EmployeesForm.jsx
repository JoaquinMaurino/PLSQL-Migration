import { useState, useContext } from 'react';
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

const EmployeeForm = () => {
  const { triggerReload } = useContext(EmployeesContext); // ✅ Context
  const [formData, setFormData] = useState(initialForm);
  const [message, setMessage] = useState('');
  const [showModal, setShowModal] = useState(false);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();

    try {
      const body = {
        ...formData,
        SALARY: formData.SALARY ? parseFloat(formData.SALARY) : null,
        COMMISSION_PCT: formData.COMMISSION_PCT ? parseFloat(formData.COMMISSION_PCT) : null,
        MANAGER_ID: formData.MANAGER_ID ? parseInt(formData.MANAGER_ID) : null,
        DEPARTMENT_ID: formData.DEPARTMENT_ID ? parseInt(formData.DEPARTMENT_ID) : null,
      };

      const res = await fetch('http://localhost:3000/oracle/alta-employee', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const result = await res.text();
      setMessage(result);
      setFormData(initialForm);
      setShowModal(false);

      triggerReload(); // ✅ Actualiza la tabla
    } catch (err) {
      console.error('Error al dar de alta:', err);
      setMessage('Error al procesar el alta');
    }
  };

  return (
    <>
      <button onClick={() => setShowModal(true)} style={{ margin: '1rem 0' }}>
        + Alta de Empleado
      </button>

      {showModal && (
        <div className="modal-container"> {/* ✅ antes era modal-overlay */}
          <div className="modal-content"> {/* ✅ antes era modal */}
            <span className="close-btn" onClick={() => setShowModal(false)}>&times;</span>
            <h2>Alta de Empleado</h2>
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
              <button type="submit">Cargar Empleado</button>
            </form>
            {message && <p><strong>{message}</strong></p>}
          </div>
        </div>
      )}

    </>
  );
};

export default EmployeeForm;
