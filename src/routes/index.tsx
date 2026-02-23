import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "../pages/home/index.tsx";
import Login from "../pages/login/index.tsx";
import ServiceDetails from "../pages/ServiceDetails/index.tsx";
import PrivateRoute from "./privateRoute.tsx";
import Profile from "../pages/profile/index.tsx";
import ProfileEdit from "../pages/profile/edit/index.tsx";
import { AddService } from "../pages/addService/index.tsx";

export function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                    {/* Rotas Públicas */}
                    <Route path="login" element={<Login />} />

                    {/* Rotas Privadas (Protegidas) */}
                    <Route element={<PrivateRoute />}>
                    
                        <Route index element={<Home />} />

                        <Route path="serviceDetails/:id" element={<ServiceDetails />} />
                        <Route path="addService" element={<AddService />} />
                        <Route path="edit-service/:id" element={<AddService  />} />
                        <Route path="profile" element={<Profile />} />
                        <Route path="profile/edit" element={<ProfileEdit />} />
                        {/* Adicione outras rotas protegidas aqui */}
                    </Route>
            </Routes>
        </BrowserRouter>
    );
}