// ProfilePage.js: Thông tin tài khoản, đổi mật khẩu
import React from "react";
import { useAuth } from "../context";

export default function ProfilePage() {
  const { user, logout } = useAuth();
  return (
    <div style={{ padding: 16 }}>
      <h3>Thông tin tài khoản</h3>
      <div><b>Họ tên:</b> {user.full_name || user.name}</div>
      <div><b>Tài khoản:</b> {user.username}</div>
      <div><b>Quyền:</b> {user.role}</div>
      <button onClick={logout} style={{ marginTop: 24 }}>Đăng xuất</button>
    </div>
  );
}
