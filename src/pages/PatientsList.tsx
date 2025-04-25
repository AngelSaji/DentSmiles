import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import NewPatientForm from '../components/NewPatientForm';

type Patient = {
  id: string;
  name: string;
  next_visit: string | null;
  total_fees: number | null;
};

export default function PatientsList() {
  const [patients, setPatients] = useState<Patient[]>([]);

  async function fetchPatients() {
    const { data, error } = await supabase
      .from('patients')
      .select('id, name, next_visit, total_fees')
      .order('next_visit', { ascending: true });
    if (error) {
      console.error('Error fetching patients:', error);
    } else {
      setPatients(data as Patient[]);
    }
  }

  useEffect(() => {
    // initial load
    fetchPatients();

    // real-time subscription
    const channel = supabase
      .channel('public:patients')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'patients' },
        () => fetchPatients()
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h2>Patients</h2>

      {/* Add-new-patient form */}
      <NewPatientForm onAdd={fetchPatients} />

      <table border={1} cellPadding={8} cellSpacing={0}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Next Visit</th>
            <th>Fees</th>
          </tr>
        </thead>
        <tbody>
          {patients.map(p => (
            <tr key={p.id}>
              <td>{p.name}</td>
              <td>{p.next_visit ?? '-'}</td>
              <td>{p.total_fees != null ? p.total_fees : '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
