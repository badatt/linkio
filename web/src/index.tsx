import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

const App = () => {
  return (
    <StrictMode>
      <h1>Building a fullstack TypeScript project</h1>
      <h2>Workspaces</h2>
    </StrictMode>
  );
};

const app = document.querySelector("#app");
if (app) createRoot(app).render(<App />);
