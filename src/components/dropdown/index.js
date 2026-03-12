'use client'
import React, { useEffect, useId, useState } from 'react'
import Select, { components as selectComponents } from 'react-select';
import styles from './dropdown.module.scss';

const customStyles = (hasError) => ({
  control: (provided, state) => ({
    ...provided,
    width: '100%',
    minHeight: '54px',
    height: '54px',
    borderRadius: '12px',
    border: hasError
      ? '1px solid #E23030'
      : state.isFocused
        ? '1px solid #647F80'
        : '1px solid rgba(18, 18, 18, 0.10)',
    background: '#FFF',
    padding: '0 4px',
    boxShadow: 'none',
    cursor: 'pointer',
    '&:hover': {
      border: hasError ? '1px solid #E23030' : '1px solid rgba(18, 18, 18, 0.10)',
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
    zIndex: 9999,
  }),
  menuPortal: (provided) => ({
    ...provided,
    zIndex: 9999,
  }),
  menuList: (provided) => ({
    ...provided,
    padding: '4px 0',
    maxHeight: '220px',
    overflowY: 'auto',
    overscrollBehavior: 'contain',
    WebkitOverflowScrolling: 'touch',
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
});

const withLenisPreventProps = (innerProps = {}) => ({
  ...innerProps,
  'data-lenis-prevent': true,
  'data-lenis-prevent-wheel': true,
  onWheel: (event) => {
    innerProps.onWheel?.(event);
    event.stopPropagation();
  },
  onTouchMove: (event) => {
    innerProps.onTouchMove?.(event);
    event.stopPropagation();
  },
});

const Menu = (props) => (
  <selectComponents.Menu
    {...props}
    innerProps={withLenisPreventProps(props.innerProps)}
  />
);

const MenuList = (props) => (
  <selectComponents.MenuList
    {...props}
    innerProps={withLenisPreventProps(props.innerProps)}
  />
);

export default function Dropdown({
  label,
  options = [],
  placeholder = 'Select...',
  value,
  onChange,
  error,
  instanceId,
  inputId,
  components,
  ...rest
}) {
  const generatedId = useId().replace(/:/g, '');
  const [menuPortalTarget, setMenuPortalTarget] = useState(null);

  useEffect(() => {
    setMenuPortalTarget(document.body);
  }, []);

  const stableIdBase =
    instanceId ||
    (label ? String(label).toLowerCase().replace(/[^a-z0-9]+/g, '-') : null) ||
    `dropdown-${generatedId}`;

  return (
    <div className={styles.dropdown}>
      {label && <label>{label}</label>}
      <Select
        options={options}
        placeholder={placeholder}
        styles={customStyles(Boolean(error))}
        value={value}
        onChange={onChange}
        instanceId={stableIdBase}
        inputId={inputId || `${stableIdBase}-input`}
        components={{
          Menu,
          MenuList,
          ...components,
        }}
        menuPortalTarget={menuPortalTarget}
        menuPosition={menuPortalTarget ? 'fixed' : 'absolute'}
        maxMenuHeight={220}
        menuShouldBlockScroll={false}
        captureMenuScroll={true}
        closeMenuOnScroll={false}
        menuShouldScrollIntoView={false}
        {...rest}
      />
      {error ? <p className={styles.errorText}>{error}</p> : null}
    </div>
  )
}

