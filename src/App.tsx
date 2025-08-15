import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/components/AuthProvider";
import { Layout } from "@/components/Layout";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Tools from "./pages/Tools";
import Content from "./pages/Content";
import Roadmap from "./pages/Roadmap";
import Automation from "./pages/Automation";
import Revenue from "./pages/Revenue";
import Profile from "./pages/Profile";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route path="/" element={
              <Layout>
                <Dashboard />
              </Layout>
            } />
            <Route path="/roadmap" element={
              <Layout>
                <Roadmap />
              </Layout>
            } />
            <Route path="/tools" element={
              <Layout>
                <Tools />
              </Layout>
            } />
            <Route path="/content" element={
              <Layout>
                <Content />
              </Layout>
            } />
            <Route path="/automation" element={
              <Layout>
                <Automation />
              </Layout>
            } />
            <Route path="/revenue" element={
              <Layout>
                <Revenue />
              </Layout>
            } />
            <Route path="/profile" element={
              <Layout>
                <Profile />
              </Layout>
            } />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
