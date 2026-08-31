import { createBrowserRouter } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";
import AuthLayout from "../layouts/AuthLayout";

import RegisterPage from "../pages/auth/RegisterPage";
import LoginPage from "../pages/auth/LoginPage";

import DashboardPage from "../pages/dashboard/DashboardPage";

import LeadsPage from "../pages/leads/LeadsPage";
import LeadDetailsPage from "../pages/leads/LeadDetailsPage";

import AdminDashboardPage from "../pages/admin/AdminDashboardPage";
import UsersPage from "../pages/admin/UsersPage";
import ProtectedRoute from "./ProtectedRoute";

export const router = createBrowserRouter([
    {
        element: <AuthLayout />,
        children: [
            {
                path: "/login",
                element: <LoginPage />
            },
            {
                path: "/register",
                element: <RegisterPage />
            }
        ]
    },
    {
        element: <ProtectedRoute />,
        children: [{
            element: <MainLayout />,
            children: [
                {
                    path: "/",
                    element: <DashboardPage />
                },
                {
                    path: "/leads",
                    element: <LeadsPage />
                },
                {
                    path: "/leads/:id",
                    element: <LeadDetailsPage />
                },
                {
                    path: "/admin",
                    element: <AdminDashboardPage />
                },
                {
                    path: "/admin/users",
                    element: <UsersPage />
                }
            ]
        }]
    }
])