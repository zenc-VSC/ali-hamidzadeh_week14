import React from "react";
import ContactsItem from "./ContactsItem";
import styles from "./ContactsList.module.css";

function ContactsList({ contacts, deleteHandler, editHandler }) {
  return (
    <div className={styles.container}>
      <h3>ContactsList</h3>
      {contacts.length ? (
        <ul className={styles.contacts}>
          {contacts.map((contact) => (
            <ContactsItem
              key={contact.id}
              data={contact}
              deleteHandler={deleteHandler}
              editHandler={editHandler}
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
