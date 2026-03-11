import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { Eye, EyeOff, X, User, Lock } from "lucide-react";

import LogoIcon from "../../components/icons/LogoIcon";
import { login } from "../../api/authApi";
import { getAuthData, saveAuthData } from "../../utils/authStorage";
import styles from "./LoginPage.module.scss";

const schema = z.object({
  username: z.string().min(1, "Введите логин"),
  password: z.string().min(1, "Введите пароль"),
  rememberMe: z.boolean()
});

type FormData = z.infer<typeof schema>;

const defaultValues: FormData = {
  username: "",
  password: "",
  rememberMe: false
};

function LoginPage() {
  const navigate = useNavigate();
  const [apiError, setApiError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors, isSubmitting }
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues
  });

  const usernameValue = useWatch({
    control,
    name: "username"
  });

  const clearUsername = () => {
    setValue("username", "", {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true
    });
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const onSubmit = async ({ username, password, rememberMe }: FormData) => {
    setApiError("");

    try {
      const result = await login({ username, password });

      saveAuthData(
        {
          accessToken: result.accessToken,
          refreshToken: result.refreshToken
        },
        rememberMe
      );

      toast.success("Вход выполнен успешно");
      navigate("/products", { replace: true });
    } catch (error) {
      setApiError("Неверный логин или пароль");
      toast.error("Ошибка авторизации");
      console.error(error);
    }
  };

  useEffect(() => {
    const auth = getAuthData();

    if (auth) {
      navigate("/products", { replace: true });
    }
  }, [navigate]);

  return (
    <div className={styles.page}>
      <div className={styles.cardShell}>
        <div className={styles.card}>
          <div className={styles.logoWrapper}>
            <LogoIcon />
          </div>

          <h1 className={styles.title}>Добро пожаловать!</h1>
          <p className={styles.subtitle}>Пожалуйста, авторизируйтесь</p>

          <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="username">
                Логин
              </label>

              <div
                className={`${styles.inputWrapper} ${
                  errors.username ? styles.inputError : ""
                }`}
              >
                <span className={styles.leftIcon}>
                  <User size={22} />
                </span>

                <input
                  id="username"
                  className={styles.input}
                  placeholder="Введите логин"
                  {...register("username")}
                />

                {usernameValue && (
                  <button
                    type="button"
                    className={styles.iconButton}
                    onClick={clearUsername}
                    aria-label="Очистить логин"
                  >
                    <X size={18} />
                  </button>
                )}
              </div>

              {errors.username && (
                <p className={styles.errorText}>{errors.username.message}</p>
              )}
            </div>

            <div className={styles.field}>
              <label className={styles.label} htmlFor="password">
                Пароль
              </label>

              <div
                className={`${styles.inputWrapper} ${
                  errors.password ? styles.inputError : ""
                }`}
              >
                <span className={styles.leftIcon}>
                  <Lock size={22} />
                </span>

                <input
                  id="password"
                  className={styles.input}
                  type={showPassword ? "text" : "password"}
                  placeholder="Введите пароль"
                  {...register("password")}
                />

                <button
                  type="button"
                  className={styles.iconButton}
                  onClick={togglePasswordVisibility}
                  aria-label={
                    showPassword ? "Скрыть пароль" : "Показать пароль"
                  }
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {errors.password && (
                <p className={styles.errorText}>{errors.password.message}</p>
              )}
            </div>

            <label className={styles.checkboxRow}>
              <input
                type="checkbox"
                className={styles.checkbox}
                {...register("rememberMe")}
              />
              <span className={styles.checkboxText}>Запомнить данные</span>
            </label>

            {apiError && <p className={styles.apiError}>{apiError}</p>}

            <button
              type="submit"
              className={styles.submitButton}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Загрузка..." : "Войти"}
            </button>

            <div className={styles.divider}>
              <span className={styles.dividerText}>
                <span className={styles.dividerTextInner}>или</span>
              </span>
            </div>

            <p className={styles.footerText}>
              Нет аккаунта?{" "}
              <a href="#" className={styles.footerLink}>
                Создать
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
