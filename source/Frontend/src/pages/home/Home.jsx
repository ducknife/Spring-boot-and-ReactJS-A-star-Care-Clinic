import { Outlet, useLocation } from "react-router-dom";
import HeroSection from "./HeroSection";
import AboutSection from "./AboutSection";
import ClinicServicesSection from "./ClinicServicesSection";

function Home() {

    const location = useLocation();
    const isRoot = location.pathname === "/";
    return (
        <div className="bg-[var(--surface)]">
            {isRoot ? <><HeroSection /> <AboutSection /> <ClinicServicesSection /></> : ""}

            <div className="">
                <Outlet />
            </div>
        </div>
    );
}

export default Home;
