import React, { useState } from 'react';
import { uploadClubMembers } from '../services/adminService';
import { getToken } from '../services/api'; // your api token helper

export default function UploadClubMembers({ clubId }: { clubId: string }) {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return setStatus('Select a CSV file first');

    setStatus('Uploading...');
    try {
      const token = getToken();
      const res = await uploadClubMembers(file, clubId, token || undefined);
      setStatus(`Imported: ${res.imported} members`);
    } catch (err: any) {
      setStatus(`Error: ${err.message}`);
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <input
        type="file"
        accept=".csv,text/csv"
        onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
      />
      <button type="submit">Upload CSV</button>
      {status && <p>{status}</p>}
    </form>
  );
}
