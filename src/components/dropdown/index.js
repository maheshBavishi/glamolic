'use client'
import React from 'react'
import Select from 'react-select';
import styles from './dropdown.module.scss';

const customStyles = {
  control: (provided, state) => ({
    ...provided,
    width: '100%',
    minHeight: '54px',
    height: '54px',
    borderRadius: '12px',
    border: '1px solid rgba(18, 18, 18, 0.10)',
    background: '#FFF',
    padding: '0 4px',
    boxShadow: 'none',
    cursor: 'pointer',
    '&:hover': {
      border: '1px solid rgba(18, 18, 18, 0.10)',
    },
  }),
  valueContainer: (provided) => ({
    ...provided,
    padding: '0 12px',
    height: '54px',
  }),
  input: (provided) => ({
    ...provided,
    margin: 0,
    padding: 0,
    color: 'rgba(18, 18, 18, 0.60)',
    fontSize: '18px',
    fontWeight: 500,
    fontFamily: 'var(--font-heebo)',
  }),
  placeholder: (provided) => ({
    ...provided,
    color: 'rgba(18, 18, 18, 0.60)',
    fontSize: '18px',
    fontWeight: 500,
    fontFamily: 'var(--font-heebo)',
    fontStyle: 'normal',
  }),
  singleValue: (provided) => ({
    ...provided,
    color: 'rgba(18, 18, 18, 0.60)',
    fontSize: '18px',
    fontWeight: 500,
    fontFamily: 'var(--font-heebo)',
    fontStyle: 'normal',
  }),
  indicatorSeparator: () => ({
    display: 'none',
  }),
  dropdownIndicator: (provided) => ({
    ...provided,
    color: 'rgba(18, 18, 18, 0.60)',
    '&:hover': {
      color: 'rgba(18, 18, 18, 0.60)',
    },
  }),
  menu: (provided) => ({
    ...provided,
    borderRadius: '12px',
    border: '1px solid rgba(18, 18, 18, 0.10)',
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.08)',
    overflow: 'hidden',
    marginTop: '4px',
  }),
  menuList: (provided) => ({
    ...provided,
    padding: '4px 0',
  }),
  option: (provided, state) => ({
    ...provided,
    color: '#121212',
    fontSize: '18px',
    fontWeight: 500,
    fontFamily: 'var(--font-heebo)',
    fontStyle: 'normal',
    padding: '10px 16px',
    cursor: 'pointer',
    backgroundColor: state.isSelected
      ? 'rgba(18, 18, 18, 0.08)'
      : state.isFocused
        ? 'rgba(18, 18, 18, 0.04)'
        : '#FFF',
    '&:active': {
      backgroundColor: 'rgba(18, 18, 18, 0.08)',
    },
  }),
};

export default function Dropdown({ label, options = [], placeholder = 'Select...', value, onChange, ...rest }) {
  return (
    <div className={styles.dropdown}>
      {label && <label>{label}</label>}
      <Select
        options={options}
        placeholder={placeholder}
        styles={customStyles}
        value={value}
        onChange={onChange}
        {...rest}
      />
    </div>
  )
}

