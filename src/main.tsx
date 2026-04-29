import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ApolloProvider } from "@apollo/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import { apolloClient } from "./graphql/client";
import InterviewPrepPage from "./pages/InterviewPrepPage";
import "./index.css";

/** Match Vite `base` (e.g. `/repo/`) for GitHub Pages; omit when running at domain root. */
function routerBasename(): string | undefined {
  const raw = import.meta.env.BASE_URL;
  if (raw === "/" || raw === "") return undefined;
  return raw.replace(/\/$/, "");
}

function App() {
  return (
    <BrowserRouter basename={routerBasename()}>
      <Routes>
        <Route path="/" element={<InterviewPrepPage />} />
      </Routes>
    </BrowserRouter>
  );
}

const rootEl = document.getElementById("root");
if (rootEl) {
  createRoot(rootEl).render(
    <StrictMode>
      <ApolloProvider client={apolloClient}>
        <App />
      </ApolloProvider>
    </StrictMode>,
  );
}
