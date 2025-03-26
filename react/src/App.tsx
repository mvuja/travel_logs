import { Toaster } from "@/components/ui/sonner";
import { Routes, Route, NavLink, useLocation } from "react-router";

import Home from "@/pages/Home";
import Create from "@/pages/Create";
import Modal from "@/components/Modal";

import { TravelLogsProvider } from "@/context/TravelLogsContext";

import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuList,
} from "@/components/ui/navigation-menu";

function App() {
    const location = useLocation();
    const background = location.state?.background;

    return (
        <TravelLogsProvider>
            <main className="bg-blue">
                <NavigationMenu className="fixed bg-blue w-full max-w-full justify-center py-4 shadow-xl">
                    <NavigationMenuList className="gap-5 container mx-auto px-4 w-full items-start justify-start">
                        <NavigationMenuItem className="nav-item">
                            <NavLink to="/" end>
                                Travel Logs
                            </NavLink>
                        </NavigationMenuItem>
                        <NavigationMenuItem className="nav-item">
                            <NavLink to="/create" end>
                                Create
                            </NavLink>
                        </NavigationMenuItem>
                    </NavigationMenuList>
                </NavigationMenu>
                <div className="container mx-auto px-4 pt-25 pb-15">
                    <Routes location={background || location}>
                        <Route index element={<Home />} />
                        <Route path="create" element={<Create />} />
                        <Route path="/travel-log/:id" element={<Modal />} />
                    </Routes>
                    {background && (
                        <Routes>
                            <Route path="/travel-log/:id" element={<Modal />} />
                        </Routes>
                    )}
                    {/* <Route element={<AuthLayout />}>
                    <Route path="login" element={<Login />} />
                    <Route path="register" element={<Register />} />
                </Route> */}
                </div>
                <Toaster />
            </main>
        </TravelLogsProvider>
    );
}

export default App;
