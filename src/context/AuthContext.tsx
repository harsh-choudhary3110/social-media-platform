import { useToast } from "@/components/ui/use-toast";
import { useGetCurrentUser } from "@/lib/react-query/quires&mutation";
import { IAuthContextType, IUser } from "@/types";
import { createContext, useContext, useEffect, useState } from "react";

export const initialUser = {
  id: "",
  name: "",
  userName: "",
  email: "",
  imageUrl: "",
  bio: "",
};

const initialState = {
  user: initialUser,
  isAuthenticated: false,
  setUser: () => {},
  setIsAuthenticated: () => {},
  setAuthUser: async () => {},
};

const AuthContext = createContext<IAuthContextType>(initialState);

const AuthContextProvider = ({ children }: { children: React.ReactNode }) => {
  const { toast } = useToast();
  const [user, setUser] = useState<IUser>(initialUser);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { data: currentUser, isError: isUserDataError } =
    useGetCurrentUser(isAuthenticated);

  // auto logOut when session is expired by server
  useEffect(() => {
    if (!isUserDataError) return;

    setIsAuthenticated(false);
    setUser(initialUser);
    localStorage.removeItem("cookieFallback");
    toast({ title: "Your session has expired, please login again" });
  }, [isUserDataError]);

  const setAuthUser = async () => {
    if (!currentUser) return;

    setUser({
      id: currentUser.$id,
      name: currentUser.name,
      userName: currentUser.userName,
      email: currentUser.email,
      imageUrl: currentUser.imageUrl,
      bio: currentUser.bio,
    });
  };

  // check if user is already authenticated/logged in
  useEffect(() => {
    if (
      !(
        localStorage.getItem("cookieFallback") === null ||
        localStorage.getItem("cookieFallback") === "[]"
      )
    ) {
      setIsAuthenticated(true);
    }
  }, []);

  // set users data
  useEffect(() => {
    if (!isAuthenticated) return;
    setAuthUser();
  }, [isAuthenticated, currentUser]);

  const value = {
    user,
    isAuthenticated,
    setUser,
    setIsAuthenticated,
    setAuthUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContextProvider;

export const useUserContext = () => useContext(AuthContext);
