import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ApolloProvider } from "@apollo/client";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import { apolloClient } from "./graphql/client";
import InterviewPrepPage from "./pages/InterviewPrepPage";
import "./index.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/interview-prep" replace />} />
        <Route path="/interview-prep" element={<InterviewPrepPage />} />
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
