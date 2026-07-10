import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../utils/api";
import { toast } from "react-toastify";

const NewPassword = () => {
  const { token } = useParams();
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.patch(`/v1/users/resetPassword/${token}`, {
        password,
        passwordConfirm,
      });
      toast.success(data.message || "Password reset successful");
      setLoading(false);
      navigate("/users/login");
    } catch (err) {
      const msg =
        err.response?.data?.message || err.response?.data?.errMessage || err.message || "Reset failed";
      toast.error(msg);
      setLoading(false);
    }
  };

  return (
    <div className="row wrapper">
      <div className="col-10 col-lg-5">
        <form className="shadow-lg" onSubmit={submitHandler}>
          <h1 className="mb-3">Reset Password</h1>

          <div className="form-group">
            <label>New Password</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Confirm Password</label>
            <input
              type="password"
              className="form-control"
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
              required
            />
          </div>

          <button className="btn btn-block py3" disabled={loading}>
            {loading ? "Saving..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default NewPassword;
