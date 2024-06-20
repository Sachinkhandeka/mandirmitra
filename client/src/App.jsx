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
        <title>MadirMitra - Temple Management</title>
        <meta name="description" content="MadirMitra helps in managing temple donations, expenses, events, and more efficiently." />
        <meta name="keywords" content="temple management, donations, events, MadirMitra" />
        <meta name="author" content="MadirMitra Team" />
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