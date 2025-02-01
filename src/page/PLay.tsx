// src\page\PLay.tsx
import "@page/play.scss";
import "@component/common.scss";
import { Game } from "@component/Game";
import { Footer } from "@component/Footer";
import ResponsiveAppBar from "@component/Bar";

export const Play = () => {
  return (
    <>
      <ResponsiveAppBar />
      <main className="app">
        <section className="parent_container">
          <div className="container">
            <Game />
          </div>
        </section>
        <Footer />
      </main>
    </>
  );
};
