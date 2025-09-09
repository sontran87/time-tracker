// src/pages/LoginPage.js
import React, { useState } from "react";
import { Form, Input, Button, Toast } from "antd-mobile";
import { api } from "../api";
import { useAuth } from "../context";
import { useNavigate, useLocation } from "react-router-dom";

export default function LoginPage() {
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [changePwd, setChangePwd] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const location = useLocation();

  const params = new URLSearchParams(location.search);
  const redirectPath = params.get("redirect") || "/";

  const handleLogin = async (values) => {
    setLoading(true);
    try {
      const res = await api.post("/auth/login", values);
      login(res.data);
      navigate(redirectPath, { replace: true });
    } catch (e) {
      Toast.show({ icon: "fail", content: e.response?.data?.message || "Lỗi đăng nhập" });
    }
    setLoading(false);
  };

  const handleChangePwd = async (values) => {
    setLoading(true);
    try {
      await api.post("/auth/change-password", { newPassword: values.newPassword });
      Toast.show({ icon: "success", content: "Đổi mật khẩu thành công!" });
      setChangePwd(false);
      form.resetFields();
    } catch (e) {
      Toast.show({ icon: "fail", content: e.response?.data?.message || "Lỗi đổi mật khẩu" });
    }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 360, margin: "80px auto", padding: 16 }}>
      <h2 style={{ textAlign: "center", marginBottom: 16 }}>Đăng nhập</h2>
      <Form layout="vertical" onFinish={handleLogin} form={form}>
        <Form.Item name="username" label="Tài khoản" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="password" label="Mật khẩu" rules={[{ required: true }]}>
          <Input type="password" />
        </Form.Item>
        <Button block type="submit" color="primary" loading={loading}>Đăng nhập</Button>
      </Form>
      <Button block fill="none" style={{ marginTop: 12 }} onClick={() => setChangePwd(s => !s)}>
        Đổi mật khẩu?
      </Button>
      {changePwd && (
        <Form layout="vertical" onFinish={handleChangePwd} style={{ marginTop: 16 }}>
          <Form.Item name="newPassword" label="Mật khẩu mới" rules={[{ required: true, min: 6 }]}>
            <Input type="password" />
          </Form.Item>
          <Button block type="submit" color="success" loading={loading}>Đổi mật khẩu</Button>
        </Form>
      )}
    </div>
  );
}
