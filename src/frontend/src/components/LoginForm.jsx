import { useState } from 'react';
import axios from 'axios';

export default function LoginForm({ onLoginSuccess }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await axios.post('http://localhost:5000/api/v1/auth/login', {
                email,
                password
            });

            if (response.data.success) {
                const token = response.data.data.devicePairingToken;

                // Save token to localStorage for Axios calls & state
                localStorage.setItem('devicePairingToken', token);

                alert(`🎉 Success! Generated Pairing Token:\n\n${token}`);

                if (onLoginSuccess) {
                    onLoginSuccess(token);
                }
            }
        } catch (err) {
            setError(err.response?.data?.error || 'Login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <h2>FinTrack Dashboard Login</h2>
            <form onSubmit={handleSubmit} style={styles.form}>
                {error && <div style={styles.error}>{error}</div>}

                <div style={styles.inputGroup}>
                    <label>Email Address</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        placeholder="user@example.com"
                        style={styles.input}
                    />
                </div>

                <div style={styles.inputGroup}>
                    <label>Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        placeholder="••••••••"
                        style={styles.input}
                    />
                </div>

                <button type="submit" disabled={loading} style={styles.button}>
                    {loading ? 'Logging in...' : 'Login & Get Token'}
                </button>
            </form>
        </div>
    );
}

const styles = {
    container: { maxWidth: '400px', margin: '40px auto', padding: '24px', border: '1px solid #ddd', borderRadius: '8px' },
    form: { display: 'flex', flexDirection: 'column', gap: '16px' },
    inputGroup: { display: 'flex', flexDirection: 'column', gap: '6px' },
    input: { padding: '10px', borderRadius: '4px', border: '1px solid #ccc' },
    button: { padding: '12px', background: '#0070f3', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' },
    error: { color: 'red', fontSize: '14px' }
};