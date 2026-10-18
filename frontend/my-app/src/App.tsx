import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ChatPage from "./pages/ChatPage";
import HomePage from "./pages/HomePage";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";
import { SocketProvider } from "./context/SocketContext";

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <SocketProvider>
          <Layout>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route
                path="/chat"
                element={
                  <ProtectedRoute>
                    <ChatPage />
                  </ProtectedRoute>
                }
              ></Route>
            </Routes>
          </Layout>
        </SocketProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
