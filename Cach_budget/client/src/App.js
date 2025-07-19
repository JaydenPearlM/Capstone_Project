// src/App.js
import React, { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    // Runs once on component mount
    fetch('http://localhost:5000/api/hello')
      .then(res => res.json())
      .then(data => setGreeting(data.message))
      .catch(err => console.error('Error fetching greeting:', err));
  }, []); // empty deps = run once

  return (
    <div className="App" style={{ padding: '2rem' }}>
      <header className="App-header">
        <h1>{ greeting || 'Loading…' }</h1>
        {/* the rest of your app’s UI goes here */}
      </header>
    </div>
  );
}

export default App;
