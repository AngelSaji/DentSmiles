import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate, Link } from 'react-router-dom';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

async function handleSignIn(e: React.FormEvent) {
  e.preventDefault();
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });
  if (error) {
    setErrorMsg(error.message);
  } else {
    navigate('/');  // logged in
  }
}


  return (
    <div>
      <h2>Sign In</h2>
      <form onSubmit={handleSignIn}>
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        <button type="submit">Sign In</button>
      </form>
      {errorMsg && <p style={{ color: 'red' }}>{errorMsg}</p>}
      <p>
        Don’t have an account? <Link to="/signup">Sign Up</Link>
      </p>
    </div>
  );
}
