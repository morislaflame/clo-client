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
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [isConfirmVisible, setIsConfirmVisible] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const toggleVisibility = () => setIsVisible(!isVisible);
  const toggleConfirmVisibility = () => setIsConfirmVisible(!isConfirmVisible);

  useEffect(() => {
    if (user.isAuth) {
      navigate(MAIN_ROUTE, { replace: true });
    }
  }, [user.isAuth, navigate]);

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
      } else {
        result = await user.register(email, password);
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

  const switchAuthMode = () => {
    setError("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    navigate(isLogin ? REGISTRATION_ROUTE : LOGIN_ROUTE);
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
              {isLogin ? t("login") : t("register")}
            </h1>
            <p className="text-default-500 text-sm mt-1">
              {isLogin 
                ? t("enter_data") 
                : t("create_account")
              }
            </p>
          </div>
        </CardHeader>

        <CardBody className="gap-3">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
              classNames={{
                input: "text-sm",
                inputWrapper: "h-12",
              }}
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
                classNames={{
                  input: "text-sm",
                  inputWrapper: "h-12",
                }}
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
              {isLogin ? t("login") : t("register")}
            </Button>
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
