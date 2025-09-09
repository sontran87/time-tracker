// ReportPage.js: Báo cáo tổng hợp, export, vẽ chart
import React, { useState, useEffect } from "react";
import { DatePicker, Selector, Radio, Button } from "antd-mobile";
import { api } from "../api";
import dayjs from "dayjs";
import ChartBlock from "../components/ChartBlock";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";

const reportTypes = [
  { label: "Sản phẩm", value: "product" },
  { label: "Hạng mục", value: "workitem" },
  { label: "Người dùng", value: "user" },
];

export default function ReportPage() {
  const [type, setType] = useState("product");
  const [month, setMonth] = useState(dayjs().format("YYYY-MM"));
  const [data, setData] = useState([]);
  const [chartType, setChartType] = useState("pie");

  useEffect(() => {
    api.get("/reports", { params: { type, month } }).then(res => setData(res.data));
  }, [type, month]);

  const exportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Báo cáo");
    XLSX.writeFile(wb, "baocao.xlsx");
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("Báo cáo tổng hợp", 10, 10);
    doc.autoTable({
      head: [["Tên", "Tổng giờ"]],
      body: data.map(d => [d.key, d.value])
    });
    doc.save("baocao.pdf");
  };

  return (
    <div style={{ padding: 8, paddingBottom: 60 }}>
      <h3>Báo cáo tổng hợp</h3>
      <Selector options={reportTypes} value={[type]} onChange={arr => setType(arr[0])} />
      <DatePicker
        precision="month"
        value={new Date(month + "-01")}
        onChange={d => setMonth(dayjs(d).format("YYYY-MM"))}
      />
      <Radio.Group
        style={{ margin: "8px 0" }}
        value={chartType}
        onChange={setChartType}
      >
        <Radio value="pie">Pie chart</Radio>
        <Radio value="bar">Bar chart</Radio>
      </Radio.Group>
      <ChartBlock data={data} type={chartType} labelKey="key" valueKey="value" />
      <Button onClick={exportExcel} block color="primary">Xuất Excel</Button>
      <Button onClick={exportPDF} block color="success" style={{ marginTop: 8 }}>Xuất PDF</Button>
    </div>
  );
}
