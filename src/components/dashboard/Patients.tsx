import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase-client';
import { useNavigate } from 'react-router-dom';

interface Patient {
  id: string;
  name: string;
  latest_mood: {
    name: string;
    date: string;
  } | null;
}

export const Patients = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    const { data, error } = await supabase
      .from('users')
      .select(`
        id,
        name,
        daily_moods (
          mood_id,
          date,
          moods (
            name
          )
        )
      `)
      .eq('is_doctor', false)
      .order('name');

    if (!error && data) {
      const patientsWithMoods = data.map((patient: any) => ({
        id: patient.id,
        name: patient.name,
        latest_mood: patient.daily_moods[0]
          ? {
              name: patient.daily_moods[0].moods.name,
              date: patient.daily_moods[0].date,
            }
          : null,
      }));
      setPatients(patientsWithMoods);
    }
  };

  const startChat = (patientId: string) => {
    navigate('/dashboard/messages', { state: { selectedUser: patientId } });
  };

  return (
    <div className="max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Patients</h2>
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Latest Mood
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Last Updated
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {patients.map((patient) => (
              <tr key={patient.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{patient.name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {patient.latest_mood?.name || 'No mood recorded'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">
                    {patient.latest_mood?.date
                      ? new Date(patient.latest_mood.date).toLocaleDateString()
                      : 'Never'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => startChat(patient.id)}
                    className="text-purple-600 hover:text-purple-900"
                  >
                    Message
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};