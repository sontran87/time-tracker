// src/components/ChartBlock.js
// Hiển thị biểu đồ Pie hoặc Bar (Column), dùng recharts, tự động responsive

import React from "react";
import {
  PieChart, Pie, Cell, Tooltip, Legend,
  BarChart, Bar, XAxis, YAxis, ResponsiveContainer,
} from "recharts";

// Một số màu sắc mặc định đẹp, sẽ lặp lại nếu thiếu
const COLORS = [
  "#3BA272", "#5470C6", "#FAC858", "#EE6666", "#91CC75",
  "#73C0DE", "#FC8452", "#9A60B4", "#ea7ccc"
];

// data: mảng object [{key: string, value: number}, ...]
// type: "pie" hoặc "bar"
// labelKey: tên field để lấy label (ví dụ "key")
// valueKey: tên field để lấy số (ví dụ "value")

export default function ChartBlock({ data = [], type = "pie", labelKey = "key", valueKey = "value" }) {
  if (!Array.isArray(data) || data.length === 0)
    return <div style={{ color: "#888", textAlign: "center", margin: 32 }}>Không có dữ liệu để vẽ biểu đồ.</div>;

  if (type === "pie")
    return (
      <ResponsiveContainer width="100%" height={260}>
        <PieChart>
          <Pie
            data={data}
            dataKey={valueKey}
            nameKey={labelKey}
            outerRadius={80}
            label={({ name, value }) => `${name}: ${value}`}
          >
            {data.map((entry, idx) => (
              <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    );

  // Bar/Column chart
  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data}>
        <XAxis dataKey={labelKey} />
        <YAxis />
        <Bar dataKey={valueKey} fill="#3BA272" />
        <Tooltip />
        <Legend />
      </BarChart>
    </ResponsiveContainer>
  );
}
