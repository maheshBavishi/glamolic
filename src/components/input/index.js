import React from "react";
import styles from "./input.module.scss";
export default function Input({ label, placeholder, smallInput, error, ...props }) {
  return (
    <div className={`${styles.input} ${smallInput ? styles.smallInput : ""}`}>
      <label>{label}</label>
      <input placeholder={placeholder} {...props} />
      {error && (
        <p className={styles.errorText} style={{ color: "red", fontSize: "14px", marginTop: "4px" }}>
          {error}
        </p>
      )}
    </div>
  );
}
