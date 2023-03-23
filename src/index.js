import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Login from './pages/pages/auth/Login';
import Signup from './pages/pages/auth/Signup';
import ForgotPassword from './pages/pages/ForgotPassword';
import Home from './pages/pages/Home';
import VerifyEmail from './pages/pages/auth/VerifyEmail';
import Profile from './pages/pages/Profile';
import Temp from './pages/pages/Temp';
import AboutUs from './pages/pages/AboutUs';
import Pricing from './pages/pages/Pricing';
import ContactUs from './pages/pages/ContactUs';
// import Ads from './pages/components/Ads';
import Email from './pages/components/Email';
import ProductInformation from './pages/components/ProductInformation';
import Social from './pages/components/Social';
import Web from './pages/components/Web';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App/>
  },
  {
    path: "login",
    element: <Login/>
  },
  {
    path: "Signup",
    element: <Signup/>
  },
  {
    path: "forgotpassword",
    element: <ForgotPassword/>
  },
  {
    path: "home",
    element: <Home/>
  },
  {
    path: "VerifyEmail",
    element: <VerifyEmail/>
  },
  {
    path: "Profile",
    element: <Profile/>
  },
  {
    path: "Temp",
    element: <Temp/>
  },
  {
    path: "Aboutus",
    element: <AboutUs/>
  },
  {
    path: "Pricing",
    element: <Pricing/>
  },
  {
    path: "Contactus",
    element: <ContactUs/>
  },
  {
    path: "ProductInformation/:projectId",
    element: <ProductInformation/>
  },
  // {
  //   path: "Ads/",
  //   element: <Ads/>
  // },
  {
    path: "Email/",
    element: <Email/>
  },
  {
    path: "Social/:projectId",
    element: <Social/>
  },
  {
    path: "Web/:projectId",
    element: <Web/>
  },
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // <React.StrictMode>
    <RouterProvider router={router} />
  // </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
