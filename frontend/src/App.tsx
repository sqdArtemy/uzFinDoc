import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AuthInitial from "./components/AuthInitial/AuthInitial";
import { LoaderProvider } from "./components/Loader/Loader";
import AuthLayout from "./components/AuthLayout/AuthLayout";
import SignIn from "./components/SignIn/SignIn";
import SignUp from "./components/SignUp/SignUp";
import SignUpPwd from "./components/SignUpPwd/SignUpPwd";

function App() {
  return (
    <LoaderProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/auth" replace />} />
          <Route path="/auth/*" element={<AuthLayout />}>
            <Route index element={<Navigate to="/auth/initial" replace />} />
            <Route path="initial" element={<AuthInitial />} />
            <Route path="sign-in" element={<SignIn />} />
            <Route path="sign-up/*">
              <Route
                index
                element={<Navigate to="/auth/sign-up/details" replace />}
              />
              <Route path="details" element={<SignUp />} />
              <Route path="pwd" element={<SignUpPwd />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </LoaderProvider>
  );
}

export default App;
