import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './LoginForm.css';

export const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState('cliente');
  const [loggedIn, setLoggedIn] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const loginData = {
      email,
      password,
      userType
    };

    try {
      const response = await fetch(`http://localhost:3000/login-${userType}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
      });

      const data = await response.json();

      if (response.ok) {
        window.alert(data.message);
        window.location.href = "/";
        setLoggedIn(true);
      } else {
        window.alert(data.message);
      }

    } catch (error) {
      console.error('Error al iniciar sesión:', error);
    }
  };

  if (loggedIn) {
    return <Link to="/App" />;
  }

  return (
    <div>
      <header className="mainHeading">
        <div className="mainHeading_content">
          <article className="mainHeading_text">
            <h2 className="mainHeading_title">INICIAR SESIÓN</h2>
            
              
              <form onSubmit={handleSubmit}>
                <div>
                  <label htmlFor="email">Correo Electrónico</label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="password">Contraseña</label>
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="userType">Tipo de Usuario:</label>
                  <select
                    id="userType"
                    value={userType}
                    onChange={(e) => setUserType(e.target.value)}
                  >
                    <option value="cliente">Cliente</option>
                    <option value="profesional">Profesional</option>
                  </select>
                </div>
                <button className="cta" type="submit">Iniciar Sesión</button><br />
                <Link to="/signup"><button className="cta" type="submit">Registrarse</button></Link>
                <Link to="/"><button className="cta" type="submit">Volver</button></Link>
              </form>
            
          </article>

          <figure className="mainHeading_image">
            
          </figure>
        </div>
      </header>
    </div>
  );
};
