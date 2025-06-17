const getGoogleAuthUrl = () => {
  const rootUrl = "https://accounts.google.com/o/oauth2/v2/auth";

  const options = {
    client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
    redirect_uri: import.meta.env.VITE_GOOGLE_REDIRECT_URI,
    response_type: "code",
    scope: "openid profile email",
    prompt: "consent",
    access_type: "offline",
  };

  return `${rootUrl}?${new URLSearchParams(options)}`;
};

export default getGoogleAuthUrl;
