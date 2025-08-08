import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import { AuthProvider } from "./state/AuthContext.jsx";
import { PostsProvider } from "./state/PostsContext.jsx";
import { ToastProvider } from "./components/ui/toast.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <PostsProvider>
          <ToastProvider>
            <App />
          </ToastProvider>
        </PostsProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
