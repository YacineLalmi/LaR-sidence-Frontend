import React from "react";
import styles from "./styles.module.css";

function HourglassLoader() {
  return (
    <div className={styles.container}>
      <div className={styles.half}></div>
      <div className={styles.half}></div>
    </div>
  );
}

export default HourglassLoader;
