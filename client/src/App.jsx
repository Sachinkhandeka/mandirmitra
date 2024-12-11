import React, { Suspense, useEffect } from "react";
import { Spinner } from  "flowbite-react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute";
import { Helmet } from "react-helmet-async";
import AOS from 'aos';
import 'aos/dist/aos.css';

const DevoteeProfile = React.lazy(()=> import("./components/templeDetails/DevoteeProfile"));
const Devotees = React.lazy(()=> import("./pages/Devotees"));
const TempleDetail = React.lazy(()=> import("./components/templeDetails/TempleDetail"));
const TempleList = React.lazy(()=> import("./components/templeDetails/TempleList"))
const Dashboard = React.lazy(()=> import("./pages/Dashboard"));
const LandingPage = React.lazy(()=> import("./components/landingpage/LandingPage"));
const PhoneOtpForm = React.lazy(()=> import("./pages/PhoneOtpForm"));

export default function App() {

  useEffect(() => {
    AOS.init({
      duration: 1000, // Animation duration
      once: false, // Whether animation should happen only once
    });
  }, []);
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
              path="/landingpage"
              element={
                <Suspense fallback={
                  <div className="flex justify-center items-center min-h-screen gap-4" >
                    <Spinner size={"xl"} />
                    <div>Loading ...</div>
                  </div>
                }><LandingPage /></Suspense>
              }
            >
            </Route>
            <Route
              path="/profile"
              element={
                <Suspense fallback={
                  <div className="flex justify-center items-center min-h-screen gap-4" >
                    <Spinner size={"xl"} />
                    <div>Loading ...</div>
                  </div>
                }><DevoteeProfile /></Suspense>
              }
            >
            </Route>
            <Route
              path="/"
              element={
                <Suspense fallback={
                  <div className="flex justify-center items-center min-h-screen gap-4" >
                    <Spinner size={"xl"} />
                    <div>Loading ...</div>
                  </div>
                }><TempleList /></Suspense>
              }
            >
            </Route>
            <Route
              path="/temple/:id"
              element={
                <Suspense fallback={
                  <div className="flex justify-center items-center min-h-screen gap-4" >
                    <Spinner size={"xl"} />
                    <div>Loading ...</div>
                  </div>
                }><TempleDetail /></Suspense>
              }
            >
            </Route>
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
                path="/devotees"
                element={
                  <Suspense fallback={
                    <div className="flex justify-center items-center min-h-screen gap-4" >
                      <Spinner size={"xl"} />
                      <div>Loading ...</div>
                    </div>
                  } ><Devotees /></Suspense>
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
                  path="/dashboard"
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
            {/* Fallback Route */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
      </BrowserRouter>
    </>
  )
}