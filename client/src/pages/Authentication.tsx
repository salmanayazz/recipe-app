import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthError, useAuth } from "../contexts/auth/AuthContext";

import Header1 from "../components/headers/Header1";
import TextInput from "../components/TextInput";
import HorizontalLine from "../components/HorizontalLine";
import Button from "../components/buttons/Button";
import PopupWindow from "../components/PopupWindow";

export default function Authentication() {
  const { authState, signupUser, loginUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (authState.user) {
      // redirect to home page if already logged in
      navigate("/");
    }
  }, [authState.user, navigate]);

  const [authError, setAuthError] = useState<AuthError | undefined>(undefined);
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const toggleForm = () => {
    setIsSignUp(!isSignUp);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isSignUp) {
      setAuthError(await signupUser(formData));
    } else {
      setAuthError(await loginUser(formData));
    }
  };

  return (
    <PopupWindow
      element={
        <form
          onSubmit={handleSubmit}
          className="flex flex-1 flex-col gap-7 md:p-3"
        >
          <div className="flex flex-col gap-1">
            <Header1 text={isSignUp ? "Sign Up" : "Log In"} />
            <HorizontalLine />
          </div>
          <div className="flex flex-col gap-3">
            <TextInput
              label="Username"
              required={true}
              textValue={formData.username}
              placeholder="Username"
              onChange={(value) =>
                setFormData({ ...formData, username: value })
              }
              error={authError?.username}
            />

            <TextInput
              label="Password"
              textValue={formData.password}
              required={true}
              hidden={true}
              placeholder="Password"
              onChange={(value) =>
                setFormData({ ...formData, password: value })
              }
              error={authError?.password}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Button
              type="submit"
              element={isSignUp ? "Sign Up" : "Log In"}
              loading={authState.loading}
              error={authError?.other}
              onClick={() => {
                setAuthError(undefined);
              }}
            />

            <span
              className="text-blue-500 hover:underline cursor-pointer"
              onClick={toggleForm}
            >
              {isSignUp
                ? "Already have an account? Log In"
                : "Don't have an account? Sign Up"}
            </span>
          </div>
        </form>
      }
      onExit={() => navigate("/")}
      size="small"
    />
  );
}
