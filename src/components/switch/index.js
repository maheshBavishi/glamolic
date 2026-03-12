import React from 'react'
import styles from './switch.module.scss';
import classNames from 'classnames';
export default function Switch({ checked = false, onChange, disabled = false, id, name }) {
    const inputId = id || name;

    return (
        <div className={classNames(styles.customswitch, disabled ? styles.disabled : "")}>
            <label className={styles.switch} htmlFor={inputId}>
                <input
                    id={inputId}
                    name={name}
                    type="checkbox"
                    checked={checked}
                    disabled={disabled}
                    onChange={(event) => onChange?.(event.target.checked)}
                />
                <span className={classNames(styles.slider, styles.round)}></span>
            </label>
        </div>
    )
}
