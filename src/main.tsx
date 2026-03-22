import { createRoot } from "react-dom/client";
import { App } from "./App.tsx";
import "./index.css";

import { BrowserRouter } from "react-router";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./config/client.config.ts";
import { Toaster } from "sonner";

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <Toaster />
      <App />
    </BrowserRouter>
  </QueryClientProvider>,
);
