import React from "react";
import styles from "./Header.module.css";

function Header() {
  return (
    <div className={styles.container}>
      <h1>Content App</h1>
      <a href="https://github.com">React.js Full Course</a>
    </div>
  );
}

export default Header;
