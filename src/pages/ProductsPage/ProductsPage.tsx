import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
  Search,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Plus,
  MoreHorizontal
} from "lucide-react";

import {
  getProducts,
  searchProducts,
  type Product
} from "../../api/productsApi";
import { useDebounce } from "../../hooks/useDebounce";
import AddProductModal from "../../components/AddProductModal";
import type { AddProductFormData } from "../../components/AddProductModal";
import ProgressBar from "../../components/ProgressBar";
import CustomCheckbox from "../../components/CustomCheckbox";
import styles from "./ProductsPage.module.scss";

type SortField = "title" | "price" | "rating" | "brand";
type SortOrder = "asc" | "desc";

const formatPrice = (price: number) =>
  price
    .toFixed(2)
    .replace(".", ",")
    .replace(/\B(?=(\d{3})+(?!\d))/g, " ");

const formatCategory = (category: string) =>
  category.charAt(0).toUpperCase() + category.slice(1);

const formatRating = (rating: number) => rating.toFixed(1).replace(".", ",");

function ProductsPage() {
  const [searchValue, setSearchValue] = useState("");
  const [sortField, setSortField] = useState<SortField>("title");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [localProducts, setLocalProducts] = useState<Product[]>([]);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const debouncedSearchValue = useDebounce(searchValue, 400);

  const { data, isLoading, error, isFetching } = useQuery({
    queryKey: ["products", debouncedSearchValue],
    queryFn: () =>
      debouncedSearchValue.trim()
        ? searchProducts(debouncedSearchValue)
        : getProducts()
  });

  const mergedProducts = useMemo(
    () => [...localProducts, ...(data ?? [])],
    [localProducts, data]
  );

  const sortedProducts = useMemo(() => {
    const productsCopy = [...mergedProducts];

    productsCopy.sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];

      if (typeof aValue === "number" && typeof bValue === "number") {
        return sortOrder === "asc" ? aValue - bValue : bValue - aValue;
      }

      const aString = String(aValue).toLowerCase();
      const bString = String(bValue).toLowerCase();

      if (aString < bString) {
        return sortOrder === "asc" ? -1 : 1;
      }

      if (aString > bString) {
        return sortOrder === "asc" ? 1 : -1;
      }

      return 0;
    });

    return productsCopy;
  }, [mergedProducts, sortField, sortOrder]);

  const allSelected =
    sortedProducts.length > 0 &&
    sortedProducts.every((product) => selectedIds.includes(product.id));

  const openAddModal = () => setIsAddModalOpen(true);
  const closeAddModal = () => setIsAddModalOpen(false);

  const toggleSelectAll = () => {
    if (allSelected) {
      setSelectedIds([]);
      return;
    }

    setSelectedIds(sortedProducts.map((product) => product.id));
  };

  const toggleRowSelection = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
      return;
    }

    setSortField(field);
    setSortOrder("asc");
  };

  const handleAddProduct = (formData: AddProductFormData) => {
    const newProduct: Product = {
      id: Date.now(),
      title: formData.title,
      price: formData.price,
      brand: formData.brand,
      category: formData.category,
      sku: formData.sku,
      rating: 0,
      thumbnail: "https://placehold.co/100x100?text=Product"
    };

    setLocalProducts((prev) => [newProduct, ...prev]);
    toast.success("Товар успешно добавлен");
  };

  const renderSortMark = (field: SortField) => {
    if (sortField !== field) {
      return null;
    }

    return (
      <span className={styles.sortMark}>{sortOrder === "asc" ? "↑" : "↓"}</span>
    );
  };

  if (isLoading) {
    return (
      <div className={styles.page}>
        <div className={styles.loadingBlock}>
          <p className={styles.loadingText}>Loading products...</p>
          <ProgressBar />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.page}>
        <p className={styles.errorText}>Ошибка загрузки товаров</p>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.topBar}>
        <h1 className={styles.pageTitle}>Товары</h1>

        <div className={styles.searchWrapper}>
          <span className={styles.searchIcon}>
            <Search size={20} />
          </span>

          <input
            className={styles.searchInput}
            type="text"
            placeholder="Найти"
            value={searchValue}
            onChange={(event) => setSearchValue(event.target.value)}
          />
        </div>
      </div>

      {isFetching && (
        <div className={styles.fetchingBlock}>
          <p className={styles.fetchingText}>Обновление списка...</p>
          <ProgressBar />
        </div>
      )}

      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <h2 className={styles.cardTitle}>Все позиции</h2>

          <div className={styles.cardActions}>
            <button
              type="button"
              className={styles.iconButton}
              aria-label="Обновить список"
            >
              <RefreshCw size={18} />
            </button>

            <button
              type="button"
              className={styles.addButton}
              onClick={openAddModal}
            >
              <span className={styles.addCircle}>
                <Plus size={12} />
              </span>

              <span className={styles.addText}>Добавить</span>
            </button>
          </div>
        </div>

        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.checkboxCol}>
                  <CustomCheckbox
                    checked={allSelected}
                    onClick={toggleSelectAll}
                    ariaLabel={
                      allSelected
                        ? "Снять выделение со всех строк"
                        : "Выбрать все строки"
                    }
                  />
                </th>

                <th className={styles.nameColumn}>Наименование</th>

                <th
                  onClick={() => handleSort("brand")}
                  className={`${styles.sortable} ${styles.centerColumn}`}
                >
                  Вендор
                  {renderSortMark("brand")}
                </th>

                <th className={styles.centerColumn}>Артикул</th>

                <th
                  onClick={() => handleSort("rating")}
                  className={`${styles.sortable} ${styles.centerColumn}`}
                >
                  Оценка
                  {renderSortMark("rating")}
                </th>

                <th
                  onClick={() => handleSort("price")}
                  className={`${styles.sortable} ${styles.centerColumn}`}
                >
                  Цена, ₽{renderSortMark("price")}
                </th>

                <th></th>
              </tr>
            </thead>

            <tbody>
              {sortedProducts.map((product) => {
                const isSelected = selectedIds.includes(product.id);
                const formattedPrice = formatPrice(product.price);
                const [rubles, kopeks] = formattedPrice.split(",");

                return (
                  <tr
                    key={product.id}
                    className={isSelected ? styles.selectedRow : undefined}
                  >
                    <td className={styles.checkboxCell}>
                      <CustomCheckbox
                        checked={isSelected}
                        onClick={() => toggleRowSelection(product.id)}
                        ariaLabel={
                          isSelected
                            ? "Снять выделение строки"
                            : "Выделить строку"
                        }
                      />
                    </td>

                    <td className={styles.nameColumn}>
                      <div className={styles.productCell}>
                        <img
                          src={product.thumbnail}
                          alt={product.title}
                          className={styles.productImage}
                        />

                        <div className={styles.productText}>
                          <div className={styles.productName}>
                            {product.title}
                          </div>

                          <div className={styles.productCategory}>
                            {formatCategory(product.category)}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td
                      className={`${styles.vendorCell} ${styles.centerColumn}`}
                    >
                      {product.brand}
                    </td>

                    <td className={styles.centerColumn}>
                      {product.sku ?? "—"}
                    </td>

                    <td className={styles.centerColumn}>
                      <span
                        className={
                          product.rating < 3
                            ? styles.ratingLow
                            : styles.ratingNormal
                        }
                      >
                        {formatRating(product.rating)}
                      </span>
                      /5
                    </td>

                    <td
                      className={`${styles.priceCell} ${styles.centerColumn}`}
                    >
                      <span className={styles.rubles}>{rubles}</span>
                      <span className={styles.kopeks}>, {kopeks}</span>
                    </td>

                    <td>
                      <div className={styles.rowActions}>
                        <button type="button" className={styles.plusButton}>
                          +
                        </button>

                        <button type="button" className={styles.moreButton}>
                          <MoreHorizontal size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className={styles.tableFooter}>
          <span className={styles.paginationInfo}>
            Показано <span className={styles.paginationCount}>1-20</span> из{" "}
            <span className={styles.paginationCount}>120</span>
          </span>

          <div className={styles.pagination}>
            <button type="button" className={styles.pageArrow}>
              <ChevronLeft size={16} />
            </button>

            <button type="button" className={styles.activePage}>
              1
            </button>
            <button type="button" className={styles.pageButton}>
              2
            </button>
            <button type="button" className={styles.pageButton}>
              3
            </button>
            <button type="button" className={styles.pageButton}>
              4
            </button>
            <button type="button" className={styles.pageButton}>
              5
            </button>

            <button type="button" className={styles.pageArrow}>
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      <AddProductModal
        isOpen={isAddModalOpen}
        onClose={closeAddModal}
        onSubmit={handleAddProduct}
      />
    </div>
  );
}

export default ProductsPage;
