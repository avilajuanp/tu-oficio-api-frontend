import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './SignUpForm.css';

export const SignUpForm = () => {
    const [userData, setUserData] = useState({
        firstName: '',
        lastName: '',
        address: '',
        birthdate: '',
        phoneNumber: '',
        dni: '',
        userType: 'cliente',
        email: '',
        password: '',
        confirmPassword: '',
        registrationNumber: '',
        specialty: '',
    });

    const [isRegistered, setIsRegistered] = useState(false);

    const handleChange = (e) => {
        const { id, value } = e.target;
        setUserData({ ...userData, [id]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            let response;
            if (userData.userType === 'cliente') {
                response = await fetch('http://localhost:3000/add-client', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(userData),
                });
            } else if (userData.userType === 'profesional') {
                response = await fetch('http://localhost:3000/add-professional', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(userData),
                });
            }

            const data = await response.json();
            if (response.ok) {
                setIsRegistered(true);
                window.alert(data.message);
                window.location.href = '/';
            } else {
                window.alert(data.message);
            }
        } catch (error) {
            console.error('Error al registrarse:', error);
        }
    };

    return (
        <div className='container2 box'>
            {isRegistered ? (
                <Link to='/App' />
            ) : (
                <form onSubmit={handleSubmit}>
                    <div className='mainHeading'>
                        <div className='mainHeading__content'>
                            <article className='mainHeading__text'>
                                
                                <h2 className='mainHeading__title'>REGISTRARSE</h2>
                                <div>
                                    <label htmlFor='firstName'>Nombre</label>
                                    <input type='text' id='firstName' value={userData.firstName} onChange={handleChange} />
                                </div>
                                <div>
                                    <label htmlFor='lastName'>Apellido</label>
                                    <input type='text' id='lastName' value={userData.lastName} onChange={handleChange} />
                                </div>
                                <div>
                                    <label htmlFor='address'>Dirección</label>
                                    <input type='text' id='address' value={userData.address} onChange={handleChange} />
                                </div>
                                <div>
                                    <label htmlFor='birthdate'>Fecha de Nacimiento (dd/mm/aaaa)</label>
                                    <input type='text' id='birthdate' value={userData.birthdate} onChange={handleChange} />
                                </div>
                                <div>
                                    <label htmlFor='phoneNumber'>Número de Teléfono</label>
                                    <input type='text' id='phoneNumber' value={userData.phoneNumber} onChange={handleChange} />
                                </div>
                                <div>
                                    <label htmlFor='dni'>DNI</label>
                                    <input type='text' id='dni' value={userData.dni} onChange={handleChange} />
                                </div>
                                <div>
                                    <label htmlFor='userType'>Tipo de Usuario:</label>
                                    <select id='userType' value={userData.userType} onChange={handleChange}>
                                        <option value='cliente'>Cliente</option>
                                        <option value='profesional'>Profesional</option>
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor='email'>Correo Electrónico</label>
                                    <input type='text' id='email' value={userData.email} onChange={handleChange} />
                                </div>
                                <div>
                                    <label htmlFor='password'>Contraseña</label>
                                    <input type='password' id='password' value={userData.password} onChange={handleChange} />
                                </div>
                                <div>
                                    <label htmlFor='confirmPassword'>Confirmar Contraseña</label>
                                    <input
                                        type='password'
                                        id='confirmPassword'
                                        value={userData.confirmPassword}
                                        onChange={handleChange}
                                    />
                                </div>
                                {userData.userType === 'profesional' && (
                                    <>
                                        <div>
                                            <label htmlFor='registrationNumber'>Número de Matrícula</label>
                                            <input
                                                type='text'
                                                id='registrationNumber'
                                                value={userData.registrationNumber}
                                                onChange={handleChange}
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor='specialty'>Especialidad</label>
                                            <select id='specialty' value={userData.specialty} onChange={handleChange}>
                                                <option value=''>Seleccionar Especialidad</option>
                                                <option value='Plomero'>Plomero</option>
                                                <option value='Electricista'>Electricista</option>
                                                {/* ... Otras especialidades ... */}
                                            </select>
                                        </div>
                                    </>
                                )}
                                <button className='cta' type='submit'>
                                    Registrarse
                                </button>
                                <Link to='/login'>
                                    <button className='cta' type='submit'>
                                        Volver
                                    </button>
                                </Link>
                            </article>

                            <figure className='mainHeading__image'>
                                
                            </figure>
                        </div>
                    </div>
                </form>
            )}
        </div>
    );
};
