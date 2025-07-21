import React, { useState } from "react";
import jsPDF from "jspdf";
import "jspdf-font";
import {
  Table,
  Card,
  Button,
  Input,
  Space,
  Tag,
  Modal,
  Form,
  Select,
  Popconfirm,
  message,
  Row,
  Col,
  Statistic,
  Timeline,
  Descriptions,
  Badge,
  Typography,
} from "antd";
import {
  PlusOutlined,
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  ShoppingCartOutlined,
  DollarOutlined,
  UserOutlined,
  CalendarOutlined,
  FilterOutlined,
  ExportOutlined,
  ImportOutlined,
  ReloadOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined,
  CarOutlined,
  CheckOutlined,
  CloseOutlined,
  SyncOutlined,
  PrinterOutlined,
  DownloadOutlined,
} from "@ant-design/icons";
import { useData } from "../../context/DataContext.jsx";

const { Search } = Input;
const { Option } = Select;
const { Text } = Typography;

const OrdersPage = () => {
  const { orders, updateOrder, deleteOrder } = useData();
  const [searchText, setSearchText] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const statusConfig = {
    pending: {
      color: "orange",
      text: "Beklemede",
      icon: <ClockCircleOutlined />,
    },
    processing: { color: "blue", text: "İşleniyor", icon: <CarOutlined /> },
    completed: {
      color: "green",
      text: "Tamamlandı",
      icon: <CheckCircleOutlined />,
    },
    cancelled: {
      color: "red",
      text: "İptal Edildi",
      icon: <CloseCircleOutlined />,
    },
  };

  // Ödeme durumu konfigürasyonu (gelecekte kullanım için)
  const _paymentStatusConfig = {
    pending: { color: "orange", text: "Beklemede" },
    paid: { color: "green", text: "Ödendi" },
    failed: { color: "red", text: "Başarısız" },
    refunded: { color: "purple", text: "İade Edildi" },
  };

  // Siparişleri tablo formatına çevir
  const tableData = orders.map((order, index) => ({
    key: order._id || order.id || `order-${index}`,
    ...order, // Tüm orijinal veriyi koru
    orderNumber: order.orderNumber || order.id || `ORD-${order.id}`, // Sipariş numarası
    customer: {
      name: `${order.customerInfo?.firstName || ""} ${
        order.customerInfo?.lastName || ""
      }`,
      email: order.customerInfo?.email || "",
      phone: order.customerInfo?.phone || "",
    },
    products: order.products || order.items || [], // Hem yeni hem eski format desteği
    total: order.total || 0,
    orderDate: new Date(order.createdAt || order.orderDate).toLocaleString(
      "tr-TR"
    ),
  }));

  const columns = [
    {
      title: "Sipariş ID",
      dataIndex: "orderNumber",
      key: "orderNumber",
      render: (orderNumber) => <strong>{orderNumber}</strong>,
    },
    {
      title: "Müşteri",
      dataIndex: "customer",
      key: "customer",
      render: (customer) => (
        <div>
          <div className="font-medium">{customer.name}</div>
          <div className="text-xs text-gray-500">{customer.email}</div>
        </div>
      ),
    },
    {
      title: 'Ürünler',
      dataIndex: 'products',
      key: 'products',
      responsive: ['lg'],
      render: (products) => (
        <div>
          {products && products.length > 0 ? (
            products.map((product, index) => (
              <div key={`product-${index}-${product.id || product._id || product.name}`} style={{ fontSize: 12 }}>
                {product.name} x{product.quantity}
                {product.selectedSize && ` (${product.selectedSize})`}
                {product.selectedColor && ` - ${product.selectedColor}`}
              </div>
            ))
          ) : (
            <span style={{ color: "#999", fontSize: 12 }}>
              Ürün bilgisi yok
            </span>
          )}
        </div>
      ),
    },
    {
      title: "Toplam",
      dataIndex: "total",
      key: "total",
      render: (total) => (
        <div className="font-medium text-blue-600">
          {total.toLocaleString('tr-TR')} ₺
        </div>
      ),
      sorter: (a, b) => a.total - b.total,
    },
    {
      title: "Durum",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        const config = statusConfig[status] || {
          color: "default",
          text: status || "Bilinmiyor",
          icon: <ClockCircleOutlined />
        };
        return (
          <Tag color={config.color} icon={config.icon}>
            {config.text}
          </Tag>
        );
      },
    },
    {
      title: "Ödeme",
      dataIndex: "paymentMethod",
      key: "paymentMethod",
      responsive: ['lg'],
      render: (paymentMethod) => {
        const methodNames = {
          credit_card: "Kredi Kartı",
          paypal: "PayPal",
          bank_transfer: "Banka Havalesi",
          cash_on_delivery: "Kapıda Ödeme",
        };
        return <span>{methodNames[paymentMethod] || paymentMethod}</span>;
      },
    },
    {
      title: "Tarih",
      dataIndex: "orderDate",
      key: "orderDate",
      responsive: ['md'],
      render: (orderDate) => (
        <div className="text-xs">
          {orderDate || "-"}
        </div>
      ),
      sorter: (a, b) => new Date(a.orderDate || 0) - new Date(b.orderDate || 0),
    },
    {
      title: "İşlemler",
      key: "actions",
      render: (_, record) => (
        <Space size="small">
          <Button
            type="link"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleView(record)}
          >
            Görüntüle
          </Button>
                      <Popconfirm
              title="Bu siparişi silmek istediğinize emin misiniz?"
              onConfirm={() => handleDelete(record._id || record.id)}
              okText="Evet"
              cancelText="Hayır"
            >
            <Button type="link" size="small" danger icon={<DeleteOutlined />}>
              Sil
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const handleSearch = (value) => {
    setSearchText(value);
  };

  const handleView = (order) => {
    setSelectedOrder(order);
    setIsModalVisible(true);
  };

  const handleDelete = (id) => {
    deleteOrder(id);
    message.success("Sipariş başarıyla silindi!");
  };

  const handleModalOk = () => {
    setIsModalVisible(false);
    setSelectedOrder(null);
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await updateOrder(orderId, { status: newStatus });
      // Success message is handled by DataContext
    } catch {
      message.error("Sipariş durumu güncellenirken hata oluştu!");
    }
  };

  // PDF indirme fonksiyonu
  const generatePDF = async (order) => {
    try {
      message.loading("PDF oluşturuluyor...", 0);

      // PDF oluştur ve Türkçe font yükle
      const pdf = new jsPDF();

      // Türkçe karakterleri destekleyen font ayarları
      pdf.setFont("helvetica");

      // Başlık
      pdf.setFontSize(20);
      pdf.text("FATURA", 105, 20, { align: "center" });

      // Sipariş bilgileri
      pdf.setFontSize(12);
      pdf.text(`Sipariş No: ${order.orderNumber}`, 20, 40);
      pdf.text(
        `Tarih: ${new Date(order.createdAt).toLocaleDateString("tr-TR")}`,
        20,
        50
      );

      // Müşteri bilgileri
      pdf.setFontSize(14);
      pdf.text("Müşteri Bilgileri", 20, 70);
      pdf.setFontSize(10);

      // Türkçe karakterleri güvenli hale getir
      const safeText = (text) => {
        if (!text) return "-";
        return text
          .replace(/ğ/g, "g")
          .replace(/Ğ/g, "G")
          .replace(/ü/g, "u")
          .replace(/Ü/g, "U")
          .replace(/ş/g, "s")
          .replace(/Ş/g, "S")
          .replace(/ı/g, "i")
          .replace(/İ/g, "I")
          .replace(/ö/g, "o")
          .replace(/Ö/g, "O")
          .replace(/ç/g, "c")
          .replace(/Ç/g, "C");
      };

      pdf.text(
        `Ad Soyad: ${safeText(order.customerInfo?.firstName || "")} ${safeText(
          order.customerInfo?.lastName || ""
        )}`,
        20,
        80
      );
      pdf.text(`E-posta: ${order.customerInfo?.email || "-"}`, 20, 90);
      pdf.text(`Telefon: ${order.customerInfo?.phone || "-"}`, 20, 100);
      pdf.text(
        `Adres: ${safeText(order.customerInfo?.address || "-")}`,
        20,
        110
      );
      pdf.text(`Şehir: ${safeText(order.customerInfo?.city || "-")}`, 20, 120);
      pdf.text(`Posta Kodu: ${order.customerInfo?.postalCode || "-"}`, 20, 130);

      // Ürünler
      pdf.setFontSize(14);
      pdf.text("Urunler", 20, 150);
      pdf.setFontSize(10);

      let yPosition = 160;
      order.products?.forEach((product, index) => {
        if (yPosition > 250) {
          pdf.addPage();
          yPosition = 20;
        }

        pdf.text(`${index + 1}. ${safeText(product.name)}`, 20, yPosition);
        pdf.text(
          `   Beden: ${product.selectedSize || "-"} | Renk: ${safeText(
            product.selectedColor || "-"
          )}`,
          25,
          yPosition + 5
        );
        pdf.text(
          `   Adet: ${
            product.quantity
          } | Fiyat: ₺${product.price?.toLocaleString()} | Toplam: ₺${(
            product.price * product.quantity
          )?.toLocaleString()}`,
          25,
          yPosition + 10
        );
        yPosition += 20;
      });

      // Toplam
      pdf.setFontSize(14);
      pdf.text(
        `Toplam: ₺${order.total?.toLocaleString() || "0"}`,
        20,
        yPosition + 10
      );

      // Ödeme bilgileri
      pdf.setFontSize(12);
      const paymentMethod =
        order.paymentMethod === "credit_card"
          ? "Kredi Karti"
          : order.paymentMethod === "paypal"
          ? "PayPal"
          : order.paymentMethod === "bank_transfer"
          ? "Banka Havalesi"
          : order.paymentMethod === "cash_on_delivery"
          ? "Kapida Odeme"
          : order.paymentMethod;

      pdf.text(`Odeme Yontemi: ${paymentMethod}`, 20, yPosition + 25);

      // Alt bilgi
      pdf.setFontSize(10);
      pdf.text(
        `Bu fatura ${new Date().toLocaleDateString(
          "tr-TR"
        )} tarihinde olusturulmustur.`,
        20,
        yPosition + 40
      );
      pdf.text("Tesekkur ederiz!", 20, yPosition + 50);

      // PDF'i indir
      const fileName = `Fatura-${order.orderNumber}-${
        new Date().toISOString().split("T")[0]
      }.pdf`;
      pdf.save(fileName);

      message.destroy();
      message.success("PDF başarıyla indirildi!");
    } catch {
      message.destroy();

      message.error("PDF oluşturulurken bir hata oluştu!");
    }
  };

  // İstatistikler
  const totalOrders = orders.length;
  const pendingOrders = orders.filter(
    (order) => order.status === "pending"
  ).length;
  const completedOrders = orders.filter(
    (order) => order.status === "completed"
  ).length;
  const totalRevenue = orders.reduce(
    (sum, order) => sum + (order.total || 0),
    0
  );

  const filteredData = tableData.filter((order) => {
    const searchLower = (searchText || "").toLowerCase();
    const orderNumber = String(order.orderNumber || "").toLowerCase();
    const customerName = String(order.customer?.name || "").toLowerCase();
    const customerEmail = String(order.customer?.email || "").toLowerCase();

    return (
      orderNumber.includes(searchLower) ||
      customerName.includes(searchLower) ||
      customerEmail.includes(searchLower)
    );
  });

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Siparişler</h1>
        <p className="text-gray-600">Tüm siparişleri yönetin ve takip edin</p>
      </div>

      {/* İstatistikler */}
      <Row gutter={16} className="mb-6">
        <Col span={6}>
          <Card>
            <Statistic
              title="Toplam Sipariş"
              value={totalOrders}
              prefix={<ShoppingCartOutlined />}
              valueStyle={{ color: "#1890ff" }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Bekleyen Sipariş"
              value={pendingOrders}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: "#faad14" }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Tamamlanan Sipariş"
              value={completedOrders}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: "#52c41a" }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Toplam Gelir"
              value={totalRevenue}
              precision={2}
              prefix={<DollarOutlined />}
              suffix="₺"
              valueStyle={{ color: "#52c41a" }}
            />
          </Card>
        </Col>
      </Row>

      {/* Arama ve Filtreler */}
      <Card className="mb-6">
        <div className="flex justify-between items-center">
          <Search
            placeholder="Sipariş ara..."
            allowClear
            enterButton={<SearchOutlined />}
            size="large"
            onSearch={handleSearch}
            style={{ width: 300 }}
          />
          <Space>
            <Button
              icon={<ReloadOutlined />}
              onClick={() => window.location.reload()}
            >
              Yenile
            </Button>
            <Button icon={<ExportOutlined />} type="primary">
              Dışa Aktar
            </Button>
          </Space>
        </div>
      </Card>

      {/* Sipariş Tablosu */}
      <Card>
        <Table
          columns={columns}
          dataSource={filteredData}
          rowKey={(record) => record._id || record.id || record.key}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} / ${total} sipariş`,
          }}
          scroll={{ x: 1200 }}
        />
      </Card>

      {/* Sipariş Detay Modal */}
      <Modal
        title={`Sipariş Detayları - ${selectedOrder?.orderNumber || selectedOrder?.id || ''}`}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalOk}
        width={1000}
        footer={[
          <Button key="download" icon={<DownloadOutlined />} onClick={() => generatePDF(selectedOrder)}>
            PDF İndir
          </Button>,
          <Button key="print" icon={<PrinterOutlined />} onClick={() => window.print()}>
            Yazdır
          </Button>,
          <Button key="close" type="primary" onClick={handleModalOk}>
            Kapat
          </Button>,
        ]}
      >
        {selectedOrder && (
          <div>
            {/* Sipariş Özeti */}
            <Card size="small" style={{ marginBottom: 16 }}>
              <Row gutter={[16, 8]}>
                <Col span={6}>
                  <Statistic 
                    title="Sipariş No" 
                    value={selectedOrder.orderNumber || selectedOrder.id || '-'} 
                    prefix={<ShoppingCartOutlined />}
                  />
                </Col>
                <Col span={6}>
                  <Statistic 
                    title="Toplam Tutar" 
                    value={selectedOrder.total || 0} 
                    prefix="₺" 
                    precision={2}
                    valueStyle={{ color: '#52c41a' }}
                  />
                </Col>
                <Col span={6}>
                  <Statistic 
                    title="Ürün Sayısı" 
                    value={selectedOrder.products?.length || selectedOrder.items?.length || 0}
                    suffix="adet"
                  />
                </Col>
                <Col span={6}>
                  <div>
                    <div style={{ fontSize: 14, color: '#666' }}>Durum</div>
                    <div style={{ marginTop: 4 }}>
                      {(() => {
                        const config = statusConfig[selectedOrder.status] || {
                          color: "default",
                          text: selectedOrder.status || "Bilinmiyor",
                          icon: <ClockCircleOutlined />
                        };
                        return (
                          <Tag color={config.color} icon={config.icon} style={{ fontSize: 12 }}>
                            {config.text}
                          </Tag>
                        );
                      })()}
                    </div>
                  </div>
                </Col>
              </Row>
            </Card>

            {/* Müşteri ve Adres Bilgileri */}
            <Row gutter={16} style={{ marginBottom: 16 }}>
              <Col span={12}>
                <Card title="Müşteri Bilgileri" size="small">
                  <Descriptions bordered column={1} size="small">
                    <Descriptions.Item label="Ad Soyad">
                      {`${selectedOrder.customerInfo?.firstName || selectedOrder.shippingAddress?.firstName || ""} ${
                        selectedOrder.customerInfo?.lastName || selectedOrder.shippingAddress?.lastName || ""
                      }`.trim() || "-"}
                    </Descriptions.Item>
                    <Descriptions.Item label="E-posta">
                      {selectedOrder.customerInfo?.email || selectedOrder.shippingAddress?.email || "-"}
                    </Descriptions.Item>
                    <Descriptions.Item label="Telefon">
                      {selectedOrder.customerInfo?.phone || selectedOrder.shippingAddress?.phone || "-"}
                    </Descriptions.Item>
                  </Descriptions>
                </Card>
              </Col>
              <Col span={12}>
                <Card title="Teslimat Adresi" size="small">
                  <Descriptions bordered column={1} size="small">
                    <Descriptions.Item label="Adres">
                      {selectedOrder.customerInfo?.address || selectedOrder.shippingAddress?.address || "-"}
                    </Descriptions.Item>
                    <Descriptions.Item label="Şehir/İlçe">
                      {`${selectedOrder.customerInfo?.city || selectedOrder.shippingAddress?.city || ""} ${
                        selectedOrder.customerInfo?.state || selectedOrder.shippingAddress?.state || ""
                      }`.trim() || "-"}
                    </Descriptions.Item>
                    <Descriptions.Item label="Posta Kodu">
                      {selectedOrder.customerInfo?.postalCode || selectedOrder.shippingAddress?.zipCode || "-"}
                    </Descriptions.Item>
                    <Descriptions.Item label="Ülke">
                      {selectedOrder.customerInfo?.country || selectedOrder.shippingAddress?.country || "Türkiye"}
                    </Descriptions.Item>
                  </Descriptions>
                </Card>
              </Col>
            </Row>

            {/* Fatura Adresi (Eğer teslimat adresinden farklıysa) */}
            {selectedOrder.billingAddress && (
              selectedOrder.billingAddress.address !== selectedOrder.shippingAddress?.address ||
              selectedOrder.billingAddress.firstName !== selectedOrder.shippingAddress?.firstName
            ) && (
              <Card title="Fatura Adresi" size="small" style={{ marginBottom: 16 }}>
                <Descriptions bordered column={2} size="small">
                  <Descriptions.Item label="Ad Soyad">
                    {`${selectedOrder.billingAddress.firstName || ""} ${selectedOrder.billingAddress.lastName || ""}`.trim() || "-"}
                  </Descriptions.Item>
                  <Descriptions.Item label="E-posta">
                    {selectedOrder.billingAddress.email || "-"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Telefon">
                    {selectedOrder.billingAddress.phone || "-"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Adres">
                    {selectedOrder.billingAddress.address || "-"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Şehir">
                    {selectedOrder.billingAddress.city || "-"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Posta Kodu">
                    {selectedOrder.billingAddress.zipCode || "-"}
                  </Descriptions.Item>
                </Descriptions>
              </Card>
            )}

            {/* Ürün Listesi */}
            <Card title="Sipariş Edilen Ürünler" size="small" style={{ marginBottom: 16 }}>
              <Table
                dataSource={selectedOrder.products || selectedOrder.items || []}
                rowKey={(record, index) => record._id || record.id || `product-${index}`}
                pagination={false}
                columns={[
                  {
                    title: "Ürün",
                    dataIndex: "name",
                    key: "name",
                    render: (name, record) => (
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        {record.image && (
                          <img 
                            src={record.image} 
                            alt={name}
                            style={{ width: 40, height: 40, objectFit: 'cover', marginRight: 8, borderRadius: 4 }}
                            onError={(e) => { e.target.style.display = 'none'; }}
                          />
                        )}
                        <div>
                          <div style={{ fontWeight: 500 }}>{name}</div>
                          {record.sku && <div style={{ fontSize: 11, color: '#999' }}>SKU: {record.sku}</div>}
                        </div>
                      </div>
                    ),
                  },
                  {
                    title: "Beden",
                    dataIndex: "selectedSize",
                    key: "selectedSize",
                    render: (size) => size ? <Tag color="blue">{size}</Tag> : "-",
                    width: 80,
                  },
                  {
                    title: "Renk",
                    dataIndex: "selectedColor",
                    key: "selectedColor",
                    render: (color) => color ? <Tag color="green">{color}</Tag> : "-",
                    width: 80,
                  },
                  {
                    title: "Adet",
                    dataIndex: "quantity",
                    key: "quantity",
                    align: "center",
                    width: 60,
                  },
                  {
                    title: "Birim Fiyat",
                    dataIndex: "price",
                    key: "price",
                    render: (price) => `₺${(price || 0).toLocaleString('tr-TR', { minimumFractionDigits: 2 })}`,
                    align: "right",
                    width: 100,
                  },
                  {
                    title: "Toplam",
                    key: "total",
                    render: (_, record) => {
                      const total = (record.price || 0) * (record.quantity || 0);
                      return `₺${total.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}`;
                    },
                    align: "right",
                    width: 100,
                  },
                ]}
                summary={(pageData) => {
                  const totalAmount = pageData.reduce((sum, record) => {
                    return sum + ((record.price || 0) * (record.quantity || 0));
                  }, 0);
                  
                  return (
                    <Table.Summary.Row>
                      <Table.Summary.Cell index={0} colSpan={4}>
                        <Text strong>Toplam</Text>
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={1} align="right">
                        <Text strong>{pageData.reduce((sum, record) => sum + (record.quantity || 0), 0)} adet</Text>
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={2} align="right">
                        <Text strong style={{ color: '#52c41a' }}>
                          ₺{totalAmount.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
                        </Text>
                      </Table.Summary.Cell>
                    </Table.Summary.Row>
                  );
                }}
              />
            </Card>

            {/* Ödeme ve Sipariş Bilgileri */}
            <Row gutter={16} style={{ marginBottom: 16 }}>
              <Col span={12}>
                <Card title="Ödeme Bilgileri" size="small">
                  <Descriptions bordered column={1} size="small">
                    <Descriptions.Item label="Ödeme Yöntemi">
                      {selectedOrder.paymentMethod === "credit_card"
                        ? "Kredi Kartı"
                        : selectedOrder.paymentMethod === "paypal"
                        ? "PayPal"
                        : selectedOrder.paymentMethod === "bank_transfer"
                        ? "Banka Havalesi"
                        : selectedOrder.paymentMethod === "cash_on_delivery"
                        ? "Kapıda Ödeme"
                        : selectedOrder.paymentMethod || "-"}
                    </Descriptions.Item>
                    <Descriptions.Item label="Ödeme Durumu">
                      <Tag color={
                        selectedOrder.paymentStatus === 'paid' ? 'green' :
                        selectedOrder.paymentStatus === 'failed' ? 'red' :
                        selectedOrder.paymentStatus === 'refunded' ? 'purple' : 'orange'
                      }>
                        {selectedOrder.paymentStatus === 'paid' ? 'Ödendi' :
                         selectedOrder.paymentStatus === 'failed' ? 'Başarısız' :
                         selectedOrder.paymentStatus === 'refunded' ? 'İade Edildi' :
                         selectedOrder.paymentStatus === 'pending' ? 'Beklemede' : 'Bilinmiyor'}
                      </Tag>
                    </Descriptions.Item>
                    {selectedOrder.subtotal && (
                      <Descriptions.Item label="Ara Toplam">
                        ₺{(selectedOrder.subtotal || 0).toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
                      </Descriptions.Item>
                    )}
                    {selectedOrder.tax && selectedOrder.tax > 0 && (
                      <Descriptions.Item label="KDV">
                        ₺{(selectedOrder.tax || 0).toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
                      </Descriptions.Item>
                    )}
                    {selectedOrder.shippingCost && selectedOrder.shippingCost > 0 && (
                      <Descriptions.Item label="Kargo Ücreti">
                        ₺{(selectedOrder.shippingCost || 0).toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
                      </Descriptions.Item>
                    )}
                    {selectedOrder.discount && selectedOrder.discount > 0 && (
                      <Descriptions.Item label="İndirim">
                        -₺{(selectedOrder.discount || 0).toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
                      </Descriptions.Item>
                    )}
                    <Descriptions.Item label="Genel Toplam">
                      <Text strong style={{ color: '#52c41a', fontSize: 16 }}>
                        ₺{(selectedOrder.total || 0).toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
                      </Text>
                    </Descriptions.Item>
                  </Descriptions>
                </Card>
              </Col>
              <Col span={12}>
                <Card title="Sipariş Durumu" size="small">
                  <div style={{ marginBottom: 16 }}>
                    <Text strong>Durum Değiştir:</Text>
                                         <Select
                       value={selectedOrder.status}
                       onChange={(value) => handleStatusChange(selectedOrder._id || selectedOrder.id, value)}
                       style={{ width: '100%', marginTop: 8 }}
                     >
                      <Option value="pending">Beklemede</Option>
                      <Option value="processing">İşleniyor</Option>
                      <Option value="shipped">Kargoya Verildi</Option>
                      <Option value="delivered">Teslim Edildi</Option>
                      <Option value="completed">Tamamlandı</Option>
                      <Option value="cancelled">İptal Edildi</Option>
                    </Select>
                  </div>
                  
                  <Descriptions bordered column={1} size="small">
                    <Descriptions.Item label="Sipariş Tarihi">
                      {selectedOrder.createdAt ? 
                        new Date(selectedOrder.createdAt).toLocaleString("tr-TR") : 
                        selectedOrder.orderDate ? 
                        new Date(selectedOrder.orderDate).toLocaleString("tr-TR") : "-"}
                    </Descriptions.Item>
                    <Descriptions.Item label="Son Güncelleme">
                      {selectedOrder.updatedAt ? 
                        new Date(selectedOrder.updatedAt).toLocaleString("tr-TR") : "-"}
                    </Descriptions.Item>
                    {selectedOrder.trackingNumber && (
                      <Descriptions.Item label="Kargo Takip No">
                        <Text copyable>{selectedOrder.trackingNumber}</Text>
                      </Descriptions.Item>
                    )}
                    {selectedOrder.estimatedDelivery && (
                      <Descriptions.Item label="Tahmini Teslimat">
                        {new Date(selectedOrder.estimatedDelivery).toLocaleDateString("tr-TR")}
                      </Descriptions.Item>
                    )}
                  </Descriptions>
                </Card>
              </Col>
            </Row>

            {/* Sipariş Notları */}
            {selectedOrder.notes && (
              <Card title="Sipariş Notları" size="small" style={{ marginBottom: 16 }}>
                <Text style={{ fontSize: 14, color: '#666' }}>{selectedOrder.notes}</Text>
              </Card>
            )}

            {/* Sipariş Timeline */}
            <Card title="Sipariş Geçmişi" size="small">
              <Timeline>
                <Timeline.Item dot={<CheckCircleOutlined />} color="green">
                  <div>
                    <Text strong>Sipariş Oluşturuldu</Text>
                    <br />
                    <Text type="secondary">
                      {selectedOrder.createdAt ? 
                        new Date(selectedOrder.createdAt).toLocaleString("tr-TR") : 
                        "Tarih bilgisi yok"}
                    </Text>
                  </div>
                </Timeline.Item>
                
                {selectedOrder.status !== 'pending' && (
                  <Timeline.Item 
                    dot={selectedOrder.status === 'cancelled' ? <CloseCircleOutlined /> : <ClockCircleOutlined />}
                    color={selectedOrder.status === 'cancelled' ? 'red' : 'blue'}
                  >
                    <div>
                      <Text strong>
                        {selectedOrder.status === 'processing' ? 'Sipariş İşleniyor' :
                         selectedOrder.status === 'shipped' ? 'Kargoya Verildi' :
                         selectedOrder.status === 'delivered' ? 'Teslim Edildi' :
                         selectedOrder.status === 'completed' ? 'Sipariş Tamamlandı' :
                         selectedOrder.status === 'cancelled' ? 'Sipariş İptal Edildi' :
                         'Durum Güncellendi'}
                      </Text>
                      <br />
                      <Text type="secondary">
                        {selectedOrder.updatedAt ? 
                          new Date(selectedOrder.updatedAt).toLocaleString("tr-TR") : 
                          "Tarih bilgisi yok"}
                      </Text>
                    </div>
                  </Timeline.Item>
                )}
              </Timeline>
            </Card>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default OrdersPage;
