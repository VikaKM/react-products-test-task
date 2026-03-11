import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import styles from "./AddProductModal.module.scss";

const schema = z.object({
  title: z.string().min(1, "Введите название"),
  price: z.coerce.number().positive("Цена должна быть больше 0"),
  brand: z.string().min(1, "Введите бренд"),
  category: z.string().min(1, "Введите категорию"),
  sku: z.string().min(1, "Введите артикул")
});

type AddProductFormValue = z.input<typeof schema>;
export type AddProductFormData = z.output<typeof schema>;

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: AddProductFormData) => void;
}

const defaultValues: AddProductFormValue = {
  title: "",
  price: 0,
  brand: "",
  sku: "",
  category: ""
};

function AddProductModal({ isOpen, onClose, onSubmit }: AddProductModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<AddProductFormValue, unknown, AddProductFormData>({
    resolver: zodResolver(schema),
    defaultValues
  });

  const handleModalClose = () => {
    reset(defaultValues);
    onClose();
  };

  const handleFormSubmit = (data: AddProductFormData) => {
    onSubmit(data);
    reset(defaultValues);
    onClose();
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2 className={styles.title}>Добавить новый товар</h2>

          <button
            type="button"
            className={styles.closeButton}
            onClick={handleModalClose}
            aria-label="Закрыть модальное окно"
          >
            ×
          </button>
        </div>

        <form
          className={styles.form}
          onSubmit={handleSubmit(handleFormSubmit)}
          autoComplete="off"
        >
          <div className={styles.field}>
            <label className={styles.label} htmlFor="title">
              Наименование
            </label>
            <input
              id="title"
              className={styles.input}
              placeholder="Введите название"
              {...register("title")}
            />
            {errors.title && (
              <p className={styles.error}>{errors.title.message}</p>
            )}
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="brand">
              Вендор
            </label>
            <input
              id="brand"
              className={styles.input}
              placeholder="Введите вендор"
              {...register("brand")}
            />
            {errors.brand && (
              <p className={styles.error}>{errors.brand.message}</p>
            )}
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="category">
              Категория
            </label>
            <input
              id="category"
              className={styles.input}
              placeholder="Введите категорию"
              {...register("category")}
            />
            {errors.category && (
              <p className={styles.error}>{errors.category.message}</p>
            )}
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="sku">
              Артикул
            </label>
            <input
              id="sku"
              className={styles.input}
              placeholder="Введите артикул"
              {...register("sku")}
            />
            {errors.sku && <p className={styles.error}>{errors.sku.message}</p>}
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="price">
              Цена, ₽
            </label>
            <input
              id="price"
              className={styles.input}
              type="number"
              step="0.01"
              placeholder="0.00"
              {...register("price")}
            />
            {errors.price && (
              <p className={styles.error}>{errors.price.message}</p>
            )}
          </div>

          <div className={styles.actions}>
            <button
              type="button"
              className={styles.secondaryButton}
              onClick={handleModalClose}
            >
              Отменить
            </button>

            <button type="submit" className={styles.primaryButton}>
              Добавить товар
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddProductModal;
