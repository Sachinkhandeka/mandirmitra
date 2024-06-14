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
              <Route 
                path="/signin"
                element={
                  <Suspense fallback={
                    <div className="flex justify-center items-center min-h-screen gap-4" >
                      <Spinner size={"xl"} />
                      <div>Loading ...</div>
                    </div>
                  } ><SigninSuperAdmin /></Suspense>
                }
              />
              <Route 
                path="/signup"
                element={
                  <Suspense fallback={
                    <div className="flex justify-center items-center min-h-screen gap-4" >
                      <Spinner size={"xl"} />
                      <div>Loading ...</div>
                    </div>
                  } ><SignupSuperAdmin /></Suspense>
                }
              />
               <Route 
                path="/superadmin"
                element={
                  <Suspense fallback={
                    <div className="flex justify-center items-center min-h-screen gap-4" >
                      <Spinner size={"xl"} />
                      <div>Loading ...</div>
                    </div>
                  } ><CreateSuperAdmin /></Suspense>
                }
              />
              <Route 
                path="/user-signin"
                element={
                  <Suspense fallback={
                    <div className="flex justify-center items-center min-h-screen gap-4" >
                      <Spinner size={"xl"} />
                      <div>Loading ...</div>
                    </div>
                  } ><SigninUser /></Suspense>
                }
              />
          </Routes>
      </BrowserRouter>
    </>
  )
}