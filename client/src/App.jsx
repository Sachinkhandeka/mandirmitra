import React, { Suspense } from "react";
import { Spinner } from  "flowbite-react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

const Dashboard = React.lazy(()=> import("./pages/Dashboard"));
const Signin = React.lazy(()=> import("./pages/Signin"));
const Signup =  React.lazy(()=> import("./pages/Signup"));
const CreateSuperAdmin = React.lazy(()=> import("./pages/CreateSuperAdmin"));

export default function App() {
  return (
    <>
      <BrowserRouter>
          <Routes>
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
              <Route 
                path="/signin"
                element={
                  <Suspense fallback={
                    <div className="flex justify-center items-center min-h-screen gap-4" >
                      <Spinner size={"xl"} />
                      <div>Loading ...</div>
                    </div>
                  } ><Signin /></Suspense>
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
                  } ><Signup /></Suspense>
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
          </Routes>
      </BrowserRouter>
    </>
  )
}