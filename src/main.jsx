import { StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import { AuthProvider, DataProvider, useData } from "./providers";
import PageLoader from "./components/PageLoader.jsx";

function AppShell() {
  const { loading } = useData();
  if (loading) return <PageLoader />;
  return <App />;
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <DataProvider>
          <Suspense fallback={<PageLoader />}>
            <AppShell />
          </Suspense>
        </DataProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
);
