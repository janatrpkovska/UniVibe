import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import RightBottomToast from "./RightBottomToast";

/**
 * Shows toast after redirect from Login with `navigate(..., { state: { loginToast: "..." } })`.
 */
export default function LoginSuccessToast() {
  const location = useLocation();
  const navigate = useNavigate();
  const [toast, setToast] = useState({ show: false, message: "" });
  const loginToastMsg = location.state?.loginToast;

  useEffect(() => {
    if (typeof loginToastMsg !== "string" || !loginToastMsg.trim()) return;
    setToast({ show: true, message: loginToastMsg });
    navigate(
      { pathname: location.pathname, search: location.search, hash: location.hash },
      { replace: true, state: {} }
    );
  }, [loginToastMsg, navigate, location.pathname, location.search, location.hash]);

  return (
    <RightBottomToast
      show={toast.show}
      message={toast.message}
      onClose={() => setToast((t) => ({ ...t, show: false }))}
    />
  );
}
