// src/components/PlaidLinkButton.js
import React, { useState, useEffect, useCallback } from 'react';
import { usePlaidLink } from 'react-plaid-link';

export default function PlaidLinkButton() {
  const [linkToken, setLinkToken] = useState(null);
  const [accessToken, setAccessToken] = useState(null);

  // 1️⃣ Fetch your Link Token on mount
  useEffect(() => {
    fetch('http://localhost:5000/api/v1/plaid/create_link_token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: 'unique-user-id' }),
    })
      .then(res => res.json())
      .then(data => {
        console.log('✅ Got link token:', data.link_token);
        setLinkToken(data.link_token);
      })
      .catch(err => console.error('❌ Error creating link token:', err));
  }, []);

  // 2️⃣ onSuccess callback to swap public_token for access_token
  const onSuccess = useCallback((public_token) => {
    console.log('🔑 Received public_token:', public_token);
    fetch('http://localhost:5000/api/v1/plaid/exchange_public_token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ public_token }),
    })
      .then(res => res.json())
      .then(data => {
        console.log('🔓 Exchanged for access_token:', data.access_token);
        setAccessToken(data.access_token);
      })
      .catch(err => console.error('❌ Error exchanging public token:', err));
  }, []);

  // 3️⃣ Initialize Plaid Link
  const { open, ready } = usePlaidLink({
    token: linkToken,
    onSuccess,
    onExit: err => {
      if (err) console.error('🚪 Plaid exited with error:', err);
    },
  });

  // 4️⃣ DEBUG: Log whenever `ready` or `linkToken` changes
  useEffect(() => {
    console.log('🔍 Plaid ready:', ready, '| have linkToken:', !!linkToken);
  }, [ready, linkToken]);

  return (
    <div style={{ textAlign: 'center', marginTop: 40 }}>
      <button
        onClick={() => open()}
        disabled={!ready || !linkToken}
        style={{
          padding: '12px 24px',
          fontSize: '16px',
          borderRadius: '4px',
          cursor: ready && linkToken ? 'pointer' : 'not-allowed',
          backgroundColor: '#6772e5',
          color: 'white',
          border: 'none',
        }}
      >
        Link your bank account
      </button>

      {accessToken && (
        <p style={{ marginTop: 20, color: 'green' }}>
          ✅ Access Token: <code>{accessToken}</code>
        </p>
      )}
    </div>
  );
}
