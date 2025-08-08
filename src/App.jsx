import { Routes, Route, Navigate } from "react-router-dom";
import { LandingPage } from "./pages/Landing.jsx";
import { HomePage } from "./pages/Home.jsx";
import { RequireAuth } from "./routes/RequireAuth.jsx";
import { PostsListPage } from "./pages/PostsList.jsx";
import { PostViewPage } from "./pages/PostView.jsx";
import { PostFormPage } from "./pages/PostForm.jsx";

export const App = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route
        path="/app"
        element={
          <RequireAuth>
            <HomePage />
          </RequireAuth>
        }
      />
      <Route
        path="/app/posts"
        element={
          <RequireAuth>
            <PostsListPage />
          </RequireAuth>
        }
      />
      <Route
        path="/app/post/:slugOrId"
        element={
          <RequireAuth>
            <PostViewPage />
          </RequireAuth>
        }
      />
      <Route
        path="/app/new"
        element={
          <RequireAuth>
            <PostFormPage mode="create" />
          </RequireAuth>
        }
      />
      <Route
        path="/app/edit/:id"
        element={
          <RequireAuth>
            <PostFormPage mode="edit" />
          </RequireAuth>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;
