// src\page\Admin.tsx
import { Trans } from "react-i18next";

import { Games } from "@component/Games";
import { JoinGame } from "@component/JoinGame";
import { FormGame } from "@component/FormGame";

export const Admin = () => {
  return (
      <main>
        <header>
          <Trans>admin.title</Trans>
        </header>
        <div>
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
      </main>
  );
};
