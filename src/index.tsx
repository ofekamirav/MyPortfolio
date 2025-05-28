import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      {" "}
      {/* Enable React Router for navigation */}
      <App />
      {/* Footer */}
      <footer className="py-8 border-t border-border/50">
        <div className="container mx-auto px-6 text-center">
          <p className="text-muted-foreground text-gray-400">
            © 2025 Ofek Amirav. This portfolio create using React & Tailwind CSS
          </p>
        </div>
      </footer>
    </BrowserRouter>
  </React.StrictMode>
);
