import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import { v4 } from "uuid";

const ContactsContext = createContext();

export function useContacts() {
  return useContext(ContactsContext);
}

export const ACTIONS = {
  CHANGE_FIELD: "CHANGE_FIELD",
  SET_ALERT: "SET_ALERT",
  SET_SEARCH: "SET_SEARCH",
  ADD_CONTACT: "ADD_CONTACT",
  EDIT_CONTACT: "EDIT_CONTACT",
  UPDATE_CONTACT: "UPDATE_CONTACT",
  CANCEL_EDIT: "CANCEL_EDIT",
  DELETE_CONTACT: "DELETE_CONTACT",
  CONFIRM_DELETE: "CONFIRM_DELETE",
  CANCEL_DELETE: "CANCEL_DELETE",
  TOGGLE_SELECT: "TOGGLE_SELECT",
  BULK_DELETE: "BULK_DELETE",
  SELECT_ALL: "SELECT_ALL",
};

const emptyContact = { id: "", name: "", lastName: "", email: "", phone: "" };

const phoneRegex = /^[0-9]+$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateContact({ name, lastName, email, phone }) {
  if (!name || !lastName || !email || !phone) return "Please enter valid data!";
  if (name.length + lastName.length < 7)
    return "Name and LastName must be at least 7 characters!";
  if (!phoneRegex.test(phone)) return "Phone number must contain only numbers!";
  if (!emailRegex.test(email)) return "Please enter a valid email!";
  return null;
}

function getStoredContacts() {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem("contacts")) || [];
  } catch {
    return [];
  }
}

function init() {
  return {
    alert: "",
    contacts: getStoredContacts(),
    selectedIds: [],
    searchTerm: "",
    isEditing: false,
    showModal: false,
    editId: null,
    pendingDeleteId: null,
    isBulkDelete: false,
    contact: emptyContact,
  };
}

function contactsReducer(state, action) {
  switch (action.type) {
    case ACTIONS.CHANGE_FIELD:
      return {
        ...state,
        contact: {
          ...state.contact,
          [action.payload.name]: action.payload.value,
        },
      };

    case ACTIONS.SET_ALERT:
      return { ...state, alert: action.payload };

    case ACTIONS.SET_SEARCH:
      return { ...state, searchTerm: action.payload };

    case ACTIONS.ADD_CONTACT:
      return {
        ...state,
        contacts: [...state.contacts, action.payload],
        contact: emptyContact,
        alert: "",
      };

    case ACTIONS.EDIT_CONTACT:
      return {
        ...state,
        contact: action.payload,
        isEditing: true,
        editId: action.payload.id,
      };

    case ACTIONS.UPDATE_CONTACT:
      return {
        ...state,
        contacts: state.contacts.map((c) =>
          c.id === state.editId ? { ...state.contact } : c,
        ),
        contact: emptyContact,
        isEditing: false,
        editId: null,
        alert: "",
      };

    case ACTIONS.CANCEL_EDIT:
      return {
        ...state,
        contact: emptyContact,
        isEditing: false,
        editId: null,
        alert: "",
      };

    case ACTIONS.DELETE_CONTACT:
      return {
        ...state,
        pendingDeleteId: action.payload,
        isBulkDelete: false,
        showModal: true,
      };

    case ACTIONS.CONFIRM_DELETE:
      if (state.isBulkDelete) {
        return {
          ...state,
          contacts: state.contacts.filter(
            (c) => !state.selectedIds.includes(c.id),
          ),
          selectedIds: [],
          showModal: false,
          pendingDeleteId: null,
          isBulkDelete: false,
        };
      }
      return {
        ...state,
        contacts: state.contacts.filter((c) => c.id !== state.pendingDeleteId),
        showModal: false,
        pendingDeleteId: null,
        isBulkDelete: false,
      };

    case ACTIONS.CANCEL_DELETE:
      return {
        ...state,
        showModal: false,
        pendingDeleteId: null,
        isBulkDelete: false,
      };

    case ACTIONS.TOGGLE_SELECT:
      return {
        ...state,
        selectedIds: state.selectedIds.includes(action.payload)
          ? state.selectedIds.filter((id) => id !== action.payload)
          : [...state.selectedIds, action.payload],
      };

    case ACTIONS.BULK_DELETE:
      return {
        ...state,
        isBulkDelete: true,
        pendingDeleteId: null,
        showModal: true,
      };

    case ACTIONS.SELECT_ALL:
      return { ...state, selectedIds: action.payload };

    default:
      return state;
  }
}

export function ContactsProvider({ children }) {
  const [state, dispatch] = useReducer(contactsReducer, null, init);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("contacts", JSON.stringify(state.contacts));
    }
  }, [state.contacts]);

  const filteredContacts = useMemo(
    () =>
      state.contacts.filter(
        (e) =>
          e.name.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
          e.lastName.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
          e.email.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
          e.phone.includes(state.searchTerm),
      ),
    [state.contacts, state.searchTerm],
  );

  const changeHandler = useCallback(
    (e) =>
      dispatch({
        type: ACTIONS.CHANGE_FIELD,
        payload: { name: e.target.name, value: e.target.value },
      }),
    [],
  );

  const setSearchTerm = useCallback(
    (value) => dispatch({ type: ACTIONS.SET_SEARCH, payload: value }),
    [],
  );

  const addHandler = useCallback(() => {
    const error = validateContact(state.contact);
    if (error) return dispatch({ type: ACTIONS.SET_ALERT, payload: error });
    dispatch({
      type: ACTIONS.ADD_CONTACT,
      payload: { ...state.contact, id: v4() },
    });
  }, [state.contact]);

  const editHandler = useCallback(
    (id) => {
      const found = state.contacts.find((e) => e.id === id);
      if (found) dispatch({ type: ACTIONS.EDIT_CONTACT, payload: found });
    },
    [state.contacts],
  );

  const updateHandler = useCallback(() => {
    const error = validateContact(state.contact);
    if (error) return dispatch({ type: ACTIONS.SET_ALERT, payload: error });
    dispatch({ type: ACTIONS.UPDATE_CONTACT });
  }, [state.contact]);

  const cancelEdit = useCallback(
    () => dispatch({ type: ACTIONS.CANCEL_EDIT }),
    [],
  );

  const deleteHandler = useCallback(
    (id) => dispatch({ type: ACTIONS.DELETE_CONTACT, payload: id }),
    [],
  );

  const confirmDelete = useCallback(
    () => dispatch({ type: ACTIONS.CONFIRM_DELETE }),
    [],
  );

  const cancelDelete = useCallback(
    () => dispatch({ type: ACTIONS.CANCEL_DELETE }),
    [],
  );

  const toggleSelect = useCallback(
    (id) => dispatch({ type: ACTIONS.TOGGLE_SELECT, payload: id }),
    [],
  );

  const bulkDeleteHandler = useCallback(
    () => dispatch({ type: ACTIONS.BULK_DELETE }),
    [],
  );

  const selectAllHandler = useCallback(() => {
    const allSelected =
      state.selectedIds.length === filteredContacts.length &&
      filteredContacts.length > 0;
    dispatch({
      type: ACTIONS.SELECT_ALL,
      payload: allSelected ? [] : filteredContacts.map((e) => e.id),
    });
  }, [state.selectedIds, filteredContacts]);

  const value = useMemo(
    () => ({
      ...state,
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
    }),
    [
      state,
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
    ],
  );

  return (
    <ContactsContext.Provider value={value}>
      {children}
    </ContactsContext.Provider>
  );
}

export default ContactsContext;
