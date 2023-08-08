import { Navigate, useRoutes } from "react-router-dom";
import { useSelector } from "react-redux";
// layouts
import DashboardLayout from "./layouts/dashboard";
import LogoOnlyLayout from "./layouts/LogoOnlyLayout";
// Pages
import Login from "./pages/Login";
import NotFound from "./pages/Page404";
import Title from "./pages/Hero";
import Products from "./pages/Products";
import Section from "./pages/Section";
import AboutUs from "./pages/AboutUs";
import TermsAndConditions from "./pages/TermsAndConditions";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import FAQ from "./pages/FAQ";
import Inquiries from "./pages/Inquires";
import SocialMedia from "./pages/SocialMedia";
import SEO from "./pages/SEO";
import Links from "./pages/Links";

const publicRoutes = [
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/",
    element: <LogoOnlyLayout />,
    children: [
      { path: "/", element: <Navigate to="/login" /> },
      { path: "404", element: <NotFound /> },
      { path: "*", element: <Navigate to="/404" /> },
    ],
  },
];

const protectedRoutes = [
  {
    path: "/",
    element: <DashboardLayout />,
    children: [
      { path: "/", element: <Navigate to="/hero" /> },
      { path: "/hero", element: <Title /> },
      { path: "/products", element: <Products /> },
      { path: "/publishers", element: <Section type="Publishers" /> },
      { path: "/advertisers", element: <Section type="Advertisers" /> },
      { path: "/aboutUs", element: <AboutUs /> },
      { path: "/termsAndCondition", element: <TermsAndConditions /> },
      { path: "/privacyPolicy", element: <PrivacyPolicy /> },
      { path: "/faq", element: <FAQ /> },
      { path: "/inquiries", element: <Inquiries /> },
      { path: "/socialMedia", element: <SocialMedia /> },
      { path: "/seo", element: <SEO /> },
      { path: "/links", element: <Links /> },
    ],
  },
  { path: "/", element: <Navigate to="/dashboard" /> },
  { path: "404", element: <NotFound /> },
  { path: "*", element: <Navigate to="/404" /> },
];

export default function Router() {
  const { authToken } = useSelector((state) => state.reducer);
  if (authToken) return useRoutes(protectedRoutes);
  return useRoutes(publicRoutes);
}
