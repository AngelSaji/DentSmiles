// web/src/pages/TreatmentPage.tsx
import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import ToothChart from '../components/ToothChart';

type Patient = {
  id: string;
  name: string;
  total_fees: number | null;
  next_visit: string | null;
};

type Treatment = {
  id: string;
  tooth_number: number;
  tooth_name: string;
  notes: string;
  date: string;
};

export default function TreatmentPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selected, setSelected] = useState<Patient | null>(null);
  const [treatments, setTreatments] = useState<Treatment[]>([]);
  const [filteredTreatments, setFilteredTreatments] = useState<Treatment[]>([]);
  const [selectedTooth, setSelectedTooth] = useState<{ number: number; id: string } | null>(null);
  const [notes, setNotes] = useState('');
  const [nextVisit, setNextVisit] = useState('');
  const [fees, setFees] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    supabase
      .from('patients')
      .select('id,name,total_fees,next_visit')
      .then(({ data }) => setPatients(data || []));
  }, []);

  useEffect(() => {
    if (!selected) return;
    setNextVisit(selected.next_visit ?? '');
    setFees((selected.total_fees ?? '').toString());
    fetchHistory();

    const chan = supabase
      .channel(`treatments:realtime:${selected.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'treatments',
          filter: `patient_id=eq.${selected.id}`,
        },
        () => fetchHistory()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(chan);
    };
  }, [selected]);

  useEffect(() => {
    setFilteredTreatments(
      treatments.filter(
        t =>
          t.tooth_number.toString().includes(search) ||
          t.notes.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search, treatments]);

  async function fetchHistory() {
    const { data } = await supabase
      .from('treatments')
      .select('*')
      .eq('patient_id', selected!.id)
      .order('date', { ascending: false });

    setTreatments(data || []);
  }

  async function recordTreatment() {
    if (!selected || !selectedTooth || !notes.trim()) return;

    const existing = treatments.find(t => t.tooth_number === selectedTooth.number);

    if (existing) {
      await supabase
        .from('treatments')
        .update({ notes, date: new Date().toISOString() })
        .eq('id', existing.id);
    } else {
      await supabase.from('treatments').insert({
        patient_id: selected.id,
        tooth_number: selectedTooth.number,
        tooth_name: selectedTooth.id,
        notes,
      });
    }

    setNotes('');
    setSelectedTooth(null);
  }

  async function updatePatientInfo() {
    if (!selected) return;

    const { error } = await supabase
      .from('patients')
      .update({
        total_fees: parseFloat(fees),
        next_visit: nextVisit || null,
      })
      .eq('id', selected.id);

    if (error) {
      alert('Error updating patient info: ' + error.message);
    }
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Dentist Console</h2>

      <select
        value={selected?.id ?? ''}
        onChange={e => {
          const pid = e.target.value;
          const found = patients.find(p => p.id === pid) || null;
          setSelected(found);
        }}
      >
        <option value="">Select Patient</option>
        {patients.map(p => (
          <option key={p.id} value={p.id}>
            {p.name}
          </option>
        ))}
      </select>

      {selected && (
        <>
          <div style={{ margin: '20px 0' }}>
            <ToothChart
              onToothClick={(number, id) => setSelectedTooth({ number, id })}
              selectedTooth={selectedTooth?.id}
            />
          </div>

          {selectedTooth && (
            <div>
              <strong>Selected Tooth: {selectedTooth.number}</strong>
            </div>
          )}

          <textarea
            placeholder="Procedure notes"
            value={notes}
            onChange={e => setNotes(e.target.value)}
            style={{ display: 'block', width: '100%', marginBottom: 8 }}
          />

          <button onClick={recordTreatment} disabled={!selectedTooth || !notes}>
            Save Treatment
          </button>

          <h3 style={{ marginTop: 20 }}>Update Patient Info</h3>
          <div>
            <label>Next Visit: </label>
            <input type="date" value={nextVisit} onChange={e => setNextVisit(e.target.value)} />
          </div>
          <div>
            <label>Total Fees: </label>
            <input type="number" value={fees} onChange={e => setFees(e.target.value)} />
          </div>
          <button onClick={updatePatientInfo}>Update Patient Info</button>

          <h3 style={{ marginTop: 20 }}>Treatment History</h3>
          <input
            type="text"
            placeholder="Search treatments"
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ width: '100%', marginBottom: 10 }}
          />
          <table width="100%" border={1} cellPadding={8} style={{ background: '#f9f9f9' }}>
            <thead>
              <tr>
                <th>Date</th>
                <th>Tooth</th>
                <th>Notes</th>
              </tr>
            </thead>
            <tbody>
              {filteredTreatments.map(t => (
                <tr key={t.id}>
                  <td>{new Date(t.date).toLocaleString()}</td>
                  <td>{t.tooth_number}</td>
                  <td>{t.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}
