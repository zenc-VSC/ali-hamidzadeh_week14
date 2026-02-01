import React from "react";
import ContactsItem from "./ContactsItem";

function ContactsList({ contacts , deleteHandler}) {
  return (
    <div>
      <h3>ContactsList</h3>
      {contacts.length ? (
        <ul>
          {contacts.map((contact) => (
            <ContactsItem key={contact.id} data={contact}  deleteHandler={deleteHandler}/>
          ))}
        </ul>
      ) : (
        <p>No data yet!</p>
      )}
    </div>
  );
}

export default ContactsList;
