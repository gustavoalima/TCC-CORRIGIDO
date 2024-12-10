import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
// Adiciona o Font Awesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faLock } from '@fortawesome/free-solid-svg-icons';

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            const response = await axios.post('http://localhost:3000/login', { username, password });
            if (response.data.success) {
                localStorage.setItem('token', response.data.token);
                navigate('/dashboard');
            } else {
                setErrorMessage(response.data.message || 'Erro ao fazer login. Verifique suas credenciais.');
            }
        } catch (error) {
            if (error.response && error.response.status === 401) {
                setErrorMessage('Credenciais inválidas. Por favor, tente novamente.');
            } else {
                setErrorMessage('Erro ao conectar com o servidor. Tente novamente mais tarde.');
            }
        }
    };

    // CSS in-line para a tela de login
    const styles = {
        container: {
            height: '100vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundImage: 'url("/images/logo2.jpg")', // Caminho correto para a imagem de fundo
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
        },
        box: {
            backgroundColor: '#a0e7e5',
            padding: '50px 40px',
            borderRadius: '10px',
            boxShadow: '0px 8px 15px rgba(0, 0, 0, 0.1)',
            textAlign: 'center',
            maxWidth: '500px',
            width: '100%',
        },
        logo: {
            maxWidth: '150px',
            marginBottom: '30px',
        },
        inputWrapper: {
            position: 'relative',
            marginBottom: '20px',
        },
        icon: {
            position: 'absolute',
            top: '50%',
            left: '10px',
            transform: 'translateY(-50%)',
            color: '#666',
            fontSize: '20px',
        },
        input: {
            width: '100%',
            padding: '15px 50px',
            border: '1px solid #ddd',
            borderRadius: '8px',
            fontSize: '18px',
            boxSizing: 'border-box',
        },
        button: {
            width: '100%',
            padding: '16px',
            backgroundColor: '#4ecdc4',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '18px',
            cursor: 'pointer',
            transition: 'background-color 0.3s',
        },
        errorMessage: {
            color: 'red',
            marginBottom: '20px',
        },
        registerLink: {
            marginTop: '25px',
            fontSize: '18px',
            color: '#333',
        },
        registerBtn: {
            background: 'none',
            border: 'none',
            color: '#333',
            textDecoration: 'underline',
            fontSize: '20px',
            cursor: 'pointer',
        },
    };

    return (
        <div style={styles.container}>
            <div style={styles.box}>
                <img src="/images/icon.png" alt="Logo" style={styles.logo} />
                <h2 style={{ fontSize: '32px', marginBottom: '20px' }}>Bem-vindo de volta!</h2>
                <p style={{ fontSize: '20px', marginBottom: '30px' }}>Por favor, insira os seus dados para continuar</p>
                {errorMessage && <p style={styles.errorMessage}>{errorMessage}</p>}
                <div style={styles.inputWrapper}>
                    <FontAwesomeIcon icon={faUser} style={styles.icon} />
                    <input
                        type="text"
                        placeholder="Nome de Utilizador"
                        onChange={(e) => setUsername(e.target.value)}
                        style={styles.input}
                    />
                </div>
                <div style={styles.inputWrapper}>
                    <FontAwesomeIcon icon={faLock} style={styles.icon} />
                    <input
                        type="password"
                        placeholder="Palavra-passe"
                        onChange={(e) => setPassword(e.target.value)}
                        style={styles.input}
                    />
                </div>
                <button onClick={handleLogin} style={styles.button}>
                    Entrar
                </button>
                <div style={styles.registerLink}>
                    <p>Não tem conta?</p>
                    <button style={styles.registerBtn} onClick={() => navigate('/register')}>
                        Registar-se
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Login;
