import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "../pages/home/index.tsx";
import Login from "../pages/login/index.tsx";
import Layout from "../components/Layout/index.tsx";

export function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    {/* <Route path="*" element={<NotFound />} /> */}
                </Route>
            </Routes>
        </BrowserRouter>
    );
}