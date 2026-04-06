import { Route, Routes } from "react-router-dom";
import Signup from "./Pages/Signup";
import Login from "./Pages/Login";
import Dashboard from "./Pages/Dashboard";
import Settings from "./Pages/Settings";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />}></Route>
      <Route path="/signup" element={<Signup />}></Route>
      <Route path="/login" element={<Login />}></Route>
      <Route path="/dashboard" element={<Dashboard />}></Route>
      <Route path="/settings" element={<Settings />}></Route>
    </Routes>
  );
}

export default App;