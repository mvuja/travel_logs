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
                <div className="container mx-auto px-4">
                    <NavigationMenu>
                        <NavigationMenuList>
                            <NavigationMenuItem>
                                <NavLink to="/" end>
                                    Travel Logs
                                </NavLink>
                            </NavigationMenuItem>
                            <NavigationMenuItem>
                                <NavLink to="/create" end>
                                    Create
                                </NavLink>
                            </NavigationMenuItem>
                        </NavigationMenuList>
                    </NavigationMenu>
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
