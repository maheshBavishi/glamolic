import React from 'react'
import styles from './input.module.scss';
export default function Input({ label, placeholder, smallInput }) {
    return (
        <div className={`${styles.input} ${smallInput ? styles.smallInput : ''}`}>
            <label>{label}</label>
            <input type='text' placeholder={placeholder} />
        </div>
    )
}
