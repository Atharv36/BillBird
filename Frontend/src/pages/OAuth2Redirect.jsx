import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import { fetchUser } from "../store/reducers/userReducer";

const OAuth2Redirect = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [params] = useSearchParams();

  useEffect(() => {
    const status = params.get("status");
    const message = params.get("message");

    if (status === "error" || status === "missing_email") {
      const reason =
        message === "oauth2_failed"
          ? "Google sign-in failed. Please try again."
          : "Your Google account did not provide an email.";
      toast.error(reason);
      navigate("/login", { replace: true });
      return;
    }

    const finish = async () => {
      try {
        await dispatch(fetchUser()).unwrap();
        toast.success("Signed in with Google!");
        navigate("/dashboard", { replace: true });
      } catch (err) {
        toast.error("Could not complete sign-in. Please try again.");
        navigate("/login", { replace: true });
      }
    };

    finish();
  }, [dispatch, navigate, params]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mb-4"></div>
        <p className="text-gray-600">Signing you in with Google...</p>
      </div>
    </div>
  );
};

export default OAuth2Redirect;
