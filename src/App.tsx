import AppRoutes from "./appRoutes";
import { Toaster } from "./components/ui/toaster";
import "./globals.css";
const App = () => {
  return (
    <main className="flex h-screen">
      <AppRoutes />
      <Toaster />
    </main>
  );
};

export default App;
