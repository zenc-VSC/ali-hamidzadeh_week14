import { createContext, useContext, useState } from "react";
import { v4 } from "uuid";
import useLocalStorage from "../Hooks/useLocalStorage.js";

const ContactsContext = createContext();

export function useContacts() {
  return useContext(ContactsContext);
}

export function ContactsProvider({ children }) {
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
    setContact({ name: "", lastName: "", email: "", phone: "" });
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
    setContact({ name: "", lastName: "", email: "", phone: "" });
    setIsEditing(false);
    setEditId(null);
  };

  const cancelEdit = () => {
    setContact({ name: "", lastName: "", email: "", phone: "" });
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

  const filteredContacts = contacts.filter(
    (contact) =>
      contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.phone.includes(searchTerm),
  );

  const selectAllHandler = () => {
    if (
      selectedIds.length === filteredContacts.length &&
      filteredContacts.length > 0
    ) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredContacts.map((c) => c.id));
    }
  };

  const value = {
    alert,
    contact,
    contacts,
    selectedIds,
    searchTerm,
    isEditing,
    showModal,
    pendingDeleteId,
    filteredContacts,
    setSearchTerm,
    changeHandler,
    addHandler,
    editHandler,
    updateHandler,
    cancelEdit,
    deleteHandler,
    confirmDelete,
    cancelDelete,
    toggleSelect,
    bulkDeleteHandler,
    selectAllHandler,
  };

  return (
    <ContactsContext.Provider value={value}>
      {children}
    </ContactsContext.Provider>
  );
}

export default ContactsContext;
