import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import  Modal  from 'react-modal'


export class ProfileForm extends Component {

    constructor(props) {
        super(props);

        this.state = {
        name: '',
        profesion: '',
        profileType: 'cliente',
        objetive: '',
        profileImage: null,
        showAlert: false,
        isSaved: false,
        customStyles: {
            content: {
                width: '60%',
                height: '80%'
            }
        }
        };
    }

    handleInputChange = (e) => {
        this.setState({name: e.target.value});
    };

    handleObjetiveChange = (e) => {
        const optionSelected = e.target.value;
        this.setState({ objetive: optionSelected });
        if (optionSelected === 'Ofrecer servicios') {
            this.setState({profileType: 'professional'});
            this.setState({ showAlert: true });
        }else{
            this.setState({profileType: 'cliente'});
            this.setState({ showAlert: false });
        }

    };

    handleConfirmAlert = () => {
        this.setState({ showAlert: false });
    };

    handleCancelAlert = () => {
        this.setState({ objetive: 'Contratar profesionales' }); 
        this.setState({ showAlert: false });
    };

    handleImageUpload = (e) => {
        this.setState({profileImage: e.target.files[0]});
    };

    
    handleSubmit = (e) => {
        e.preventDefault();

        const userData = {
            name: this.state.name,
            profesion: this.state.profesion,
            profileType: this.state.profileType,
            profileImage: this.state.profileImage
        };

            try {
                const response = fetch('/http://localhost:3000/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
                });
        
                if (response.status === 201) {
                    this.setState({isSaved: true});
                } else {
                    console.log('Error al guardar perfil');
                }
            } catch (error) {
                //
            }
    };

    render() {
        return (
            <div>
                {this.state.isSaved ? (
                <Link to="/" />
            ) : (
                <form onSubmit={this.handleSubmit}>
                    <div>
                        <label>Cual es tu nombre?: </label>
                        <input
                            type="text"
                            name="name"
                            value={this.state.name}
                            onChange={this.handleInputChange}
                        />
                    </div>
                    <div>
                        <label>A que te dedicas?: </label>
                        <input
                            type="text"
                            name="profesion"
                            value={this.state.email}
                            onChange={this.handleInputChange}
                        />
                    </div>
                    <div>
                        <label>Cual es tu objetivo en la app?: </label>
                        <select
                            id="objetive"
                            name="objetive"
                            value={this.state.objetive || ''}
                            onChange={this.handleObjetiveChange}
                        >
                            {this.state.objetive === '' && (<option value="" disabled hidden>Selecciona una opción</option>)}
                            <option value="Contratar profesionales">Contratar profesionales</option>
                            <option value="Ofrecer servicios">Ofrecer servicios</option>
                        </select>
                    </div>
                    <div>
                        <label>Foto de perfil:</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={this.handleImageUpload}
                        />
                    </div>
                    {this.state.profileImage && (
                        <div>
                            <img width={300} height={300} src={URL.createObjectURL(this.state.profileImage)} alt="Perfil" />
                            <div>
                                <h1>{URL.createObjectURL(this.state.profileImage)}</h1>
                            </div>
                        </div>
                    )}
                    <button type="submit" onClick={this.handleSubmit}>Guardar perfil</button>
                    <Link to="/"><button>Volver</button></Link>

                    <Modal
                        isOpen={this.state.showAlert}
                        onRequestClose={this.handleCloseAlert}
                        style={this.state.customStyles}
                    >
                        <h2>Queremos que te vean!</h2>
                        <h4>Te ayudaremos a ofrecer tus servicios! Apareceras dentro de la app como un "Profesional". Tu perfil sera publico y los usuarios
                            podran acceder a las fotos que subas, podran conocer la region en la que recides y tendran acceso a aquellos medios de contacto que registres. </h4>
                        <img src={"../img/modal-profile-form.jpg"} width={400} height={400} alt=""/>
                        <br/>
                        <button onClick={this.handleConfirmAlert}>Entendido</button>
                        <button onClick={this.handleCancelAlert}>Cancelar</button>
                    </Modal>
                </form>
                )}
            </div>
        );
    };
};
