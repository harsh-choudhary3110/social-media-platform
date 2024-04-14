import { useUserContext } from "@/context/AuthContext";
import Topbar from "@/components/shared/Topbar";
import LeftSidebar from "@/components/shared/LeftSidebar";
import { Navigate, Outlet } from "react-router-dom";
import Bottombar from "@/components/shared/Bottombar";

const RootLayout = () => {
  const { isAuthenticated } = useUserContext();

  if (!isAuthenticated) {
    return <Navigate to="/sign-in" />;
  }

  return (
    <div className="w-full md:flex">
      <Topbar />
      <LeftSidebar />
      <section className="flex flex-1 h-full">
        <Outlet />
      </section>
      <Bottombar />
    </div>
  );
};

export default RootLayout;
