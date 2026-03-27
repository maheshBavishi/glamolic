import React from "react";
import EyeIcon from "@/icons/eyeIcon";
import EyeOffIcon from "@/icons/eyeOffIcon";
import styles from "./input.module.scss";
export default function Input({
  label,
  placeholder,
  smallInput,
  error,
  requiredMark = false,
  showPasswordToggle = false,
  isPasswordVisible = false,
  onTogglePassword,
  ...props
}) {
  const resolvedType = showPasswordToggle ? (isPasswordVisible ? "text" : "password") : props.type;
  const inputStyle = showPasswordToggle ? { ...props.style, paddingRight: "48px" } : props.style;

  return (
    <div className={`${styles.input} ${smallInput ? styles.smallInput : ""}`}>
      <label htmlFor={props.id || props.name}>
        {label}
        {requiredMark ? <span className={styles.requiredMark}>*</span> : null}
      </label>
      <div className={styles.inputShell}>
        <input placeholder={placeholder} {...props} type={resolvedType} style={inputStyle} />
        {showPasswordToggle ? (
          <button
            type="button"
            className={styles.toggleButton}
            onClick={onTogglePassword}
            aria-label={isPasswordVisible ? `Hide ${label}` : `Show ${label}`}
          >
            {isPasswordVisible ? <EyeIcon /> : <EyeOffIcon />}
          </button>
        ) : null}
      </div>
      {error && (
        <p className={styles.errorText} style={{ color: "red", fontSize: "14px", marginTop: "4px" }}>
          {error}
        </p>
      )}
    </div>
  );
}
