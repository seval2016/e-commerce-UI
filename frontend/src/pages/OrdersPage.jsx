import React, { useState } from 'react';

const OrdersPage = () => {
  const [user] = useState(() => {
    const userData = localStorage.getItem("user");
    return userData ? JSON.parse(userData) : null;
  });

  // Mock sipariş verisi
  const [orders] = useState([
    {
      id: 'ORD-2024-001',
      date: '2024-01-15',
      status: 'delivered',
      total: 299.99,
      items: [
        { name: 'Ürün 1', quantity: 1, price: 199.99 },
        { name: 'Ürün 2', quantity: 2, price: 50.00 }
      ]
    },
    {
      id: 'ORD-2024-002',
      date: '2024-01-20',
      status: 'shipped',
      total: 149.99,
      items: [
        { name: 'Ürün 3', quantity: 1, price: 149.99 }
      ]
    },
    {
      id: 'ORD-2024-003',
      date: '2024-01-25',
      status: 'processing',
      total: 89.99,
      items: [
        { name: 'Ürün 4', quantity: 1, price: 89.99 }
      ]
    }
  ]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'shipped': return 'bg-blue-100 text-blue-800';
      case 'processing': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'delivered': return 'Teslim Edildi';
      case 'shipped': return 'Kargoda';
      case 'processing': return 'Hazırlanıyor';
      case 'cancelled': return 'İptal Edildi';
      default: return 'Bilinmiyor';
    }
  };

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto text-center">
          <h1 className="text-2xl font-bold mb-4">Giriş Yapın</h1>
          <p className="text-gray-600 mb-6">Siparişlerinizi görüntülemek için giriş yapmanız gerekiyor.</p>
          <a href="/auth" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            Giriş Yap
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Siparişlerim</h1>
          <p className="text-gray-600">Geçmiş siparişlerinizi görüntüleyin ve takip edin</p>
        </div>

        {/* Orders List */}
        {orders.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">
              <i className="bi bi-box"></i>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Henüz sipariş yok</h3>
            <p className="text-gray-600 mb-6">İlk siparişinizi vermek için alışverişe başlayın.</p>
            <a
              href="/shop"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
            >
              <i className="bi bi-shop"></i>
              Alışverişe Başla
            </a>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                {/* Order Header */}
                <div className="px-6 py-4 bg-gray-50 border-b flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <div className="mb-2 sm:mb-0">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Sipariş #{order.id}
                    </h3>
                    <p className="text-sm text-gray-600">
                      Sipariş Tarihi: {new Date(order.date).toLocaleDateString('tr-TR')}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                      {getStatusText(order.status)}
                    </span>
                    <span className="text-lg font-bold text-gray-900">
                      {order.total.toLocaleString()} ₺
                    </span>
                  </div>
                </div>

                {/* Order Items */}
                <div className="px-6 py-4">
                  <div className="space-y-3">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <div>
                          <span className="font-medium text-gray-900">{item.name}</span>
                          <span className="text-gray-600 ml-2">x{item.quantity}</span>
                        </div>
                        <span className="font-medium text-gray-900">
                          {item.price.toLocaleString()} ₺
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order Actions */}
                <div className="px-6 py-4 bg-gray-50 border-t flex gap-3">
                  <button className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors">
                    Detayları Görüntüle
                  </button>
                  {order.status === 'delivered' && (
                    <button className="text-green-600 hover:text-green-700 text-sm font-medium transition-colors">
                      Tekrar Sipariş Ver
                    </button>
                  )}
                  {order.status === 'shipped' && (
                    <button className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors">
                      Kargo Takip
                    </button>
                  )}
                  {order.status === 'processing' && (
                    <button className="text-red-600 hover:text-red-700 text-sm font-medium transition-colors">
                      İptal Et
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Order Summary */}
        <div className="mt-8 bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Sipariş Özeti</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{orders.length}</div>
              <div className="text-sm text-gray-600">Toplam Sipariş</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {orders.filter(o => o.status === 'delivered').length}
              </div>
              <div className="text-sm text-gray-600">Teslim Edildi</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {orders.reduce((sum, order) => sum + order.total, 0).toLocaleString()} ₺
              </div>
              <div className="text-sm text-gray-600">Toplam Harcama</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrdersPage; 