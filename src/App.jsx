import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Feed from "./pages/Feed";
import Login from "./pages/Login";
import About from "./pages/About";
import FAQ from "./pages/FAQ";
import ManualDetail from "./pages/ManualDetail";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import AppLayout from "./layouts/AppLayout";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <BrowserRouter basename="/QuickHelp/">
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Feed />} />
          <Route path="feed" element={<Feed />} />
          <Route path="manual/:id" element={<ManualDetail />} />
          <Route path="about" element={<About />} />
          <Route path="faq" element={<FAQ />} />
          <Route path="login" element={<Login />} />
          <Route path="profile" element={<Profile />} />
          <Route path="settings" element={<Settings />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
