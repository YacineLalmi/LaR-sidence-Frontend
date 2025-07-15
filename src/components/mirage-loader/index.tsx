import React from "react";
import styles from "./styles.module.css";

export default function MirageLoader() {
  return (
    <>
      <div className={styles.container}>
        <div className={styles.dot}></div>
        <div className={styles.dot}></div>
        <div className={styles.dot}></div>
        <div className={styles.dot}></div>
        <div className={styles.dot}></div>
      </div>
    </>
  );
}
