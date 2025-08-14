import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import './ThemeDemo.css';

const ThemeDemo = () => {
  const { theme, toggleTheme, isLight, isDark } = useTheme();

  return (
    <div className="theme-demo">
      <div className="theme-demo-content">
        <h3>Theme System Demo</h3>
        <p>Current theme: <strong>{theme}</strong></p>
        <p>You can now toggle between light and dark mode throughout the application!</p>
        
        <div className="theme-demo-features">
          <h4>Features:</h4>
          <ul>
            <li>✨ Automatic persistence across sessions</li>
            <li>🌙 Dark mode for better night viewing</li>
            <li>☀️ Light mode for daytime use</li>
            <li>⚡ Smooth transitions between themes</li>
            <li>🎨 Consistent colors across all pages</li>
          </ul>
        </div>

        <div className="theme-demo-actions">
          <button onClick={toggleTheme} className="theme-demo-button">
            Switch to {isLight ? 'Dark' : 'Light'} Mode
          </button>
          
          <div className="theme-demo-status">
            {isDark && <span className="status-indicator dark">🌙 Dark Mode Active</span>}
            {isLight && <span className="status-indicator light">☀️ Light Mode Active</span>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThemeDemo;
