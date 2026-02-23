import React from "react";

import styles from "./ConfirmModal.module.css";

function ConfirmModal({ onConfirm, onCancel, message }) {
  return (
    <div className={styles.container}>
      <div className={styles.modal}>
        <p className={styles.message}>{message}</p>
        <div className={styles.buttons}>
          <button className={styles.confirm} onClick={onConfirm}>
            Yes, Delete
          </button>
          <button className={styles.cancel} onClick={onCancel}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;
