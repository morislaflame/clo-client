import { useState, useContext, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { observer } from "mobx-react-lite";
import {
  Card,
  CardHeader,
  CardBody,
  Input,
  Button,
  Link,
  Divider,
  Chip,
} from "@heroui/react";
import { EyeFilledIcon, EyeSlashFilledIcon } from "@/components/ui/Icons";
import { Context, type IStoreContext } from "@/store/StoreProvider";
import { MAIN_ROUTE, LOGIN_ROUTE, REGISTRATION_ROUTE } from "@/utils/consts";
import { useTranslate } from "@/utils/useTranslate";
import PageWrapper from "@/components/PageWrapper";

const AuthPage = observer(() => {
  const { user } = useContext(Context) as IStoreContext;
  const location = useLocation();
  const navigate = useNavigate();
  const isLogin = location.pathname === LOGIN_ROUTE;
  const { t } = useTranslate();
  
  // Основные состояния
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [isConfirmVisible, setIsConfirmVisible] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  // Состояния для верификации email
  const [verificationStep, setVerificationStep] = useState<'credentials' | 'verification'>('credentials');
  const [verificationCode, setVerificationCode] = useState("");
  const [expiresAt, setExpiresAt] = useState<string | null>(null);

  const toggleVisibility = () => setIsVisible(!isVisible);
  const toggleConfirmVisibility = () => setIsConfirmVisible(!isConfirmVisible);

  useEffect(() => {
    if (user.isAuth) {
      navigate(MAIN_ROUTE, { replace: true });
    }
  }, [user.isAuth, navigate]);

  // Сброс состояний при переключении между логином и регистрацией
  useEffect(() => {
    setVerificationStep('credentials');
    setVerificationCode("");
    setExpiresAt(null);
    setError("");
  }, [isLogin]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Валидация
    if (!email || !password) {
      setError("Пожалуйста, заполните все поля");
      setIsLoading(false);
      return;
    }

    if (!isLogin && password !== confirmPassword) {
      setError("Пароли не совпадают");
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Пароль должен содержать минимум 6 символов");
      setIsLoading(false);
      return;
    }

    try {
      let result;
      if (isLogin) {
        result = await user.login(email, password);
        if (result.success) {
          // Успешный логин - перенаправляем на главную
          return;
        }
      } else {
        // Для регистрации сначала отправляем код верификации
        if (verificationStep === 'credentials') {
          result = await user.sendRegistrationCode(email);
          if (result.success) {
            setExpiresAt(result.data?.expiresAt || null);
            setVerificationStep('verification');
            setError("");
            setIsLoading(false);
            return;
          }
        } else {
          // Второй шаг - подтверждение кода
          result = await user.registerWithVerification(email, password, verificationCode);
          if (result.success) {
            // Успешная регистрация - перенаправляем на главную
            return;
          }
        }
      }

      if (!result.success) {
        setError(result.error || "Произошла ошибка");
      }
    } catch {
      setError("Произошла ошибка соединения");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    setError("");
    setIsLoading(true);
    
    try {
      const result = await user.sendRegistrationCode(email);
      if (result.success) {
        setExpiresAt(result.data?.expiresAt || null);
        setError("");
      } else {
        setError(result.error || "Не удалось отправить код повторно");
      }
    } catch {
      setError("Произошла ошибка соединения");
    } finally {
      setIsLoading(false);
    }
  };

  const switchAuthMode = () => {
    setError("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setVerificationCode("");
    setVerificationStep('credentials');
    setExpiresAt(null);
    navigate(isLogin ? REGISTRATION_ROUTE : LOGIN_ROUTE);
  };

  const goBackToCredentials = () => {
    setVerificationStep('credentials');
    setVerificationCode("");
    setExpiresAt(null);
    setError("");
  };

  const formatExpirationTime = (expiresAt: string) => {
    const date = new Date(expiresAt);
    const now = new Date();
    const diffMs = date.getTime() - now.getTime();
    const diffMins = Math.ceil(diffMs / (1000 * 60));
    
    if (diffMins <= 0) return "Истек";
    return `${diffMins} мин`;
  };

  return (
    <PageWrapper className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-4">
        <CardHeader className="flex flex-col gap-3 pb-4">
          <div className="flex justify-center">
            <img src="/lg.png" alt="Logo" className="h-8" />
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-bold">
              {isLogin 
                ? t("login") 
                : verificationStep === 'verification' 
                  ? "Подтверждение email" 
                  : t("register")
              }
            </h1>
            <p className="text-default-500 text-sm mt-1">
              {isLogin 
                ? t("enter_data") 
                : verificationStep === 'verification'
                  ? `Код отправлен на ${email}`
                  : t("create_account")
              }
            </p>
            {verificationStep === 'verification' && expiresAt && (
              <p className="text-xs text-default-400 mt-1">
                Код действителен: {formatExpirationTime(expiresAt)}
              </p>
            )}
          </div>
        </CardHeader>

        <CardBody className="gap-3">
          <form onSubmit={handleSubmit} className="flex flex-col gap-2">
            {/* Поля для ввода данных (показываются всегда для логина или на первом шаге регистрации) */}
            {(isLogin || verificationStep === 'credentials') && (
              <>
                <Input
                  label="Email"
                  placeholder={t("enter_email")}
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  isRequired
                  variant="bordered"
                  classNames={{
                    input: "text-sm",
                    inputWrapper: "h-12",
                  }}
                />

                <Input
                  label={t("password")}
                  placeholder={t("enter_password")}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  isRequired
                  variant="bordered"
                  endContent={
                    <button
                      className="focus:outline-none"
                      type="button"
                      onClick={toggleVisibility}
                    >
                      {isVisible ? (
                        <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                      ) : (
                        <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                      )}
                    </button>
                  }
                  type={isVisible ? "text" : "password"}
                />

                {!isLogin && (
                  <Input
                    label={t("confirm_password")}
                    placeholder={t("confirm_password")}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    isRequired
                    variant="bordered"
                    endContent={
                      <button
                        className="focus:outline-none"
                        type="button"
                        onClick={toggleConfirmVisibility}
                      >
                        {isConfirmVisible ? (
                          <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                        ) : (
                          <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                        )}
                      </button>
                    }
                    type={isConfirmVisible ? "text" : "password"}
                  />
                )}
              </>
            )}

            {/* Поле для ввода кода верификации (показывается только на втором шаге регистрации) */}
            {!isLogin && verificationStep === 'verification' && (
              <Input
                label="Код подтверждения"
                labelPlacement="outside"
                placeholder="Введите код из email"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                isRequired
                variant="bordered"
                maxLength={6}
              />
            )}

            {error && (
              <Chip color="danger" variant="flat" className="w-full justify-center">
                {error}
              </Chip>
            )}

            <Button
              type="submit"
              size="lg"
              isLoading={isLoading}
              className="w-full mt-2 bg-white text-black"
            >
              {isLogin 
                ? t("login") 
                : verificationStep === 'verification' 
                  ? "Подтвердить регистрацию" 
                  : "Отправить код"
              }
            </Button>

            {/* Кнопка повторной отправки кода */}
            {!isLogin && verificationStep === 'verification' && (
              <Button
                type="button"
                variant="light"
                size="sm"
                onClick={handleResendCode}
                isLoading={isLoading}
                className="w-full"
              >
                Отправить код повторно
              </Button>
            )}

            {/* Кнопка возврата к вводу данных */}
            {!isLogin && verificationStep === 'verification' && (
              <Button
                type="button"
                variant="light"
                size="sm"
                onClick={goBackToCredentials}
                className="w-full"
              >
                Изменить email
              </Button>
            )}
          </form>

          <Divider className="my-2" />

          <div className="text-center">
            <p className="text-sm text-default-500">
              {isLogin ? t("no_account") : t("already_have_account")}
              <Link
                as="button"
                className="ml-1 text-sm font-medium rounded-lg p-1 active:border-none"
                onClick={switchAuthMode}
                color="foreground"
              >
                {isLogin ? t("register") : t("login")}
              </Link>
            </p>
          </div>
        </CardBody>
      </Card>
    </PageWrapper>
  );
});

export default AuthPage;