import styles from "./CustomCheckbox.module.scss";

interface CustomCheckboxProps {
  checked: boolean;
  onClick: () => void;
  ariaLabel?: string;
}

function CustomCheckbox({
  checked,
  onClick,
  ariaLabel = "Toggle checkbox"
}: CustomCheckboxProps) {
  return (
    <button
      type="button"
      className={styles.checkboxButton}
      onClick={(event) => {
        event.stopPropagation();
        onClick();
      }}
      aria-label={ariaLabel}
    >
      <span
        className={checked ? styles.selectedCheckbox : styles.checkboxFake}
      />
    </button>
  );
}

export default CustomCheckbox;
