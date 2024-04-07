import { useAuth } from "@/hooks/auth";
import { useCode } from "@/hooks/code";
import { useEffect } from "react";
import { Navigate } from "react-router-dom";

const ProtectedCodeRoute = ({ children }) => {
  const { user } = useAuth();
  const { codePass } = useCode();

  useEffect(() => {
    console.log(`this is the code statuus`, codePass);
  }, []);

  if (!user && !codePass) {
    console.log("codePass", codePass);
    // user is not authenticated
    return <Navigate to="/code" />;
  }
  return <>{children}</>;
};

export default ProtectedCodeRoute;
