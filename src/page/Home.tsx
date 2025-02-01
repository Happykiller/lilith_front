// src\page\Home.tsx
import { useMemo } from "react";
import { Trans } from "react-i18next";
import { Link } from "react-router-dom";
import { Button } from "@mui/material";
import { Login } from "@mui/icons-material";

import "@page/home.scss";
import { Footer } from "@component/Footer";
import { FormLogin } from "@component/FormLogin";
import { contextStore } from "@component/ContextStore";

export const Home = () => {
  const context = contextStore();

  const entry = useMemo(() => {
    if (!context.id) return null;
    return (
      <div className="entry">
        <Button component={Link} to="/admin" variant="contained" size="small" startIcon={<Login />}>
          <Trans>home.enter</Trans>
        </Button>
      </div>
    );
  }, [context.id]);

  return (
    <main className="containerHome">
      <header className="title">
        <Trans>home.title</Trans>
      </header>
      <section className="form">
        <FormLogin />
        {entry}
      </section>
      <Footer />
    </main>
  );
};
