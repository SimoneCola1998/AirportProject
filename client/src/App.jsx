import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Header } from "./components/Header";
import { Homepage } from "./components/Homepage";
import UserContext from "./components/UserContext";
import "bootstrap/dist/css/bootstrap.min.css";
import { useState } from "react";
import { LoginForm } from "./components/Login";
import { checkLogin, doLogout } from "./API";
import { PlanePage } from "./components/PlanePage";
import { PageNotFound } from "./components/PageNotFound";
import toast, { Toaster } from "react-hot-toast";

function App() {
  const [user, setUser] = useState({});

  const validateLogin = async (username, password) => {
    const user = await checkLogin(username, password);
    setUser(user);
  };

  const handleLogout = async () => {
    await doLogout()
      .then(() => {
        setUser({});
        toast.success("Logged out");
      })
      .catch((err) => {
        toast.error(err.message);
      });
  };
  return (
    <UserContext.Provider value={{ user }}>
      <Toaster position="top-center" reverseOrder={false} />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Header handleLogout={handleLogout} />}>
            <Route path="" element={<Homepage />} />
            <Route path="/seats/:id" element={<PlanePage />} />
          </Route>
          <Route
            path="/login"
            element={<LoginForm validateLogin={validateLogin} />}
          />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </BrowserRouter>
    </UserContext.Provider>
  );
}

export default App;
