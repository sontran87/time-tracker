// BottomNav.js: Menu dưới cùng, hiển thị mọi trang (ẩn/hiện tuỳ role)
import React from "react";
import { TabBar } from "antd-mobile";
import {
  AppOutline,
  FileOutline,
  PieOutline,
  UserOutline,
  SetOutline,
} from "antd-mobile-icons";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context";

const items = [
  { key: "/", title: "Chấm công", icon: <AppOutline /> },
  { key: "/history", title: "Lịch sử", icon: <FileOutline /> },
  { key: "/report", title: "Báo cáo", icon: <PieOutline /> },
  { key: "/admin", title: "Quản trị", icon: <SetOutline />, admin: true },
  { key: "/profile", title: "Tài khoản", icon: <UserOutline /> },
];

export default function BottomNav() {
  const nav = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  return (
    <TabBar
      activeKey={location.pathname.startsWith("/admin") ? "/admin" : location.pathname}
      onChange={key => nav(key)}
      style={{
        position: "fixed",
        left: 0, right: 0, bottom: 0, zIndex: 10,
        borderTop: "1px solid #eee"
      }}
      safeArea
    >
      {items
        .filter(it => !it.admin || (user && user.role === "admin"))
        .map(it => (
          <TabBar.Item
            key={it.key}
            icon={it.icon}
            title={it.title}
          />
        ))}
    </TabBar>
  );
}
