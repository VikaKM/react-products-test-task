import styles from "./ProgressBar.module.scss";

function ProgressBar() {
  return (
    <div className={styles.wrapper} aria-label="Loading">
      <div className={styles.bar} />
    </div>
  );
}

export default ProgressBar;
