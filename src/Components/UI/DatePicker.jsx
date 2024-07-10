// DateSelector.js

import React from 'react';
import './DatePicker.css';

const DateSelector = ({ label, required, value, onChange, placeholder, error, inputClassName, isDisabled }) => {
  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split('T')[0];

  // Calculate the date that is 18 years ago from today
  const eighteenYearsAgo = new Date(new Date().setFullYear(new Date().getFullYear() - 18)).toISOString().split('T')[0];

  return (
    <div className="form-group">
      <label>
        {label} {required && <span style={{color: 'red'}}>*</span>}
      </label>
      <input
        type="date"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`date-input ${error ? 'error' : ''} ${isDisabled ? 'isDisabled' : ''} ${inputClassName}`}
        disabled={isDisabled}
        max={eighteenYearsAgo} 
      />
      {error && <div className="error-message">{error}</div>}
    </div>
  );
};

export default DateSelector;
