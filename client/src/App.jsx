import React, { useEffect } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import AOS from "aos";
import "aos/dist/aos.css";
import SuspenseWrapper from "./components/SuspenseWrapper";

// Lazy-loaded components
const DevoteeProfile = React.lazy(() => import("./components/templeDetails/DevoteeProfile"));
const Devotees = React.lazy(() => import("./pages/Devotees"));
const TempleDetail = React.lazy(() => import("./components/templeDetails/TempleDetail"));
const TempleList = React.lazy(() => import("./components/templeDetails/TempleList"));
const Dashboard = React.lazy(() => import("./pages/Dashboard"));
const LandingPage = React.lazy(() => import("./components/landingpage/LandingPage"));
const PhoneOtpForm = React.lazy(() => import("./pages/PhoneOtpForm"));
const PrivateRoute = React.lazy(() => import("./components/PrivateRoute"));
const ForgotPassword = React.lazy(() => import("./pages/ForgotPassword"));
const ResetPassword = React.lazy(() => import("./pages/ResetPassword"));

export default function App() {
    useEffect(() => {
        AOS.init({
            duration: 1000, // Animation duration
            once: false, // Whether animation should happen only once
        });
    }, []);

    return (
        <>
            {/* Helmet for meta tags */}
            <Helmet>
                <title>MandirMitra: Explore India's Rich Temple History</title> 
                <meta
                    name="description"
                    content="Discover the fascinating history of India's temples on MandirMitra. Explore ancient temples, learn about their legends, and connect with the spiritual heritage of India. Find temples near you, read about their history and architecture, and plan your next pilgrimage."
                />
                <meta
                    name="keywords"
                    content="historical temples in india, ancient temples of india, indian temple architecture, temple history, legends of indian temples, explore indian temples, temple tourism, pilgrimage sites in india, hindu temples, buddhist temples, jain temples, south indian temples, north indian temples, temple architecture styles, historical places in india, cultural heritage of india, indian mythology, spirituality"
                />
                <meta name="author" content="MandirMitra Team" />
                <meta property="og:title" content="MandirMitra: Explore India's Rich Temple History" />
                <meta
                    property="og:description"
                    content="Discover the fascinating history of India's temples on MandirMitra. Explore ancient temples, learn about their legends, and connect with the spiritual heritage of India. Find temples near you, read about their history and architecture, and plan your next pilgrimage."
                />
                <meta property="og:url" content="https://www.mandirmitra.co.in/" />
            </Helmet>

            {/* Router setup */}
            <BrowserRouter>
                <Routes>
                    {/* Public Routes */}
                    <Route
                        path="/landingpage"
                        element={
                            <SuspenseWrapper>
                                <LandingPage />
                            </SuspenseWrapper>
                        }
                    />
                    <Route
                        path="/profile"
                        element={
                            <SuspenseWrapper>
                                <DevoteeProfile />
                            </SuspenseWrapper>
                        }
                    />
                    <Route
                        path="/"
                        element={
                            <SuspenseWrapper>
                                <TempleList />
                            </SuspenseWrapper>
                        }
                    />
                    <Route
                        path="/temple/:id/*"
                        element={
                            <SuspenseWrapper>
                                <TempleDetail />
                            </SuspenseWrapper>
                        }
                    />
                    <Route
                        path="/login"
                        element={
                            <SuspenseWrapper>
                                <PhoneOtpForm />
                            </SuspenseWrapper>
                        }
                    />
                    <Route
                        path="/devotees"
                        element={
                            <SuspenseWrapper>
                                <Devotees />
                            </SuspenseWrapper>
                        }
                    />
                    <Route
                        path="/forgot-password"
                        element={
                            <SuspenseWrapper>
                                <ForgotPassword />
                            </SuspenseWrapper>
                        }
                    />
                    <Route
                        path="/reset-password/:token"
                        element={
                            <SuspenseWrapper>
                                <ResetPassword />
                            </SuspenseWrapper>
                        }
                    />

                    {/* Private Routes */}
                    <Route
                        element={
                            <SuspenseWrapper>
                                <PrivateRoute />
                            </SuspenseWrapper>
                        }
                    >
                        <Route
                            path="/dashboard"
                            element={
                                <SuspenseWrapper>
                                    <Dashboard />
                                </SuspenseWrapper>
                            }
                        />
                    </Route>

                    {/* Fallback Route */}
                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
            </BrowserRouter>
        </>
    );
}
