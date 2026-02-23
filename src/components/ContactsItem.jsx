import React from "react";
import styles from "./ContactsItem.module.css";

function ContactsItem({
  data: { id, name, lastName, email, phone },
  deleteHandler,
  editHandler,
  isSelected,
  onSelect,
}) {
  return (
    <li className={styles.item}>
      <input
        type="checkbox"
        checked={isSelected}
        onChange={() => onSelect(id)}
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
