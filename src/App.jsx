import "./global.css";
import Header from "./components/Header.jsx";
import Contacts from "./components/Contacts.jsx";
import { ContactsProvider } from "./components/ContactsContext.jsx";

function App() {
  return (
    <ContactsProvider>
      <Header />
      <Contacts />
    </ContactsProvider>
  );
}

export default App;
