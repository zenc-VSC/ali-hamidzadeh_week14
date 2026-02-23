import React from "react";

function ConfirmModal({onConfirm, onCancel, message}) {
  return (
    <>
      <div>
        <p>{message}</p>
        <div>
          <button onClick={onConfirm}>Yes, Delete</button>
          <button onClick={onCancel}>Cancel</button>
        </div>
      </div>
    </>
  );
}

export default ConfirmModal;
