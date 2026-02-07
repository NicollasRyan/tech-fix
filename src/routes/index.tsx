import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "../pages/home/index.tsx";
import Login from "../pages/login/index.tsx";
import Layout from "../components/Layout/index.tsx";
import ServiceDetails from "../pages/ServiceDetails/index.tsx";
import PrivateRoute from "./privateRoute.tsx";

export function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Layout />}>
                    {/* Rotas Públicas */}
                    <Route path="login" element={<Login />} />

                    {/* Rotas Privadas (Protegidas) */}
                    <Route element={<PrivateRoute />}>
                        <Route index element={<Home />} />

                        <Route path="serviceDetails/:id" element={<ServiceDetails />} />
                        {/* Adicione outras rotas protegidas aqui */}
                    </Route>
                </Route>
            </Routes>
        </BrowserRouter>
    );
}