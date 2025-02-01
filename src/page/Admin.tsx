// src\page\Admin.tsx
import { Trans } from "react-i18next";

import "@page/admin.scss";
import { Games } from "@component/Games";
import { Footer } from "@component/Footer";
import ResponsiveAppBar from "@component/Bar";
import { JoinGame } from "@component/JoinGame";
import { FormGame } from "@component/FormGame";

export const Admin = () => {
  return (
    <>
      <ResponsiveAppBar />
      <main className="containerAdmin">
        <header className="title">
          <Trans>admin.title</Trans>
        </header>
        <div className="games">
          <section aria-labelledby="new-game-title">
            <h2 id="new-game-title"><Trans>admin.newGame</Trans></h2>
            <FormGame />
          </section>
          <section aria-labelledby="join-game-title">
            <h2 id="join-game-title"><Trans>admin.joinGame</Trans></h2>
            <JoinGame />
          </section>
          <section aria-labelledby="your-games-title">
            <h2 id="your-games-title"><Trans>admin.yourGames</Trans></h2>
            <Games />
          </section>
        </div>
        <Footer />
      </main>
    </>
  );
};
