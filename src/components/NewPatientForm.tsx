import React, { useState } from 'react';
import { supabase } from '../lib/supabase';

type Props = {
  onAdd: () => void;    // callback to refresh parent list
};

export default function NewPatientForm({ onAdd }: Props) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [nextVisit, setNextVisit] = useState('');
  const [fees, setFees] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const { error } = await supabase
      .from('patients')
      .insert({
        name,
        phone,
        email,
        next_visit: nextVisit || null,
        total_fees: fees ? parseFloat(fees) : 0,
      });
    if (error) {
      alert('Error: ' + error.message);
    } else {
      // clear form
      setName('');
      setPhone('');
      setEmail('');
      setNextVisit('');
      setFees('');
      onAdd();  // tell parent to reload its list
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: 20 }}>
      <h3>Add New Patient</h3>
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={e => setName(e.target.value)}
        required
        style={{ display: 'block', marginBottom: 8 }}
      />
      <input
        type="text"
        placeholder="Phone"
        value={phone}
        onChange={e => setPhone(e.target.value)}
        style={{ display: 'block', marginBottom: 8 }}
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        style={{ display: 'block', marginBottom: 8 }}
      />
      <input
        type="date"
        placeholder="Next Visit"
        value={nextVisit}
        onChange={e => setNextVisit(e.target.value)}
        style={{ display: 'block', marginBottom: 8 }}
      />
      <input
        type="number"
        placeholder="Fees"
        value={fees}
        onChange={e => setFees(e.target.value)}
        min="0"
        style={{ display: 'block', marginBottom: 8 }}
      />
      <button type="submit">Add Patient</button>
    </form>
  );
}
