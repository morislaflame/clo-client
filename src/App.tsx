import { useContext, useEffect, lazy, Suspense } from "react";
import { BrowserRouter } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { Context, type IStoreContext } from "./store/StoreProvider";
import LoadingIndicator from "./components/ui/LoadingIndicator";
import ErrorPage from "@/pages/ErrorPage";
import Navigation from "./components/Navigation";
import Footer from "./components/Footer";

const AppRouter = lazy(() => import("@/router/AppRouter"));

const App = observer(() => {
  const { user } = useContext(Context) as IStoreContext;

  useEffect(() => {
    const authenticate = async () => {
        try {
          await user.checkAuth();
        } catch (error) {
          console.error("Check authentication error:", error);
        }
      };

    authenticate();
  }, [user]);


  if (user.loading) {
    return (
      <div className="loading">
        <LoadingIndicator />
      </div>
    );
  }

  if (user.isServerError) {
    return (
      <ErrorPage 
        title="Server connection error" 
        message={user.serverErrorMessage || "Server is not responding. Please try again later."} 
      />
    );
  }

  if (user.isTooManyRequests) {
    return (
      <ErrorPage 
        title="Too many requests" 
        message="Please try again later." 
      />
    );
  }

  return (
      <BrowserRouter>
        <Navigation />
          <Suspense
            fallback={
              <LoadingIndicator />
            }
          >
            <AppRouter />
          </Suspense>
        <Footer />
    </BrowserRouter>
  );
});

export default App;
