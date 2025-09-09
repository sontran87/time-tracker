// AdminPage.js: CRUD mọi bảng (user, sản phẩm, linh kiện, hạng mục, v.v.)
// (Bạn có thể tách nhỏ hơn tuỳ ý. Dưới đây là ví dụ block quản lý Users)
import React, { useEffect, useState } from "react";
import { api } from "../api";
import { List, Button, Dialog, Form, Input, Toast } from "antd-mobile";

export default function AdminPage() {
  // Quản lý user (bạn bổ sung quản lý sản phẩm/parts tương tự)
  const [users, setUsers] = useState([]);
  const [showAdd, setShowAdd] = useState(false);

  const fetchUsers = () => {
    api.get("/users").then(res => setUsers(res.data));
  };

  useEffect(() => { fetchUsers(); }, []);

  const onAdd = async (values) => {
    await api.post("/users", values);
    Toast.show({ icon: "success", content: "Đã thêm user" });
    setShowAdd(false);
    fetchUsers();
  };

  const onDelete = async (id) => {
    if (await Dialog.confirm({ content: "Xoá user này?" })) {
      await api.delete("/users/" + id);
      fetchUsers();
    }
  };

  return (
    <div style={{ padding: 8, paddingBottom: 60 }}>
      <h3>Quản trị User</h3>
      <Button block color="primary" onClick={() => setShowAdd(true)}>Thêm user</Button>
      <List>
        {users.map(u => (
          <List.Item key={u.id}
            description={u.full_name + " (" + u.role + ")"}
            extra={<Button size="mini" color="danger" onClick={() => onDelete(u.id)}>Xoá</Button>}>
            {u.username}
          </List.Item>
        ))}
      </List>
      {showAdd && (
        <Dialog visible onClose={() => setShowAdd(false)} title="Thêm user mới">
          <Form onFinish={onAdd} layout="vertical" footer={<Button block type="submit" color="primary">Tạo</Button>}>
            <Form.Item name="username" label="Tài khoản" rules={[{ required: true }]}><Input /></Form.Item>
            <Form.Item name="password" label="Mật khẩu" rules={[{ required: true }]}><Input type="password" /></Form.Item>
            <Form.Item name="full_name" label="Tên đầy đủ" rules={[{ required: true }]}><Input /></Form.Item>
            <Form.Item name="role" label="Quyền" rules={[{ required: true }]}><Input /></Form.Item>
          </Form>
        </Dialog>
      )}
    </div>
  );
}
