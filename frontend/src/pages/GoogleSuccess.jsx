import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function GoogleSuccess() {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    const token = params.get("token");
    const name = params.get("name");
    const role = params.get("role");
    const email = params.get("email");
    
    console.log("GOOGLE EMAIL:", email);

    const image = params.get("image")
      ? decodeURIComponent(params.get("image"))
      : "/user.png";

    if (token) {
      localStorage.setItem("token", token);
      localStorage.setItem("name", name);
      localStorage.setItem("role", role);
      localStorage.setItem("image", image || "/user.png");
      localStorage.setItem("email", email);

      navigate("/home");
    }
  }, []);

  return <h2>Logging in with Google...</h2>;
}
