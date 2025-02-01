// src\component\FormLogin.tsx
import { Trans } from "react-i18next";
import { useLazyQuery } from "@apollo/client";
import { useState, useCallback, useMemo } from "react";
import { Cancel, Done, Visibility, VisibilityOff } from "@mui/icons-material";
import { Box, Button, IconButton, InputAdornment, TextField, Alert } from "@mui/material";

import "@component/formLogin.scss";
import { GQL } from "@src/common/gql";
import { contextStore } from "@src/component/ContextStore";

export const FormLogin = () => {
  const context = contextStore();
  const reset = contextStore((state) => state.reset);

  const [currentLogin, setCurrentLogin] = useState("");
  const [passVisible, setPassVisible] = useState(false);
  const [currentSecret, setCurrentSecret] = useState("");

  const [executeQuery, { loading, error }] = useLazyQuery(GQL.QRY_AUTH, {
    errorPolicy: "all",
    onCompleted: (data) => {
      contextStore.setState({
        code: data.auth.code,
        id: data.auth.id,
        accessToken: data.auth.accessToken,
      });
    },
  });

  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      executeQuery({
        variables: { login: currentLogin, secret: currentSecret },
      });
    },
    [executeQuery, currentLogin, currentSecret]
  );

  const togglePasswordVisibility = useCallback(() => {
    setPassVisible((prev) => !prev);
  }, []);

  const errorMessage = useMemo(() => {
    return error ? <Alert severity="error">{error.message}</Alert> : null;
  }, [error]);

  if (!context.code) {
    return (
      <form className="containerFormLogin" onSubmit={handleSubmit}>
        <Box display="flex" alignItems="center" flexDirection="column" gap={2}>
          <TextField
            label={<Trans>formLogin.login.label</Trans>}
            variant="standard"
            size="small"
            fullWidth
            value={currentLogin}
            onChange={(e) => setCurrentLogin(e.target.value)}
          />

          <TextField
            label={<Trans>formLogin.secret.label</Trans>}
            variant="standard"
            size="small"
            fullWidth
            autoComplete="off"
            type={passVisible ? "text" : "password"}
            value={currentSecret}
            onChange={(e) => setCurrentSecret(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={togglePasswordVisibility} edge="end">
                    {passVisible ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Button
            type="submit"
            variant="contained"
            size="small"
            startIcon={<Done />}
            disabled={!(currentLogin.length > 2 && currentSecret.length > 3) || loading}
          >
            {loading ? <Trans>common.loading</Trans> : <Trans>common.done</Trans>}
          </Button>

          {errorMessage}
        </Box>
      </form>
    );
  } else {
    return (
      <form className="containerFormLogin" onSubmit={(e) => {
        e.preventDefault();
        reset();
      }}>
        <Box display="flex" alignItems="center" justifyContent="center">
          <Trans>formLogin.name</Trans> {context.code}
          <IconButton type="submit" size="small">
            <Cancel />
          </IconButton>
        </Box>
      </form>
    );
  }
};
