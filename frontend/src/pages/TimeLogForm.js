// TimeLogForm.js: Form ghi nhận chấm công (tối ưu lookup, số lượng, tổng thời gian ngày)
import React, { useState, useEffect } from "react";
import { DatePicker, Form, Input, Button, Selector, Toast, Space } from "antd-mobile";
import { api } from "../api";
import dayjs from "dayjs";

export default function TimeLogForm() {
  const [products, setProducts] = useState([]);
  const [parts, setParts] = useState([]);
  const [workitems, setWorkitems] = useState([]);
  const [productId, setProductId] = useState("");
  const [productInfo, setProductInfo] = useState({});
  const [partId, setPartId] = useState("");
  const [partInfo, setPartInfo] = useState({});
  const [date, setDate] = useState(dayjs().format("YYYY-MM-DD"));
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    api.get("/products").then(res => setProducts(res.data));
    api.get("/parts").then(res => setParts(res.data));
    api.get("/workitems").then(res => setWorkitems(res.data));
  }, []);

  useEffect(() => {
    if (productId) {
      const p = products.find(x => x.productId === productId);
      setProductInfo(p || {});
    } else {
      setProductInfo({});
    }
  }, [productId, products]);

  useEffect(() => {
    if (partId) {
      const p = parts.find(x => x.id === partId);
      setPartInfo(p || {});
    } else {
      setPartInfo({});
    }
  }, [partId, parts]);

  // Lấy tổng số giờ đã nhập trong ngày
  useEffect(() => {
    setLoading(true);
    api.get("/time-logs", { params: { date } })
      .then(res => setLogs(res.data))
      .finally(() => setLoading(false));
  }, [date]);

  const totalHour = logs.reduce((sum, l) => sum + (l.hour || 0), 0);

  const onFinish = async (values) => {
    try {
      await api.post("/time-logs", {
        date,
        hour: Number(values.hour),
        notes: values.notes || "",
        ProductId: productInfo.id,
        WorkItemId: values.workitem,
        quantity: Number(values.quantity),
        partId: partInfo.id
      });
      Toast.show({ icon: "success", content: "Đã lưu!" });
    } catch {
      Toast.show({ icon: "fail", content: "Lỗi khi lưu!" });
    }
  };

  return (
    <div style={{ padding: 8, paddingBottom: 60 }}>
      <h3>Ghi nhận chấm công</h3>
      <Form layout="vertical" onFinish={onFinish} footer={<Button block color="primary" type="submit">Lưu</Button>}>
        <Form.Item label="Ngày" name="date">
          <DatePicker value={new Date(date)} onChange={d => setDate(dayjs(d).format("YYYY-MM-DD"))} />
        </Form.Item>
        {/* 
        <Form.Item label="ID sản phẩm" name="productId" rules={[{ required: true }]}>
          <Selector
            options={products.map(p => ({ label: p.productId, value: p.productId }))}
            value={productId ? [productId] : []}
            onChange={arr => setProductId(arr[0])}
          />
        </Form.Item>
        */}
                <Form.Item label="ID sản phẩm" name="productId" rules={[{ required: true }]}>
          <Input

            onChange={v => setProductId(v)}
          />
        </Form.Item>
{/*         <Form.Item label="Mã sản phẩm">
          <Input value={productInfo.code || ""} disabled />
        </Form.Item> */}
        <Form.Item label="Mã sản phẩm: Tên sản phẩm">
          <Input value={productInfo.code + " : " + productInfo.name || ""} disabled />
        </Form.Item>
{/*         <Form.Item label="Tên sản phẩm">
          <Input value={productInfo.name || ""} disabled />
        </Form.Item> */}
        <Form.Item label="Hạng mục công việc" name="workitem" rules={[{ required: true }]}>
          <Selector
            options={workitems.map(w => ({ label: w.name, value: w.id }))}
          />
        </Form.Item>
        <Form.Item label="Số lượng" name="quantity" initialValue={1} rules={[{ required: true }]}>
          <Input type="number" min={1} value={quantity} onChange={v => setQuantity(Number(v))} />
        </Form.Item>
        <Form.Item label="ID linh kiện" name="partId">
          <Selector
            options={parts.map(p => ({ label: p.id + "", value: p.id }))}
            value={partId ? [partId] : []}
            onChange={arr => setPartId(arr[0])}
          />
        </Form.Item>
        <Form.Item label="Thông tin linh kiện">
          <Input
            value={productInfo.code && partInfo.name ? `${productInfo.code} - ${partInfo.name}` : ""}
            disabled
          />
        </Form.Item>
        <Form.Item label="Trọng lượng linh kiện">
          <Input value={partInfo.weight || ""} disabled />
        </Form.Item>
        <Form.Item label="Tổng trọng lượng">
          <Input value={quantity * (partInfo.weight || 0)} disabled />
        </Form.Item>
        <Form.Item label="Số giờ" name="hour" rules={[{ required: true }]}>
          <Input type="number" min={0.1} step={0.1} />
        </Form.Item>
        <Form.Item label="Ghi chú" name="notes">
          <Input />
        </Form.Item>
      </Form>
      <div style={{ marginTop: 12 }}>
        <b>Tổng thời gian hôm nay:</b> {totalHour} giờ ({(totalHour * 60).toFixed(0)} phút)
      </div>
    </div>
  );
}
