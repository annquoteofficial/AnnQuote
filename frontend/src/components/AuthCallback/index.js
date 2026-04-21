import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import "./index.css";
import "./light.css";
import "./dark.css";
import "./mlight.css";
import "./mdark.css";

export default function AuthCallback() {
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const error = params.get("error");

    if (token) {
      login(token);
      navigate("/", { replace: true });
    } else {
      navigate(`/login${error ? `?error=${error}` : ""}`, { replace: true });
    }
  }, []);

  return (
    <div className="authcallback-page">
      <div className="authcallback-spinner" />
      <p className="authcallback-label">Signing you in...</p>
    </div>
  );
}
