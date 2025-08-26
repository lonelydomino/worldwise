/* eslint-disable react/prop-types */


import styles from './Button.module.css'

const Button = ({children, onClick, type}) => {
    return (
        <button onClick={onClick} className={`${styles.btn} ${styles[type]}`}>
            
        </button>
    )
}

export default Button