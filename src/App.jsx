import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ForgetPassPage from "./pages/ForgetPassPage";
import AboutUsPage from "./pages/AboutUsPage";
import BlogPage from "./pages/BlogPage";
import CoursePage from "./pages/CoursePage";
import AssessmentPage from "./pages/AssessmentPage";
import QuizPage from "./pages/QuizPage";
import BookingPage from "./pages/BookingPage";

import { ROUTES } from "./routers/routes";
import "./App.css";

const AppLayout = () => {
  const location = useLocation();
  const hideNavbarAndFooter = [
    ROUTES.LOGIN,
    ROUTES.SIGNUP,
    ROUTES.FORGET,
  ].includes(location.pathname);

  return (
    <div
      style={{ display: "flex", flexDirection: "column", minHeight: "100%" }}
    >
      {!hideNavbarAndFooter && <Navbar />}
      <ToastContainer position="top-right" autoClose={2000} />

      <div style={{ flex: 1 }}>
        <Routes>
          <Route path={ROUTES.HOME} element={<HomePage />} />
          <Route path={ROUTES.LOGIN} element={<LoginPage />} />
          <Route path={ROUTES.SIGNUP} element={<RegisterPage />} />
          <Route path={ROUTES.FORGET} element={<ForgetPassPage />} />
          <Route path={ROUTES.ABOUT_US} element={<AboutUsPage />} />
          <Route path={ROUTES.BLOG} element={<BlogPage />} />
          <Route path={ROUTES.COURSE} element={<CoursePage />} />
          <Route path={ROUTES.ASSESSMENT} element={<AssessmentPage />} />
          <Route path={ROUTES.QUIZ} element={<QuizPage />} />
          <Route path={ROUTES.BOOKING} element={<BookingPage />} />
        </Routes>
      </div>

      {!hideNavbarAndFooter && <Footer />}
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  );
}

export default App;
