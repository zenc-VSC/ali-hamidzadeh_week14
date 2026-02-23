import React from "react";
import ContactsItem from "./ContactsItem";
import styles from "./ContactsList.module.css";

function ContactsList({
  contacts,
  deleteHandler,
  editHandler,
  selectedIds,
  toggleSelect,
  selectAllHandler,
  allSelected,
}) {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3>Contacts List</h3>
        {contacts.length > 0 && (
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

      {contacts.length ? (
        <ul className={styles.contacts}>
          {contacts.map((contact) => (
            <ContactsItem
              key={contact.id}
              data={contact}
              deleteHandler={deleteHandler}
              editHandler={editHandler}
              isSelected={selectedIds.includes(contact.id)}
              onSelect={toggleSelect}
            />
          ))}
        </ul>
      ) : (
        <p className={styles.message}>No data yet!</p>
      )}
    </div>
  );
}

export default ContactsList;
