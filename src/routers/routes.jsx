import { Routes, Route } from "react-router-dom";
import {
  Categorias,
  Configuraciones,
  Home,
  Login,
  Productos,
  ProtectedRoute,
  POS,
  Layout,
} from "../index";

export function MyRoutes() {
 

  return (
    <Routes>
      <Route
        path="/login"
        element={
          <ProtectedRoute accessBy="non-authenticated">
            <Login />
          </ProtectedRoute>
        }
      />

      <Route
        path="/"
        element={
          <ProtectedRoute accessBy="authenticated">
            <Layout>
              <Home />
            </Layout>
          </ProtectedRoute>
        }
      />
       <Route
        path="/configuracion"
        element={
          <ProtectedRoute accessBy="authenticated">
            <Layout>
              <Configuraciones />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/configuracion/categorias"
        element={
          <ProtectedRoute accessBy="authenticated">
            <Layout>
              <Categorias />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/configuracion/productos"
        element={
          <ProtectedRoute accessBy="authenticated">
            <Layout>
              <Productos />
            </Layout>
          </ProtectedRoute>
        }
      />
       <Route
        path="/pos"
        element={
          <ProtectedRoute accessBy="authenticated">
            <Layout>
              <POS />
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* <Route path="/" element={<Home />} />
        <Route path="/configuracion" element={<Configuraciones />} />
        <Route path="/configuracion/categorias" element={<Categorias />} />
        <Route path="/configuracion/productos" element={<Productos />} />
        <Route path="/pos" element={<POS />} /> */}
    </Routes>
  );
}
