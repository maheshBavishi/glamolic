import React from 'react'
import styles from './switch.module.scss';
import classNames from 'classnames';
export default function Switch() {
    return (
        <div className={styles.customswitch}>
            <label className={styles.switch}>
                <input type="checkbox" />
                <span className={classNames(styles.slider, styles.round)}></span>
            </label>
        </div>
    )
}
