import React from "react";
import ContactsList from "./ContactsList.jsx";
import inputs from "../constants/inputs.js";
import styles from "./Contacts.module.css";
import ConfirmModal from "./ConfirmModal.jsx";
import { useContacts } from "./ContactsContext.jsx";

function Contacts() {
  const {
    alert,
    contact,
    selectedIds,
    searchTerm,
    isEditing,
    showModal,
    pendingDeleteId,
    setSearchTerm,
    changeHandler,
    addHandler,
    updateHandler,
    cancelEdit,
    bulkDeleteHandler,
    confirmDelete,
    cancelDelete,
  } = useContacts();

  return (
    <div className={styles.container}>
      <div className={styles.form}>
        {inputs.map((input, index) => (
          <input
            key={index}
            type={input.type}
            placeholder={input.placeholder}
            name={input.name}
            value={contact[input.name]}
            onChange={changeHandler}
          />
        ))}
        <div className={styles.buttons}>
          <button
            onClick={isEditing ? updateHandler : addHandler}
            className={styles.changeButton}
          >
            {isEditing ? "Update Contact" : "Add Contact"}
          </button>
          {isEditing && (
            <button onClick={cancelEdit} className={styles.cancel}>
              Cancel
            </button>
          )}
        </div>
      </div>

      <div className={styles.searchBox}>
        <input
          type="text"
          placeholder="Search contacts"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      {selectedIds.length > 0 && (
        <button onClick={bulkDeleteHandler} className={styles.bulkDelete}>
          🗑️ Delete {selectedIds.length} selected
        </button>
      )}

      <div className={styles.alert}>{alert && <p>{alert}</p>}</div>

      <ContactsList />

      {showModal && (
        <ConfirmModal
          message={
            pendingDeleteId === "bulk"
              ? `Are you sure you want to delete ${selectedIds.length} contacts?`
              : "Are you sure you want to delete this contact?"
          }
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
        />
      )}
    </div>
  );
}

export default Contacts;
