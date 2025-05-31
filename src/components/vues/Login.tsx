// src/components/vues/Login.tsx
import { Trans } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useState, useCallback, useMemo, useEffect } from "react";
import {
  Login as LoginIcon,
  Cancel,
  Done,
  Visibility,
  VisibilityOff,
  Info as InfoIcon
} from "@mui/icons-material";
import {
  Box,
  Button,
  Grid2 as Grid,
  Typography,
  Alert,
  useTheme
} from "@mui/material";
import { Input } from "@happykiller/sunny-ui";
import { useLazyQuery } from "@apollo/client";
import LockIcon from '@mui/icons-material/Lock';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

import { GQL } from "@src/common/gql";
import { contextStore } from "@stores/ContextStore";

export const Login = () => {
  const theme = useTheme();
  const context = contextStore();
  const navigate = useNavigate();
  const reset = contextStore((s) => s.reset);
  const logoSrc = theme.palette.mode === 'dark' ? '/logo_dark.png' : '/logo_light.png';

  const [login, setLogin] = useState({ value: "", valid: false });
  const [secret, setSecret] = useState({ value: "", valid: false });

  const [executeQuery, { loading, error }] = useLazyQuery(GQL.QRY_AUTH, {
    errorPolicy: "all",
    onCompleted: (data) => {
      contextStore.setState({
        code: data.auth.code,
        id: data.auth.id,
        access_token: data.auth.access_token,
      });
    },
  });

  const handleSubmitCode = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      executeQuery({
        variables: {
          login: login.value,
          secret: secret.value,
        },
      });
    },
    [executeQuery, login, secret]
  );

  const handleSubmitEnter = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    navigate("/");
  }, [navigate]);

  const errorMessage = useMemo(() => {
    return error ? (
      <Alert severity="error" sx={{ mt: 2 }}>
        {error.message}
      </Alert>
    ) : null;
  }, [error]);

  const connected = !!context.code;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter" && connected) {
        e.preventDefault();
        navigate("/");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [connected, navigate]);

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      sx={{ px: 2 }}
    >
      <Box sx={{
        borderRadius: { xs: 0, sm: `${theme.shape.borderRadius}px` },
        boxShadow: { xs: 'none', sm: `0 0 32px 0 ${theme.palette.primary.main}55` },
        border: { xs: 'none', sm: `2px solid ${theme.palette.primary.main}` },
        maxWidth: 400,
        width: '100%',
        background: {
          xs: 0,
          sm: theme.palette.background.default,
        },
        p: 3,
      }}>
        <Box display="flex" justifyContent="center" mb={3}>
          <Box
            sx={{
              width: 80,
              height: 80,
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <img
              src={logoSrc}
              alt="Logo"
              style={{
                maxWidth: '100%',
                maxHeight: '100%',
                objectFit: 'contain',
                display: 'block',
              }}
            />
          </Box>
        </Box>

        <Typography
          variant="h5"
          component="h1"
          fontWeight={700}
          gutterBottom
          sx={{
            fontFamily: "Montserrat",
            textAlign: "center",
            color: theme.palette.text.primary,
          }}
        >
          <Trans>home.title</Trans>
        </Typography>

        <form onSubmit={connected ? handleSubmitEnter : handleSubmitCode}>
          <Grid container spacing={2}>
            {!connected && (
              <>
                <Grid size={12}>
                  <Input
                    startIcon={<AccountCircleIcon />}
                    label={<Trans>formLogin.login.label</Trans>}
                    tooltip="Adresse email ou code"
                    entity={login}
                    onChange={setLogin}
                    regex=".{3,}"
                    require
                    virgin
                  />
                </Grid>

                <Grid size={12}>
                  <Input
                    startIcon={<LockIcon />}
                    type="password"
                    label={<Trans>formLogin.secret.label</Trans>}
                    tooltip="Mot de passe ou secret partagé"
                    entity={secret}
                    onChange={setSecret}
                    regex=".{4,}"
                    require
                    virgin
                    icons={{
                      visibility: <Visibility fontSize="small" />,
                      visibilityOff: <VisibilityOff fontSize="small" />,
                      help: <InfoIcon fontSize="small" />,
                    }}
                  />
                </Grid>
                <Grid size={12} textAlign="center">
                  <Button
                    type="submit"
                    variant="contained"
                    startIcon={<Done />}
                    size="small"
                    disabled={
                      loading || (!login.valid || !secret.valid)
                    }
                  >
                    <Trans>common.done</Trans>
                  </Button>
                </Grid>
              </>
            )}

            {connected && (<>
              <Grid size={12} textAlign="center">
                <Typography variant="h6" color="text.secondary">
                  <Trans>formLogin.name</Trans>{context.code}
                </Typography>
              </Grid>
              <Grid size={6} textAlign="center">
                <Button
                  type="button"
                  variant="outlined"
                  startIcon={<Cancel />}
                  size="small"
                  onClick={
                    (e) => { e.preventDefault(); reset(); }
                  }
                >
                  <Trans>common.cancel</Trans>
                </Button>
              </Grid>
              <Grid size={6} textAlign="center">
                <Button
                  type="submit"
                  variant="contained"
                  startIcon={<LoginIcon />}
                  size="small"
                >
                  <Trans>home.enter</Trans>
                </Button>
              </Grid>
            </>
            )}
          </Grid>

          {errorMessage}
        </form>
      </Box>
    </Box>
  );
};
