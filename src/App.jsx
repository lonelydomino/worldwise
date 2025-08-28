import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";

import { CitiesProvider } from "./context/CitiesContext";
import { AuthProvider } from "./context/FakeAuthContext";

const Product = lazy() (() => import("./pages/Product"))
const Pricing = lazy() (() => import("./pages/Pricing"))
const Homepage = lazy() (() => import("./pages/Homepage"))
const PageNotFound = lazy() (() => import("./pages/PageNotFound"))
const AppLayout = lazy() (() => import("./pages/AppLayout"))
const Login = lazy() (() => import("./pages/Login"))

import SpinnerFullPage from './components/SpinnerFullPage'
import CityList from "./components/CityList";
import CountryList from "./components/CountryList";
import City from "./components/City";
import Form from "./components/Form";
import ProtectedRoute from './pages/ProtectedRoute'
function App() {
  return (
    <div>
      <AuthProvider>
        <CitiesProvider>
          <BrowserRouter>
          <Suspense fallback={<SpinnerFullPage />}>
            <Routes>
              <Route index element={<Homepage />} />
              <Route path="pricing" element={<Pricing />} />
              <Route path="product" element={<Product />} />
              <Route path="login" element={<Login />} />
              
              <Route path="app" element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
                {/* Nested Routes */}
                <Route index element={<Navigate replace to="cities" />} />
                {/* Index makes this the default, Navigate makes it so cities appear in the url bar */}
                <Route path="cities" element={<CityList />} />
                <Route path="cities/:id" element={<City />} />
                <Route path="countries" element={<CountryList />} />
                <Route path="form" element={<Form />} />
              </Route>

              <Route path="*" element={<PageNotFound />} />
              {/* Catches all other routes */}
            </Routes>

          </Suspense>
          </BrowserRouter>
        </CitiesProvider>
      </AuthProvider>
    </div>
  );
}

export default App;
