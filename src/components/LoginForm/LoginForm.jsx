import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './LoginForm.css';
import { useAuth } from '../../context/AuthContext';

export const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState('client');
  // const [loggedIn, setLoggedIn] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

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

      // Log the complete API response to understand its structure
      console.log(`Login API response for ${userType}:`, data);

      if (response.ok) {
        // Extract user ID from the response
        // The ID might be in different places depending on the API response structure
        let userId = null;

        // Try to find the user ID in common locations
        if (data.user && data.user.id) {
          userId = data.user.id;
        } else if (data.id) {
          userId = data.id;
        } else if (data.userId) {
          userId = data.userId;
        } else if (data.clientId) {
          userId = data.clientId;
        } else if (data.professionalId) {
          userId = data.professionalId;
        }

        // Handle different response structures for client vs professional
        let userData = {};

        if (userType === 'professional') {
          // For professionals, create userData directly from the response
          userData = {
            userType,
            email,
            id: userId,
            // Add any other fields that might be directly in the response
            firstName: data.firstName || '',
            lastName: data.lastName || '',
            phoneNumber: data.phoneNumber || '',
            address: data.address || '',
            specialty: data.specialty || '',
            yearsOfExperience: data.yearsOfExperience || 0,
            coordinates: data.coordinates || null
          };
        } else {
          // For clients, use the existing structure with data.user
          userData = {
            ...data.user, // Assuming your API returns user data for clients
            userType,
            email,
            id: userId, // Add the ID to the user object
            coordinates: data.coordinates // Add the coordinates to the user object
          };
        }

        console.log('User data being saved:', userData);
        login(userData);

        window.alert(data.message);
        navigate('/');
      } else {
        window.alert(data.message);
      }

      // if (response.ok) {
      //   window.alert(data.message);
      //   window.location.href = "/";
      //   setLoggedIn(true);
      // } else {
      //   window.alert(data.message);
      // }

    } catch (error) {
      console.error('Error al iniciar sesión:', error);
    }
  };

  // if (loggedIn) {
  //   return <Link to="/App" />;
  // }

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
                  <option value="client">Cliente</option>
                  <option value="professional">Profesional</option>
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
