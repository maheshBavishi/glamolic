"use client";
import React from "react";
import ReactPhoneInput from "react-phone-input-2";
import styles from "./phoneInput.module.scss";

export default function PhoneInput({
  label,
  requiredMark = false,
  value,
  onChange,
  error,
  placeholder = "Enter phone number",
  name = "phone",
  id = "phone",
  country = "in",
  countryCodeEditable = false,
  enableSearch = true,
  disableSearchIcon = true,
  autocompleteSearch = true,
  inputProps = {},
  containerClassName = "",
  dropdownClassName = "",
  ...props
}) {
  const mergedContainerClassName = `${styles.phoneInputContainer} ${error ? styles.phoneInputErrorState : ""} ${containerClassName}`.trim();
  const mergedDropdownClassName = `phone-input-country-dropdown ${styles.phoneInputDropdown} ${dropdownClassName}`.trim();

  return (
    <div className={styles.phoneInputField}>
      {label ? (
        <label htmlFor={id}>
          {label}
          {requiredMark ? <span className={styles.requiredMark}>*</span> : null}
        </label>
      ) : null}
      <ReactPhoneInput
        country={country}
        value={value}
        onChange={onChange}
        countryCodeEditable={countryCodeEditable}
        enableSearch={enableSearch}
        disableSearchIcon={disableSearchIcon}
        autocompleteSearch={autocompleteSearch}
        placeholder={placeholder}
        containerClass={mergedContainerClassName}
        dropdownClass={mergedDropdownClassName}
        inputProps={{
          name,
          id,
          required: false,
          ...inputProps,
        }}
        {...props}
      />
      {error ? <p className={styles.errorText}>{error}</p> : null}
    </div>
  );
}
