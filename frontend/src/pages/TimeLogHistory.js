// TimeLogHistory.js: Lịch sử, lọc ngày, tổng, bấm dòng quay về form sửa
import React, { useEffect, useState } from "react";
import { DatePicker, Button, Dialog, Toast } from "antd-mobile";
import { api } from "../api";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";

export default function TimeLogHistory() {
  const [date, setDate] = useState(dayjs().format("YYYY-MM-DD"));
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  useEffect(() => {
    setLoading(true);
    api.get("/time-logs", { params: { date } })
      .then(res => setLogs(res.data))
      .finally(() => setLoading(false));
  }, [date]);

  const total = logs.reduce((sum, l) => sum + (l.hour || 0), 0);

  const onDelete = async (id) => {
    if (await Dialog.confirm({ content: "Bạn chắc chắn xoá?" })) {
      await api.delete("/time-logs/" + id);
      setLogs(logs.filter(l => l.id !== id));
      Toast.show({ icon: "success", content: "Đã xoá" });
    }
  };

  return (
    <div style={{ padding: 8, paddingBottom: 60 }}>
      <h3>Lịch sử chấm công</h3>
      <DatePicker value={new Date(date)} onChange={d => setDate(dayjs(d).format("YYYY-MM-DD"))} />
      {loading && <div>Đang tải...</div>}
      {!loading && logs.length === 0 && <div>Không có dữ liệu.</div>}
      {!loading && logs.map(l => (
        <div
          key={l.id}
          style={{ borderBottom: "1px solid #eee", padding: "8px 0" }}
          onClick={() => nav("/?edit=" + l.id)}
        >
          <b>{l.product_code}</b> | {l.workitem_name} | {l.hour} giờ | SL: {l.quantity}
          {l.notes && <i style={{ color: "#888" }}>{l.notes}</i>}
          <Button size="mini" color="danger" onClick={e => { e.stopPropagation(); onDelete(l.id); }} style={{ float: "right" }}>Xoá</Button>
        </div>
      ))}
      <div style={{ marginTop: 10, fontWeight: 600 }}>
        Tổng: {total} giờ ({(total * 60).toFixed(0)} phút)
      </div>
    </div>
  );
}
