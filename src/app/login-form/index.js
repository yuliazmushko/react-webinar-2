import React, { useCallback, useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import useStore from "../../hooks/use-store";
import useSelector from "../../hooks/use-selector";
import useTranslate from "../../hooks/use-translate";
import Login from "../../components/login";
import Spinner from "../../components/spinner";
import Tools from "../../containers/tools";
import Layout from "../../components/layout";
import LayoutFlex from "../../components/layout-flex";
import LocaleSelect from "../../containers/locale-select";

function LoginForm() {
  const store = useStore();

  let navigate = useNavigate();

  const userStore = store.get("user");

  const { t } = useTranslate();

  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const select = useSelector((state) => ({
    article: state.article.data,
    waiting: state.article.waiting,
  }));

  function onHandleSubmit(login, password) {
    if (!login || !password) {
      return;
    }
    userStore
      .authorize(login, password)
      .then((data) => {
        if (data.error) {
          setError(data.error.message);
          return;
        }
        if (data.result.token) {
          navigate("/");
          return data;
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  const callbacks = {
    onHandleLoginChange: useCallback((e) => setLogin(e.target.value), []),
    onHandlePasswordChange: useCallback((e) => setPassword(e.target.value), []),
    onHandleSubmit: useCallback((login, password) => {
      onHandleSubmit(login, password);
    }, []),
  };

  return (
    <>
      {Object.keys(userStore.store.state.user.user).length === 0 ? (
        <Layout
          head={
            <LayoutFlex flex="between">
              <h1>{t("title")}</h1>
              <LocaleSelect />
            </LayoutFlex>
          }
        >
          <Tools />
          <Spinner active={select.waiting}>
            <Login
              onSubmit={callbacks.onHandleSubmit}
              login={login}
              password={password}
              error={error}
              onHandleLoginChange={callbacks.onHandleLoginChange}
              onHandlePasswordChange={callbacks.onHandlePasswordChange}
            />
          </Spinner>
        </Layout>
      ) : (
        <Navigate replace to="/" />
      )}
    </>
  );
}

export default React.memo(LoginForm);