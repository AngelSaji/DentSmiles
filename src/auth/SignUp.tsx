import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate, Link } from 'react-router-dom';

export default function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

  async function handleSignUp(e: React.FormEvent) {
    e.preventDefault();
    const { data, error } = await supabase.auth.signUp({
      email,
      password
    });
    if (error) {
      setErrorMsg(error.message);
    } else {
      navigate('/signin'); // after sign-up, go to sign-in
    }
  }
  

  return (
    <div>
      <h2>Sign Up</h2>
      <form onSubmit={handleSignUp}>
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
        <button type="submit">Sign Up</button>
      </form>
      {errorMsg && <p style={{ color: 'red' }}>{errorMsg}</p>}
      <p>
        Already have an account? <Link to="/signin">Sign In</Link>
      </p>
    </div>
  );
}
