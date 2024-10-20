import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Add from './products/Add';
import CategoriesList from './category/CategoriesList';
import SystemAdjustment from './pages/SystemAdjustment';
import ProductList from './products/ProductList';
import CreateBarcode from './pages/CreateBarcode';
import ListPurchase from './purchases/ListPurchase';
import POS from './pos/POS';
import Dashboard from './pages/Dashboard';
import AddPurchase from './purchases/AddPurchase';
import ListSales from './sales/ListSales';
import AddSale from './sales/AddSale';
import Warehouses from './pages/Warehouses';
import Units from './pages/Units';
import Supplier from './pages/Supplier';
import Brand from './pages/Brand';
import Login from './pages/Login';

const isAuthenticated = true; // Change this based on your authentication logic

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Redirect unauthenticated users to /auth */}
      {!isAuthenticated ? (
        <>
          <Route path="*" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login/>} />
        </>
      ) : (
        <>
          {/* Redirect authenticated users away from /auth */}
          <Route path="/login" element={<Navigate to="/" />} />
          
          {/* Authenticated routes */}
          <Route path="/" element={<Dashboard />} />
          <Route path="products">
            <Route index element={<Navigate to="list_product" />} />
            <Route path="list_product" element={<ProductList />} />
            <Route path="add" element={<Add />} />
            <Route path="edit/:id" element={<h1>Edit Product</h1>} />
            <Route path="create-barcode" element={<CreateBarcode />} />
          </Route>

          <Route path="sales">
            <Route index element={<Navigate to="list_sales" />} />
            <Route path="list_sales" element={<ListSales />} />
            <Route path="add_sale" element={<AddSale />} />
          </Route>

          <Route path="purchases">
            <Route index element={<Navigate to="list_purchases" />} />
            <Route path="list_purchases" element={<ListPurchase />} />
            <Route path="add" element={<AddPurchase />} />
            <Route path="edit/:id" element={<h1>Edit Purchase</h1>} />
          </Route>

          <Route path="/pos" element={<POS />} />

          <Route path="settings">
            <Route index element={<Navigate to="system_adjustment" />} />
            <Route path="system_adjustment" element={<SystemAdjustment />} />
            <Route path="categories" element={<CategoriesList />} />
            <Route path="warehouses" element={<Warehouses/>}/>
            <Route path="units" element={<Units/>}/>
            <Route path="suppliers" element={<Supplier/>}/>
            <Route path='brands' element={<Brand/>}/>
          </Route>

          <Route path="/categories" element={<CategoriesList />} />

          {/* Fallback route for 404 */}
          <Route path="*" element={<h1 className="text-center text-[3rem] relative top-[50%] translate-y-[-50%] text-gray-500">Not Found</h1>} />
        </>
      )}
    </Routes>
  );
};

export default AppRoutes;
