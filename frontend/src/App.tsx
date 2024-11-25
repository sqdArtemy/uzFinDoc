import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AuthInitial from './components/AuthInitial/AuthInitial';
import { LoaderProvider } from './components/Loader/Loader';
import AuthLayout from './components/AuthLayout/AuthLayout';
import SignIn from './components/SignIn/SignIn';
import SignUp from './components/SignUp/SignUp';
import SignUpPwd from './components/SignUpPwd/SignUpPwd';
import Profile from './components/Profile/Profile';
import MainLayout from './components/MainLayout/MainLayout.tsx';
import Translate from './components/Translate/Translate.tsx';
import Organization from './components/Organization/Organization.tsx';
import History from './components/History/History.tsx';
import HistoryPreview from './components/HistoryPreview/HistoryPreview.tsx';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import { ErrorModalProvider } from './components/Error/Error.tsx';
import { ThemeProvider, createTheme } from '@mui/material/styles';

const THEME = createTheme({
    typography: {
        fontFamily: 'Segoe UI, sans-serif',
    },
});

function App() {
    return (
        <ThemeProvider theme={THEME}>
            <ErrorModalProvider>
                <LoaderProvider>
                    <BrowserRouter>
                        <Routes>
                            <Route
                                path="/"
                                element={<Navigate to="/auth" replace />}
                            />
                            <Route path="/auth/*" element={<AuthLayout />}>
                                <Route
                                    index
                                    element={
                                        <Navigate to="/auth/sign-in" replace />
                                    }
                                />
                                <Route
                                    path="initial"
                                    element={<AuthInitial />}
                                />
                                <Route path="sign-in" element={<SignIn />} />
                                <Route path="sign-up/*">
                                    <Route
                                        index
                                        element={
                                            <Navigate
                                                to="/auth/sign-up/details"
                                                replace
                                            />
                                        }
                                    />
                                    <Route
                                        path="details"
                                        element={<SignUp />}
                                    />
                                    <Route path="pwd" element={<SignUpPwd />} />
                                </Route>
                            </Route>
                            <Route path="/main/*" element={<MainLayout />}>
                                <Route
                                    index
                                    element={
                                        <Navigate
                                            to="/main/translate"
                                            replace
                                        />
                                    }
                                />
                                <Route path="profile" element={<Profile />} />
                                <Route
                                    path="translate"
                                    element={<Translate />}
                                />
                                <Route
                                    path="organization"
                                    element={<Organization />}
                                />
                                <Route path="history" element={<History />} />
                                <Route
                                    path="history/preview/:id"
                                    element={<HistoryPreview />}
                                />
                            </Route>
                        </Routes>
                    </BrowserRouter>
                </LoaderProvider>
            </ErrorModalProvider>
        </ThemeProvider>
    );
}

export default App;
