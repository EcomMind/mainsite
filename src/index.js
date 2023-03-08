import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Login from './pages/pages/Login';
import Signup from './pages/pages/Signup';
import ForgotPassword from './pages/pages/ForgotPassword';
import Home from './pages/pages/Home';
import VerifyEmail from './pages/pages/VerifyEmail';

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
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
