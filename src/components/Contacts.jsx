import React, { useState } from "react";

import ContactsList from "./ContactsList.jsx";
import inputs from "../constants/inputs.js";
import { v4 } from "uuid";
import styles from "./Contacts.module.css";

function Contacts() {
  const [alert, setAlert] = useState("");
  const [contacts, setContacts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [contact, setContact] = useState({
    id: "",
    name: "",
    lastName: "",
    email: "",
    phone: "",
  });

  const changeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setContact((contact) => ({
      ...contact,
      [name]: value,
    }));
  };

  const addHandler = () => {
    if (
      !contact.name ||
      !contact.lastName ||
      !contact.email ||
      !contact.phone
    ) {
      setAlert("Please enter valid data!");
      return;
    } else if (contact.name.length + contact.lastName.length < 7) {
      setAlert("Name and LastName must be at least 7 characters!");
      return;
    }
    const phoneRegex = /^[0-9]+$/;
    if (!phoneRegex.test(contact.phone)) {
      setAlert("Phone number must contain only numbers!");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(contact.email)) {
      setAlert("Please enter a valid email!");
      return;
    }

    setAlert("");

    const newContact = { ...contact, id: v4() };
    setContacts((contacts) => [...contacts, newContact]);
    setContact({
      name: "",
      lastName: "",
      email: "",
      phone: "",
    });
  };

  const editHandler = (id) => {
    const contactToEdit = contacts.find((contact) => contact.id === id);
    setContact(contactToEdit);
    setIsEditing(true);
    setEditId(id);
  };

  const updateHandler = () => {
    if (
      !contact.name ||
      !contact.lastName ||
      !contact.email ||
      !contact.phone
    ) {
      setAlert("Please enter valid data!");
      return;
    }

    setAlert("");
    const updatedContacts = contacts.map((event) =>
      event.id === editId ? { ...contact } : event,
    );
    setContacts(updatedContacts);
    setContact({
      name: "",
      lastName: "",
      email: "",
      phone: "",
    });
    setIsEditing(false);
    setEditId(null);
  };

  const cancelEdit = () => {
    setContact({
      name: "",
      lastName: "",
      email: "",
      phone: "",
    });
    setIsEditing(false);
    setEditId(null);
    setAlert("");
  };

  const deleteHandler = (id) => {
    const newContacts = contacts.filter((contact) => contact.id !== id);
    setContacts(newContacts);
  };

  const filteredContacts = contacts.filter(
    (contact) =>
      contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.phone.includes(searchTerm),
  );

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

      <div className={styles.alert}>{alert && <p>{alert}</p>}</div>
      <ContactsList
        contacts={filteredContacts}
        deleteHandler={deleteHandler}
        editHandler={editHandler}
      />
    </div>
  );
}

export default Contacts;
