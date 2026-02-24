import React from "react";
import ContactsItem from "./ContactsItem";
import styles from "./ContactsList.module.css";
import { useContacts } from "./ContactsContext.jsx";

function ContactsList() {
  const { filteredContacts, selectedIds, selectAllHandler } = useContacts();

  const allSelected =
    selectedIds.length === filteredContacts.length &&
    filteredContacts.length > 0;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3>Contacts List</h3>
        {filteredContacts.length > 0 && (
          <label className={styles.selectAll}>
            <input
              type="checkbox"
              checked={allSelected}
              onChange={selectAllHandler}
            />
            Select All
          </label>
        )}
      </div>

      {filteredContacts.length ? (
        <ul className={styles.contacts}>
          {filteredContacts.map((contact) => (
            <ContactsItem key={contact.id} data={contact} />
          ))}
        </ul>
      ) : (
        <p className={styles.message}>No data yet!</p>
      )}
    </div>
  );
}

export default ContactsList;
