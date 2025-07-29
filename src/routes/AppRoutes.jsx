import React from 'react';
import { BrowserRouter,Routes, Route } from 'react-router-dom';
import ProtectedRoute from '../component/ProtectedRoute';
import Layout from '../component/Layout/Layout';

import Login from '../pages/Login/Login';
import DashboardAdmin from '../pages/DashboardAdmin/DashboardAdmin';
import Investments from '../pages/Investments/Investments';
import EditCar from '../pages/EditCar/EditCar';
import Reports from '../pages/Reports/Reports';
import ViewCars from '../pages/ViewCars/ViewCars';

import DashboardExecutive from '../pages/DashboardExecutive/DashboardExecutive';
import AddCar from '../pages/AddCar/AddCar';
import CarDetails from '../pages/CarDetails/CarDetails';
import KYCUploadBuyers from '../pages/KYCUploadBuyer/KYCUploadBuyer';
import KYCUploadSeller from '../pages/KYCUploadSeller/KYCUploadSeller';

function AppRoutes() {
  return (

    // <BrowserRouter>
    <Routes>
      {/* Public Route */}
      <Route path="/" element={<Login />} />

      {/* Admin Routes */}
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <Layout>
              <DashboardAdmin />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/add-car"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <Layout>
              <AddCar />
            </Layout>
          </ProtectedRoute>
        }
      />
        <Route
        path="/admin/view-cars"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <Layout>
              <ViewCars />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/investments"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <Layout>
              <Investments />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/edit-car/:id"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <Layout>
              <EditCar />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/reports"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <Layout>
              <Reports />
            </Layout>
          </ProtectedRoute>
        }
      />



      {/* Executive Routes */}
      <Route
        path="/executive/dashboard"
        element={
          <ProtectedRoute allowedRoles={['executive']}>
            <Layout>
              <DashboardExecutive />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/executive/add-car"
        element={
          <ProtectedRoute allowedRoles={['executive']}>
            <Layout>
              <AddCar />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/executive/car/:id"
        element={
          <ProtectedRoute allowedRoles={['executive']}>
            <Layout>
              <CarDetails />
            </Layout>
          </ProtectedRoute>
        }
      />
        <Route
        path="/executive/view-cars"
        element={
          <ProtectedRoute allowedRoles={['executive']}>
            <Layout>
              <ViewCars />
            </Layout>
          </ProtectedRoute>
        }
      />admin/view-cars

      <Route
        path="/executive/kyc-upload"
        element={
          <ProtectedRoute allowedRoles={['executive']}>
            <Layout>
              <KYCUploadBuyers />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/executive/kyc-seller"
        element={
          <ProtectedRoute allowedRoles={['executive']}>
            <Layout>
              <KYCUploadSeller />
            </Layout>
          </ProtectedRoute>
        }
      />
    </Routes>

    // </BrowserRouter>
    
  );
}

export default AppRoutes;

