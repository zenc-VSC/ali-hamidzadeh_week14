import React, { useState } from "react";

import ContactsList from "./ContactsList.jsx";
import inputs from "../constants/inputs.js";
import { v4 } from "uuid";
import styles from "./Contacts.module.css";
import useLocalStorage from "../Hooks/useLocalStorage.js";
import ConfirmModal from "./ConfirmModal.jsx";

function Contacts() {
  const [alert, setAlert] = useState("");
  const [contacts, setContacts] = useLocalStorage("contacts", []);
  const [selectedIds, setSelectedIds] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [pendingDeleteId, setPendingDeleteId] = useState(null);
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
    setPendingDeleteId(id);
    setShowModal(true);
  };
  const confirmDelete = () => {
    if (pendingDeleteId === "bulk") {
      setContacts((prev) => prev.filter((c) => !selectedIds.includes(c.id)));
      setSelectedIds([]);
    } else {
      setContacts((prev) => prev.filter((c) => c.id !== pendingDeleteId));
    }
    setShowModal(false);
    setPendingDeleteId(null);
  };
  const cancelDelete = () => {
    setShowModal(false);
    setPendingDeleteId(null);
  };
  const toggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id],
    );
  };

  const bulkDeleteHandler = () => {
    setPendingDeleteId("bulk");
    setShowModal(true);
  };
  const selectAllHandler = () => {
    if (
      selectedIds.length === filteredContacts.length &&
      filteredContacts.length > 0
    ) {
      setSelectedIds([]); // deselect all
    } else {
      setSelectedIds(filteredContacts.map((c) => c.id)); // select all
    }
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
      {selectedIds.length > 0 && (
        <button onClick={bulkDeleteHandler} className={styles.bulkDelete}>
          🗑️ Delete {selectedIds.length} selected
        </button>
      )}

      <div className={styles.alert}>{alert && <p>{alert}</p>}</div>
      <ContactsList
        contacts={filteredContacts}
        deleteHandler={deleteHandler}
        editHandler={editHandler}
        selectedIds={selectedIds}
        toggleSelect={toggleSelect}
        selectAllHandler={selectAllHandler}
        allSelected={
          selectedIds.length === filteredContacts.length &&
          filteredContacts.length > 0
        }
      />
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
