import { useEffect } from "react";

const AuthCallback = () => {
  useEffect(() => {
    const code = new URLSearchParams(window.location.search).get("code");
    if (code) {
      fetch("http://localhost:3000/api/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log("User:", data.user);
          console.log("Access Token:", data.access_token);
          console.log("ID Token:", data.id_token);
        });
    }
  }, []);

  return <p>Đang xác thực...</p>;
};

export default AuthCallback;
