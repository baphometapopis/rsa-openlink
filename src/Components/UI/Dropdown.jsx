import React from 'react';
import Select from 'react-select';
import './Dropdown.css';

const Dropdown = ({ label, required, value, onChange, options, placeholder, error, inputClassName ,isDisabled,tippyContent}) => {
  const handleChange = (selectedOption) => {
    onChange({ target: { value: selectedOption ? selectedOption.value : '' } });
  };
  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      border: 'none',
      boxShadow: state.isFocused ? 'none' : 'none', // Remove box shadow only when focused
      
    }),
  };
  return (
   
    <div className="form-group-Dropdown">
      <label>
      {label} {required && <span style={{color:'red'}}>*</span>}
      </label>
   
      <Select
        value={options.find(option => option.value == value)}
        onChange={handleChange}
        options={options}
        placeholder={placeholder}
        className={`dropdown ${error ? 'error' : ''} ${inputClassName}`}
        styles={customStyles}
        isDisabled={isDisabled}

      />
    
      {error && <div className="error-message">{error}</div>}
    </div>
  );
};

export default Dropdown;
