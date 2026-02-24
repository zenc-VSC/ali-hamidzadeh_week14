import React from "react";
import styles from "./ContactsItem.module.css";
import { useContacts } from "./ContactsContext.jsx";

function ContactsItem({ data: { id, name, lastName, email, phone } }) {
  const { deleteHandler, editHandler, selectedIds, toggleSelect } =
    useContacts();

  const isSelected = selectedIds.includes(id);

  return (
    <li className={styles.item}>
      <input
        type="checkbox"
        checked={isSelected}
        onChange={() => toggleSelect(id)}
      />
      <p>
        {name} {lastName}
      </p>
      <p>
        <span>📧</span> {email}
      </p>
      <p>
        <span>📞</span> {phone}
      </p>
      <button onClick={() => deleteHandler(id)}>🗑️</button>
      <button onClick={() => editHandler(id)}>✏️</button>
    </li>
  );
}

export default ContactsItem;
