import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import UploadCircle from './components/UploadCircle';
import UploadedList from './components/UploadedList';
import SignIn from './components/SignIn';

function App() {
  const [user, setUser] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [checking, setChecking] = useState(true);

  // On load, verify stored token
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { setChecking(false); return; }

    fetch('http://localhost:3001/api/me', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data) setUser(data.name);
        else localStorage.removeItem('token');
      })
      .catch(() => {})
      .finally(() => setChecking(false));
  }, []);

  const handleSignIn = (name) => setUser(name);

  const handleSignOut = async () => {
    const token = localStorage.getItem('token');
    await fetch('http://localhost:3001/api/logout', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    }).catch(() => {});
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    setUser(null);
    setUploadedFiles([]);
  };

  if (checking) {
    return (
      <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0d1117 0%, #0a2a2a 50%, #0d1117 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ color: 'rgba(255,255,255,0.3)', fontFamily: 'Outfit, sans-serif' }}>Loading…</span>
      </div>
    );
  }

  if (!user) return <SignIn onSignIn={handleSignIn} />;

  return (
    <div style={styles.appContainer}>
      <Navbar user={user} onSignOut={handleSignOut} />
      <div style={styles.body}>
        <div style={styles.center}>
          <UploadCircle onUpload={(f) => setUploadedFiles(prev => [...prev, f])} />
        </div>
        <UploadedList files={uploadedFiles} />
      </div>
    </div>
  );
}

const styles = {
  appContainer: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #0d1117 0%, #0a2a2a 50%, #0d1117 100%)',
  },
  body: {
    flex: 1,
    display: 'flex',
    overflow: 'hidden',
  },
  center: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
};

export default App;
