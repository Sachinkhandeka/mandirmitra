import React, { Suspense } from "react";
import { Spinner } from  "flowbite-react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute";
import { Helmet } from "react-helmet-async";

const Dashboard = React.lazy(()=> import("./pages/Dashboard"));
const SigninSuperAdmin = React.lazy(()=> import("./pages/SigninSuperAdmin"));
const SignupSuperAdmin =  React.lazy(()=> import("./pages/SignupSuperAdmin"));
const CreateSuperAdmin = React.lazy(()=> import("./pages/CreateSuperAdmin"));
const SigninUser = React.lazy(()=> import("./pages/SigninUser"));
const PhoneOtpForm = React.lazy(()=> import("./pages/PhoneOtpForm"));

export default function App() {
  return (
    <>
      <Helmet>
          <title>MandirMitra: Streamline Temple Management</title>
          <meta name="description" content="MandirMitra - The all-in-one temple management solution. Simplify donations, expenses, events, and gain data-driven insights. Empower your temple and connect with your devotees." />
          <meta name="keywords" content="temple management software, temple donation management, temple event management, online donation platform for temples, mandir mitra, mandir management app, temple accounting software" />
          <meta name="author" content="MandirMitra Team" />

          <meta property="og:title" content="MandirMitra: Streamline Temple Management" />
          <meta property="og:description" content="MandirMitra - The all-in-one temple management solution. Simplify donations, expenses, events, and gain data-driven insights. Empower your temple and connect with your devotees." />
          <meta property="og:url" content="https://www.mandirmitra.co.in/" />
      </Helmet>
      <BrowserRouter>
          <Routes>
            <Route 
                path="/login"
                element={
                  <Suspense fallback={
                    <div className="flex justify-center items-center min-h-screen gap-4" >
                      <Spinner size={"xl"} />
                      <div>Loading ...</div>
                    </div>
                  } ><PhoneOtpForm /></Suspense>
                }
            />
            <Route 
                element={
                  <Suspense fallback={
                    <div className="flex justify-center items-center min-h-screen gap-4" >
                      <Spinner size={"xl"} />
                      <div>Loading ...</div>
                    </div>
                  } ><PrivateRoute /></Suspense>
                }
            >
            <Route 
                path="/"
                element={
                  <Suspense fallback={
                    <div className="flex justify-center items-center min-h-screen gap-4" >
                      <Spinner size={"xl"} />
                      <div>Loading ...</div>
                    </div>
                  } ><Dashboard /></Suspense>
                }
            />
            </Route>
          </Routes>
      </BrowserRouter>
    </>
  )
}