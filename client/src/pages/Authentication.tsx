import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../contexts/AuthContext";

import Header1 from "../components/headers/Header1";
import TextInput from "../components/TextInput";
import HorizontalLine from "../components/HorizontalLine";
import Button from "../components/buttons/Button";


export default function Authentication() {
    const { state, signupUser, loginUser } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (state.user) {
            // redirect to home page if already logged in
            navigate('/');
        }
    }, [state.user, navigate]);

    const [isSignUp, setIsSignUp] = useState(false);
    const [formData, setFormData] = useState({
        username: "",
        password: "",
    });

    const toggleForm = () => {
        setIsSignUp(!isSignUp);
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();

        if (isSignUp) {
            signupUser(formData);
        } else {
            loginUser(formData);
        }
    };

    return (
        <div className="bg-pri-100 min-h-screen flex flex-col items-center justify-center">
        <div className="flex flex-col bg-pri-200 p-6 rounded-md shadow-lg w-full max-w-md ">
            <Header1 text={isSignUp ? "Sign Up" : "Log In"} />
            <HorizontalLine />

            <form onSubmit={handleSubmit}>
                <div className="flex flex-col gap-3 py-2">
                    <TextInput
                        label="Username"
                        required={true}
                        textValue={formData.username}
                        placeholder="Username"
                        onChange={(value) =>
                            setFormData({ ...formData, username: value})
                        }
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
                    />
                </div>

                <div className="flex py-3 flex-col">
                    <Button
                        type="submit"
                        element={isSignUp ? "Sign Up" : "Log In"}
                        loading={state.loading}
                    />
                </div>
            </form>

            <div className="flex items-center">
                <span
                    className="text-blue-500 hover:underline cursor-pointer"
                    onClick={toggleForm}
                >
                    {isSignUp
                    ? "Already have an account? Log In"
                    : "Don't have an account? Sign Up"}
                </span>
            </div>
        </div>
        </div>
    );
}