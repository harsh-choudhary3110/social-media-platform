import { useUserContext } from "@/context/AuthContext";
import { Navigate, Outlet } from "react-router-dom";

const AuthLayout = () => {
  const { isAuthenticated } = useUserContext();

  if (isAuthenticated) {
    return <Navigate to="/" />;
  }

  return (
    <>
      <div className="flex flex-1 items-center justify-center flex-col py-10">
        <Outlet />
      </div>
      <img
        src="/assets/images/side-img.svg"
        alt="logo"
        className="hidden xl:block w-1/2 object-cover bg-no-repeat"
      />
    </>
  );
};

export default AuthLayout;
