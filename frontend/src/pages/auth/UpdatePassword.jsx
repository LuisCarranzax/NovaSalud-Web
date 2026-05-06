import React, { useState } from 'react';
import { FiMail, FiLock, FiEye, FiEyeOff, FiAlertCircle, FiCheckCircle } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api'; // Importamos Axios
import '../../css/auth/Register.css'; // Ajusta la ruta de tu CSS si es necesario

const UpdatePassword = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [passwords, setPasswords] = useState({ newPassword: '', confirmNewPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [alert, setAlert] = useState(null);
  const navigate = useNavigate();

  // MANEJO DEL PASO 1: Verificar Correo en MongoDB
  const handleVerifyEmail = async (e) => {
    e.preventDefault();
    if (!email) {
      setAlert({ type: 'error', message: 'Ingresa tu correo para continuar.' });
      return;
    }

    try {
      // Petición real al backend
      await api.post('/auth/verify-email', { correo: email });
      
      // Si la petición es exitosa (código 200), pasamos al paso 2
      setAlert(null);
      setStep(2);
    } catch (error) {
      // Si el backend devuelve un 404, mostramos el error
      setAlert({ 
        type: 'error', 
        message: error.response?.data?.message || 'Error de conexión con el servidor.' 
      });
    }
  };

  // MANEJO DEL PASO 2: Actualizar Contraseña en MongoDB
  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    
    if (!passwords.newPassword || !passwords.confirmNewPassword) {
      setAlert({ type: 'error', message: 'Completa ambos campos de contraseña.' });
      return;
    }

    if (passwords.newPassword !== passwords.confirmNewPassword) {
      setAlert({ type: 'error', message: 'Las contraseñas no coinciden.' });
      return;
    }

    try {
      // Enviamos el correo (que guardamos en el Paso 1) y la nueva clave
      await api.put('/auth/update-password', { 
          correo: email, 
          newPassword: passwords.newPassword 
      });

      setAlert({ type: 'success', message: '¡Contraseña actualizada con éxito! Redirigiendo...' });
      
      // Redirigimos al Login usando react-router-dom
      setTimeout(() => navigate('/login'), 2000);
    } catch (error) {
      setAlert({ 
        type: 'error', 
        message: error.response?.data?.message || 'Hubo un error al actualizar la contraseña.' 
      });
    }
  };

  return (
    <div className="auth-page-container view-transition">
      <div className="auth-split-panel">
        
        <div className="auth-form-side">
          <div className="auth-form-content">
            <h1 className="welcome-text">Recuperar Acceso</h1>
            <p className="subtitle-text">
              {step === 1 ? "Ingresa tu correo para buscar tu cuenta" : "Establece tu nueva credencial de seguridad"}
            </p>
            
            {alert && (
              <div className={`custom-alert ${alert.type}`}>
                {alert.type === 'error' ? <FiAlertCircle size={20} /> : <FiCheckCircle size={20} />}
                <span>{alert.message}</span>
              </div>
            )}
            
            {/* RENDERIZADO DEL PASO 1 */}
            {step === 1 && (
              <form onSubmit={handleVerifyEmail} className="auth-form-visual view-transition" noValidate>
                <div className="input-group-modern">
                  <FiMail className="input-icon" />
                  <input 
                    type="email" 
                    placeholder="Correo de la cuenta" 
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setAlert(null); }} 
                  />
                </div>
                <button type="submit" className="btn-modern-auth">Verificar Correo</button>
              </form>
            )}

            {/* RENDERIZADO DEL PASO 2 */}
            {step === 2 && (
              <form onSubmit={handleUpdatePassword} className="auth-form-visual view-transition" noValidate>
                <div className="input-group-modern">
                  <FiLock className="input-icon" />
                  <input 
                    type={showPassword ? "text" : "password"} 
                    name="newPassword" 
                    placeholder="Nueva Contraseña" 
                    onChange={(e) => { setPasswords({...passwords, newPassword: e.target.value}); setAlert(null); }} 
                  />
                  <button type="button" className="toggle-password-btn" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>

                <div className="input-group-modern">
                  <FiLock className="input-icon" />
                  <input 
                    type={showPassword ? "text" : "password"} 
                    name="confirmNewPassword" 
                    placeholder="Confirmar Nueva Contraseña" 
                    onChange={(e) => { setPasswords({...passwords, confirmNewPassword: e.target.value}); setAlert(null); }} 
                  />
                </div>
                
                <button type="submit" className="btn-modern-auth">Guardar Cambios</button>
              </form>
            )}

            <div className="auth-redirect" style={{ marginTop: '20px' }}>
              <a href="/login" onClick={(e) => { e.preventDefault(); navigate('/login'); }}>
                Volver al Inicio de Sesión
              </a>
            </div>
          </div>
        </div>

        <div className="auth-visual-side">
          <div className="branding-content">
            <div className="logo-placeholder">NS</div>
            <h2 className="brand-name">Seguridad Primero</h2>
            <p className="brand-slogan">Mantén tus credenciales seguras para proteger el inventario y las ventas.</p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default UpdatePassword;