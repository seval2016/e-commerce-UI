import React, { useState } from 'react';
import jsPDF from 'jspdf';
import 'jspdf-font';
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
  Badge
} from 'antd';
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
  DownloadOutlined
} from '@ant-design/icons';
import { useData } from '../../context/DataContext.jsx';

const { Search } = Input;
const { Option } = Select;

const OrdersPage = () => {
  const { orders, updateOrder, deleteOrder } = useData();
  const [searchText, setSearchText] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const statusConfig = {
    pending: { color: 'orange', text: 'Beklemede', icon: <ClockCircleOutlined /> },
    processing: { color: 'blue', text: 'İşleniyor', icon: <CarOutlined /> },
    completed: { color: 'green', text: 'Tamamlandı', icon: <CheckCircleOutlined /> },
    cancelled: { color: 'red', text: 'İptal Edildi', icon: <CloseCircleOutlined /> }
  };

  // Ödeme durumu konfigürasyonu (gelecekte kullanım için)
  const _paymentStatusConfig = {
    pending: { color: 'orange', text: 'Beklemede' },
    paid: { color: 'green', text: 'Ödendi' },
    failed: { color: 'red', text: 'Başarısız' },
    refunded: { color: 'purple', text: 'İade Edildi' }
  };

  // Siparişleri tablo formatına çevir
  const tableData = orders.map(order => ({
    key: order.id,
    ...order, // Tüm orijinal veriyi koru
    orderNumber: order.orderNumber || order.id || `ORD-${order.id}`, // Sipariş numarası
    customer: {
      name: `${order.customerInfo?.firstName || ''} ${order.customerInfo?.lastName || ''}`,
      email: order.customerInfo?.email || '',
      phone: order.customerInfo?.phone || ''
    },
    products: order.products || order.items || [], // Hem yeni hem eski format desteği
    total: order.total || 0,
    orderDate: new Date(order.createdAt || order.orderDate).toLocaleString('tr-TR')
  }));

  const columns = [
    {
      title: 'Sipariş ID',
      dataIndex: 'orderNumber',
      key: 'orderNumber',
      render: (orderNumber) => <strong>{orderNumber}</strong>,
    },
    {
      title: 'Müşteri',
      dataIndex: 'customer',
      key: 'customer',
      render: (customer) => (
        <div>
          <div style={{ fontWeight: 500 }}>{customer.name}</div>
          <div style={{ fontSize: 12, color: '#666' }}>{customer.email}</div>
        </div>
      ),
    },
    {
      title: 'Ürünler',
      dataIndex: 'products',
      key: 'products',
      render: (products) => (
        <div>
          {products && products.length > 0 ? (
            products.map((product, index) => (
              <div key={index} style={{ fontSize: 12 }}>
                {product.name} x{product.quantity}
                {product.selectedSize && ` (${product.selectedSize})`}
                {product.selectedColor && ` - ${product.selectedColor}`}
              </div>
            ))
          ) : (
            <span style={{ color: '#999', fontSize: 12 }}>Ürün bilgisi yok</span>
          )}
        </div>
      ),
    },
    {
      title: 'Toplam',
      dataIndex: 'total',
      key: 'total',
      render: (total) => (
        <div style={{ fontWeight: 500, color: '#1890ff' }}>
          {total.toLocaleString()} ₺
        </div>
      ),
      sorter: (a, b) => a.total - b.total,
    },
    {
      title: 'Durum',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        const config = statusConfig[status];
        return (
          <Tag color={config.color} icon={config.icon}>
            {config.text}
          </Tag>
        );
      },
    },
    {
      title: 'Ödeme',
      dataIndex: 'paymentMethod',
      key: 'paymentMethod',
      render: (paymentMethod) => {
        const methodNames = {
          creditCard: 'Kredi Kartı',
          bankTransfer: 'Banka Havalesi',
          cashOnDelivery: 'Kapıda Ödeme'
        };
        return <span>{methodNames[paymentMethod] || paymentMethod}</span>;
      },
    },
    {
      title: 'Tarih',
      dataIndex: 'orderDate',
      key: 'orderDate',
      render: (orderDate) => (
        <div style={{ fontSize: 12 }}>
          {orderDate ? new Date(orderDate).toLocaleDateString('tr-TR') : '-'}
        </div>
      ),
      sorter: (a, b) => new Date(a.orderDate || 0) - new Date(b.orderDate || 0),
    },
    {
      title: 'İşlemler',
      key: 'actions',
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
            onConfirm={() => handleDelete(record.id)}
            okText="Evet"
            cancelText="Hayır"
          >
            <Button
              type="link"
              size="small"
              danger
              icon={<DeleteOutlined />}
            >
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
    message.success('Sipariş başarıyla silindi!');
  };

  const handleModalOk = () => {
    setIsModalVisible(false);
    setSelectedOrder(null);
  };

  const handleStatusChange = (orderId, newStatus) => {
    updateOrder(orderId, { status: newStatus });
    message.success('Sipariş durumu güncellendi!');
  };

  // PDF indirme fonksiyonu
  const generatePDF = async (order) => {
    try {
      console.log('PDF oluşturma başladı:', order);
      message.loading('PDF oluşturuluyor...', 0);
      
      // PDF oluştur ve Türkçe font yükle
      const pdf = new jsPDF();
      
      // Türkçe karakterleri destekleyen font ayarları
      pdf.setFont('helvetica');
      
      // Başlık
      pdf.setFontSize(20);
      pdf.text('FATURA', 105, 20, { align: 'center' });
      
      // Sipariş bilgileri
      pdf.setFontSize(12);
      pdf.text(`Sipariş No: ${order.orderNumber}`, 20, 40);
      pdf.text(`Tarih: ${new Date(order.createdAt).toLocaleDateString('tr-TR')}`, 20, 50);
      
      // Müşteri bilgileri
      pdf.setFontSize(14);
      pdf.text('Müşteri Bilgileri', 20, 70);
      pdf.setFontSize(10);
      
      // Türkçe karakterleri güvenli hale getir
      const safeText = (text) => {
        if (!text) return '-';
        return text
          .replace(/ğ/g, 'g')
          .replace(/Ğ/g, 'G')
          .replace(/ü/g, 'u')
          .replace(/Ü/g, 'U')
          .replace(/ş/g, 's')
          .replace(/Ş/g, 'S')
          .replace(/ı/g, 'i')
          .replace(/İ/g, 'I')
          .replace(/ö/g, 'o')
          .replace(/Ö/g, 'O')
          .replace(/ç/g, 'c')
          .replace(/Ç/g, 'C');
      };
      
      pdf.text(`Ad Soyad: ${safeText(order.customerInfo?.firstName || '')} ${safeText(order.customerInfo?.lastName || '')}`, 20, 80);
      pdf.text(`E-posta: ${order.customerInfo?.email || '-'}`, 20, 90);
      pdf.text(`Telefon: ${order.customerInfo?.phone || '-'}`, 20, 100);
      pdf.text(`Adres: ${safeText(order.customerInfo?.address || '-')}`, 20, 110);
      pdf.text(`Şehir: ${safeText(order.customerInfo?.city || '-')}`, 20, 120);
      pdf.text(`Posta Kodu: ${order.customerInfo?.postalCode || '-'}`, 20, 130);
      
      // Ürünler
      pdf.setFontSize(14);
      pdf.text('Urunler', 20, 150);
      pdf.setFontSize(10);
      
      let yPosition = 160;
      order.products?.forEach((product, index) => {
        if (yPosition > 250) {
          pdf.addPage();
          yPosition = 20;
        }
        
        pdf.text(`${index + 1}. ${safeText(product.name)}`, 20, yPosition);
        pdf.text(`   Beden: ${product.selectedSize || '-'} | Renk: ${safeText(product.selectedColor || '-')}`, 25, yPosition + 5);
        pdf.text(`   Adet: ${product.quantity} | Fiyat: ₺${product.price?.toLocaleString()} | Toplam: ₺${(product.price * product.quantity)?.toLocaleString()}`, 25, yPosition + 10);
        yPosition += 20;
      });
      
      // Toplam
      pdf.setFontSize(14);
      pdf.text(`Toplam: ₺${order.total?.toLocaleString() || '0'}`, 20, yPosition + 10);
      
      // Ödeme bilgileri
      pdf.setFontSize(12);
      const paymentMethod = order.paymentMethod === 'creditCard' ? 'Kredi Karti' : 
                           order.paymentMethod === 'bankTransfer' ? 'Banka Havalesi' : 
                           order.paymentMethod === 'cashOnDelivery' ? 'Kapida Odeme' : 
                           order.paymentMethod;
      
      pdf.text(`Odeme Yontemi: ${paymentMethod}`, 20, yPosition + 25);
      
      // Alt bilgi
      pdf.setFontSize(10);
      pdf.text(`Bu fatura ${new Date().toLocaleDateString('tr-TR')} tarihinde olusturulmustur.`, 20, yPosition + 40);
      pdf.text('Tesekkur ederiz!', 20, yPosition + 50);
      
      // PDF'i indir
      const fileName = `Fatura-${order.orderNumber}-${new Date().toISOString().split('T')[0]}.pdf`;
      pdf.save(fileName);
      
      message.destroy();
      message.success('PDF başarıyla indirildi!');
      console.log('PDF başarıyla oluşturuldu:', fileName);
      
    } catch (error) {
      message.destroy();
      console.error('PDF oluşturma hatası:', error);
      message.error('PDF oluşturulurken bir hata oluştu!');
    }
  };

  // İstatistikler
  const totalOrders = orders.length;
  const pendingOrders = orders.filter(order => order.status === 'pending').length;
  const completedOrders = orders.filter(order => order.status === 'completed').length;
  const totalRevenue = orders.reduce((sum, order) => sum + (order.total || 0), 0);

  const filteredData = tableData.filter(order => {
    const searchLower = (searchText || '').toLowerCase();
    const orderNumber = String(order.orderNumber || '').toLowerCase();
    const customerName = String(order.customer?.name || '').toLowerCase();
    const customerEmail = String(order.customer?.email || '').toLowerCase();
    
    return orderNumber.includes(searchLower) ||
           customerName.includes(searchLower) ||
           customerEmail.includes(searchLower);
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
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Bekleyen Sipariş"
              value={pendingOrders}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Tamamlanan Sipariş"
              value={completedOrders}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Toplam Gelir"
              value={totalRevenue}
              prefix={<DollarOutlined />}
              suffix="₺"
              valueStyle={{ color: '#52c41a' }}
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
            <Button icon={<ReloadOutlined />} onClick={() => window.location.reload()}>
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
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} / ${total} sipariş`,
          }}
          scroll={{ x: 1200 }}
        />
      </Card>

      {/* Sipariş Detay Modal */}
      <Modal
        title="Sipariş Detayları"
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalOk}
        width={800}
        footer={[
          <Button key="close" onClick={handleModalOk}>
            Kapat
          </Button>
        ]}
      >
        {selectedOrder && (
          <div>
            <Descriptions title="Müşteri Bilgileri" bordered column={2}>
              <Descriptions.Item label="Ad Soyad">
                {`${selectedOrder.customerInfo?.firstName || ''} ${selectedOrder.customerInfo?.lastName || ''}`.trim() || '-'}
              </Descriptions.Item>
              <Descriptions.Item label="E-posta">
                {selectedOrder.customerInfo?.email || '-'}
              </Descriptions.Item>
              <Descriptions.Item label="Telefon">
                {selectedOrder.customerInfo?.phone || '-'}
              </Descriptions.Item>
              <Descriptions.Item label="Adres">
                {selectedOrder.customerInfo?.address || '-'}
              </Descriptions.Item>
              <Descriptions.Item label="Şehir">
                {selectedOrder.customerInfo?.city || '-'}
              </Descriptions.Item>
              <Descriptions.Item label="Posta Kodu">
                {selectedOrder.customerInfo?.postalCode || '-'}
              </Descriptions.Item>
              <Descriptions.Item label="Ülke">
                {selectedOrder.customerInfo?.country || 'Türkiye'}
              </Descriptions.Item>
            </Descriptions>

            <div className="mt-6">
              <h4>Ürünler</h4>
              <Table
                dataSource={selectedOrder.products}
                rowKey="id"
                pagination={false}
                columns={[
                  {
                    title: 'Ürün',
                    dataIndex: 'name',
                    key: 'name',
                  },
                  {
                    title: 'Beden',
                    dataIndex: 'selectedSize',
                    key: 'selectedSize',
                    render: (size) => size || '-'
                  },
                  {
                    title: 'Renk',
                    dataIndex: 'selectedColor',
                    key: 'selectedColor',
                    render: (color) => color || '-'
                  },
                  {
                    title: 'Adet',
                    dataIndex: 'quantity',
                    key: 'quantity',
                  },
                  {
                    title: 'Fiyat',
                    dataIndex: 'price',
                    key: 'price',
                    render: (price) => `${price.toLocaleString()} ₺`
                  },
                  {
                    title: 'Toplam',
                    key: 'total',
                    render: (_, record) => `${(record.price * record.quantity).toLocaleString()} ₺`
                  }
                ]}
              />
            </div>

            <div className="mt-6">
              <h4>Sipariş Durumu</h4>
              <Select
                value={selectedOrder.status}
                onChange={(value) => handleStatusChange(selectedOrder.id, value)}
                style={{ width: 200 }}
              >
                <Option value="pending">Beklemede</Option>
                <Option value="processing">İşleniyor</Option>
                <Option value="completed">Tamamlandı</Option>
                <Option value="cancelled">İptal Edildi</Option>
              </Select>
            </div>

            {/* Ödeme Bilgileri */}
            {selectedOrder.paymentInfo && (
              <div className="mt-6">
                <h4>Ödeme Bilgileri</h4>
                <Descriptions bordered column={2} size="small">
                  <Descriptions.Item label="Ödeme Yöntemi">
                    {selectedOrder.paymentMethod === 'creditCard' ? 'Kredi Kartı' : 
                     selectedOrder.paymentMethod === 'bankTransfer' ? 'Banka Havalesi' : 
                     selectedOrder.paymentMethod === 'cashOnDelivery' ? 'Kapıda Ödeme' : 
                     selectedOrder.paymentMethod}
                  </Descriptions.Item>
                  {selectedOrder.paymentInfo.cardNumber && (
                    <Descriptions.Item label="Kart Numarası">
                      **** **** **** {selectedOrder.paymentInfo.cardNumber}
                    </Descriptions.Item>
                  )}
                  {selectedOrder.paymentInfo.cardHolder && (
                    <Descriptions.Item label="Kart Sahibi">
                      {selectedOrder.paymentInfo.cardHolder}
                    </Descriptions.Item>
                  )}
                  {selectedOrder.paymentInfo.expiryDate && (
                    <Descriptions.Item label="Son Kullanma Tarihi">
                      {selectedOrder.paymentInfo.expiryDate}
                    </Descriptions.Item>
                  )}
                </Descriptions>
              </div>
            )}

            {/* Sipariş Özeti */}
            <div className="mt-6">
              <h4>Sipariş Özeti</h4>
              <Descriptions bordered column={2} size="small">
                <Descriptions.Item label="Sipariş Numarası">
                  {selectedOrder.orderNumber}
                </Descriptions.Item>
                <Descriptions.Item label="Sipariş Tarihi">
                  {new Date(selectedOrder.createdAt).toLocaleString('tr-TR')}
                </Descriptions.Item>
                <Descriptions.Item label="Toplam Tutar">
                  <strong className="text-lg text-green-600">
                    ₺{selectedOrder.total?.toLocaleString() || '0'}
                  </strong>
                </Descriptions.Item>
                <Descriptions.Item label="Ürün Sayısı">
                  {selectedOrder.products?.length || 0} adet
                </Descriptions.Item>
              </Descriptions>
            </div>

            {selectedOrder.notes && (
              <div className="mt-6">
                <h4>Sipariş Notları</h4>
                <p className="text-gray-600">{selectedOrder.notes}</p>
              </div>
            )}

            {/* Fatura Yazdırma Butonu */}
            <div className="mt-6 flex gap-2">
              <Button 
                type="primary" 
                icon={<PrinterOutlined />}
                onClick={() => window.print()}
              >
                Fatura Yazdır
              </Button>
              <Button 
                icon={<DownloadOutlined />}
                onClick={() => generatePDF(selectedOrder)}
              >
                PDF İndir
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default OrdersPage; 