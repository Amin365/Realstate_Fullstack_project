import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const PaymentSuccessPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const query = new URLSearchParams(location.search);

    // ✅ Ignore "callback" completely
    const trx_ref = query.get("trx_ref");
    const status = query.get("status");

    if (trx_ref && status === "success") {
      // Verify payment with backend
      axios
        .get(`http://localhost:4800/api/payments/verify/${trx_ref}`)
        .finally(() => {
          // Redirect home automatically
          navigate("/", { replace: true });
        });
    } else {
      // Fallback if missing trx_ref or payment failed
      navigate("/", { replace: true });
    }
  }, [location.search, navigate]);

  return null; // no UI needed, just redirect
};

export default PaymentSuccessPage;
