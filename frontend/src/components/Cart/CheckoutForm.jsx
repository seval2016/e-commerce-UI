import { useState } from "react";
import { useCart } from "../../context/CartContext.jsx";
import { useData } from "../../context/DataContext.jsx";
import { message } from "antd";
import Button from "../common/Button";
import Input from "../common/Input";

const CheckoutForm = ({ onClose, shippingFee = 0, hasFastShipping = false }) => {
  const { cartItems, getCartTotal, clearCart } = useCart();
  const { addOrder } = useData();
  
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    country: "Türkiye",
    paymentMethod: "cash_on_delivery", // Varsayılan olarak kapıda ödeme
    notes: ""
  });

  const [cardData, setCardData] = useState({
    cardNumber: "",
    cardHolder: "",
    expiryMonth: "",
    expiryYear: "",
    cvv: ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Ödeme yöntemi değiştiğinde kredi kartı bilgilerini temizle
    if (name === 'paymentMethod') {
      // Kredi kartı bilgilerini temizle
      setCardData({
        cardNumber: "",
        cardHolder: "",
        expiryMonth: "",
        expiryYear: "",
        cvv: ""
      });
    }
  };

  const handleCardInputChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;

    // Kart numarası formatlaması
    if (name === 'cardNumber') {
      formattedValue = value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
      if (formattedValue.length > 19) formattedValue = formattedValue.slice(0, 19);
    }

    // CVV formatlaması
    if (name === 'cvv') {
      formattedValue = value.replace(/\D/g, '').slice(0, 4);
    }

    // Son kullanma tarihi formatlaması
    if (name === 'expiryMonth') {
      formattedValue = value.replace(/\D/g, '').slice(0, 2);
      if (parseInt(formattedValue) > 12) formattedValue = '12';
    }

    if (name === 'expiryYear') {
      formattedValue = value.replace(/\D/g, '').slice(0, 2);
    }

    setCardData(prev => ({
      ...prev,
      [name]: formattedValue
    }));
  };

  // Kredi kartı validasyonu (geçici olarak devre dışı)
  const _validateCardData = () => {



    
    if (formData.paymentMethod === 'credit_card') {
      // Kart numarası kontrolü
      const cardNumber = cardData.cardNumber.replace(/\s/g, '');

      if (!cardNumber.match(/^\d{16}$/)) {

        message.error("Geçerli bir kart numarası girin!");
        return false;
      }
      
      // Kart sahibi kontrolü

      if (!cardData.cardHolder.trim()) {

        message.error("Kart sahibi adını girin!");
        return false;
      }
      
      // Son kullanma tarihi kontrolü

      if (!cardData.expiryMonth || !cardData.expiryYear) {

        message.error("Son kullanma tarihini girin!");
        return false;
      }
      
      // CVV kontrolü

      if (!cardData.cvv.match(/^\d{3,4}$/)) {

        message.error("Geçerli bir CVV girin!");
        return false;
      }

      // Son kullanma tarihi kontrolü (geçici olarak devre dışı)
      // Gerçek implementasyon handleSubmit fonksiyonunda yapılıyor
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    



    
    if (cartItems.length === 0) {
      message.warning("Sepetiniz boş!");
      return;
    }

    // Form validasyonu - Zorunlu alanlar
    const requiredFields = [
      { field: 'firstName', label: 'Ad' },
      { field: 'lastName', label: 'Soyad' },
      { field: 'phone', label: 'Telefon' },
      { field: 'address', label: 'Adres' },
      { field: 'city', label: 'Şehir' },
      { field: 'postalCode', label: 'Posta Kodu' }
    ];
    
    const missingFields = requiredFields.filter(({ field }) => !formData[field] || formData[field].trim() === '');
    

    
    if (missingFields.length > 0) {
      const missingLabels = missingFields.map(({ label }) => label).join(', ');
      message.error(`Lütfen şu zorunlu alanları doldurun: ${missingLabels}`);
      return;
    }

    // Telefon numarası validasyonu
    const phoneRegex = /^[0-9\s\-+()]{10,}$/;
    if (!phoneRegex.test(formData.phone.replace(/\s/g, ''))) {
      message.error("Lütfen geçerli bir telefon numarası girin!");
      return;
    }

    // Posta kodu validasyonu
    if (!/^\d{5}$/.test(formData.postalCode.replace(/\s/g, ''))) {
      message.error("Lütfen 5 haneli geçerli bir posta kodu girin!");
      return;
    }

    // Email validasyonu (eğer email girilmişse)
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      message.error("Lütfen geçerli bir email adresi girin!");
      return;
    }

    // Kredi kartı validasyonu (sadece kredi kartı seçilmişse)
    if (formData.paymentMethod === 'credit_card') {
      const cardRequiredFields = [
        { field: 'cardNumber', label: 'Kart Numarası' },
        { field: 'cardHolder', label: 'Kart Sahibi' },
        { field: 'expiryMonth', label: 'Son Kullanma Ay' },
        { field: 'expiryYear', label: 'Son Kullanma Yıl' },
        { field: 'cvv', label: 'CVV' }
      ];
      
      const missingCardFields = cardRequiredFields.filter(({ field }) => !cardData[field] || cardData[field].trim() === '');
      
      if (missingCardFields.length > 0) {
        const missingLabels = missingCardFields.map(({ label }) => label).join(', ');
        message.error(`Lütfen şu kredi kartı alanlarını doldurun: ${missingLabels}`);
        return;
      }

      // Kart numarası kontrolü (16 haneli)
      const cardNumber = cardData.cardNumber.replace(/\s/g, '');
      if (!cardNumber.match(/^\d{16}$/)) {
        message.error("Lütfen 16 haneli geçerli bir kart numarası girin!");
        return;
      }

      // CVV kontrolü (3-4 haneli)
      if (!cardData.cvv.match(/^\d{3,4}$/)) {
        message.error("Lütfen geçerli bir CVV girin!");
        return;
      }

      // Son kullanma tarihi kontrolü - kartın son kullanma tarihini kontrol et
      const currentYear = new Date().getFullYear() % 100;
      const currentMonth = new Date().getMonth() + 1;
      const expiryYear = parseInt(cardData.expiryYear);
      const expiryMonth = parseInt(cardData.expiryMonth);
      
      if (expiryYear < currentYear || (expiryYear === currentYear && expiryMonth < currentMonth)) {
        message.error("Kartınızın son kullanma tarihi geçmiş! Lütfen geçerli bir tarih girin.");
        return;
      }
    }


    setIsSubmitting(true);

    try {
      // Sipariş objesi oluştur
      const orderId = Date.now().toString();
      const order = {
        id: orderId,
        orderNumber: `ORD-${orderId}`, // Sipariş numarası eklendi
        customerInfo: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email || '',
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          postalCode: formData.postalCode,
          country: formData.country || 'Türkiye'
        },
        products: cartItems, // items yerine products kullan
        total: total, // getCartTotal() yerine total kullan
        status: "pending",
        paymentMethod: formData.paymentMethod,
        paymentInfo: formData.paymentMethod === 'credit_card' ? {
          cardNumber: cardData.cardNumber.replace(/\s/g, '').slice(-4), // Sadece son 4 haneyi sakla
          cardHolder: cardData.cardHolder,
          expiryDate: `${cardData.expiryMonth}/${cardData.expiryYear}`
        } : null,
        notes: formData.notes || '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };



      // Admin paneline sipariş ekle
      const orderResult = await addOrder(order);
      
      if (orderResult.success) {
        // Sepeti temizle
        clearCart();
        
        // Success modal verilerini set et
        setOrderSuccess({
          orderNumber: order.orderNumber,
          total: total,
          customerName: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          phone: formData.phone
        });
        
        // Warning varsa göster
        if (orderResult.warning) {
          message.warning(orderResult.warning);
        } else {
          message.success("Siparişiniz başarıyla oluşturuldu!");
        }
        
        // Success modal'ını göster
        setShowSuccessModal(true);
      } else {
        throw new Error('Sipariş oluşturulamadı');
      }
      
    } catch{
      message.error("Sipariş oluşturulurken bir hata oluştu!");
    } finally {
      setIsSubmitting(false);
    }
  };

  const subTotal = getCartTotal();
  const shipping = shippingFee; // CartTotal'den gelen kargo ücreti
  const total = subTotal + shipping;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900">Sipariş Tamamla</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Müşteri Bilgileri */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Müşteri Bilgileri</h3>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ad * <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                    size="md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Soyad * <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                    size="md"
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  E-posta
                </label>
                <Input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="İsteğe bağlı"
                  size="md"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Telefon * <span className="text-red-500">*</span>
                </label>
                <Input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  size="md"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Adres * <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Şehir * <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    required
                    size="md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Posta Kodu * <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="text"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleInputChange}
                    required
                    size="md"
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ülke
                </label>
                <Input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  size="md"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ödeme Yöntemi
                </label>
                <select
                  name="paymentMethod"
                  value={formData.paymentMethod}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="credit_card">Kredi Kartı</option>
                  <option value="paypal">PayPal</option>
                  <option value="bank_transfer">Banka Havalesi</option>
                  <option value="cash_on_delivery">Kapıda Ödeme</option>
                </select>
              </div>

              {/* Kredi Kartı Bilgileri */}
              {formData.paymentMethod === 'credit_card' && (
                <div className="mb-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
                  <h4 className="text-md font-semibold text-gray-900 mb-3">Kredi Kartı Bilgileri</h4>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Kart Numarası * <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="text"
                      name="cardNumber"
                      value={cardData.cardNumber}
                      onChange={handleCardInputChange}
                      placeholder="1234 5678 9012 3456"
                      maxLength="19"
                      required
                      size="md"
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Kart Sahibi * <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="text"
                      name="cardHolder"
                      value={cardData.cardHolder}
                      onChange={handleCardInputChange}
                      placeholder="AD SOYAD"
                      required
                      size="md"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Ay * <span className="text-red-500">*</span>
                      </label>
                      <Input
                        type="text"
                        name="expiryMonth"
                        value={cardData.expiryMonth}
                        onChange={handleCardInputChange}
                        placeholder="MM"
                        maxLength="2"
                        required
                        size="md"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Yıl * <span className="text-red-500">*</span>
                      </label>
                      <Input
                        type="text"
                        name="expiryYear"
                        value={cardData.expiryYear}
                        onChange={handleCardInputChange}
                        placeholder="YY"
                        maxLength="2"
                        required
                        size="md"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        CVV * <span className="text-red-500">*</span>
                      </label>
                      <Input
                        type="text"
                        name="cvv"
                        value={cardData.cvv}
                        onChange={handleCardInputChange}
                        placeholder="123"
                        maxLength="4"
                        required
                        size="md"
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sipariş Notları
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Siparişinizle ilgili özel notlarınız..."
                />
              </div>
            </div>

            {/* Sipariş Özeti */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Sipariş Özeti</h3>
              
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <div className="space-y-2">
                  {cartItems.map((item) => (
                    <div key={item.cartItemId} className="flex justify-between items-center">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{item.name}</p>
                        <p className="text-xs text-gray-500">
                          {item.selectedSize && `Beden: ${item.selectedSize}`}
                          {item.selectedSize && item.selectedColor && " | "}
                          {item.selectedColor && `Renk: ${item.selectedColor}`}
                        </p>
                        <p className="text-xs text-gray-500">Adet: {item.quantity}</p>
                      </div>
                      <p className="text-sm font-medium text-gray-900">
                        ₺{(item.price * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Ara Toplam</span>
                  <span className="font-medium">₺{subTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">
                    Kargo {hasFastShipping && <span className="text-green-600">(Hızlı)</span>}
                  </span>
                  <span className="font-medium">₺{shipping.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-lg font-bold border-t border-gray-200 pt-2">
                  <span>Toplam</span>
                  <span className="text-primary-600">₺{total.toLocaleString()}</span>
                </div>
              </div>

              <div className="mt-6">
                <Button
                  type="submit"
                  disabled={isSubmitting || cartItems.length === 0}
                  variant="primary"
                  size="lg"
                  fullWidth
                >
                  {isSubmitting ? "Sipariş Oluşturuluyor..." : "Siparişi Tamamla"}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* Sipariş Başarı Modal'ı */}
      {showSuccessModal && orderSuccess && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[60]">
          <div className="bg-white rounded-lg max-w-md w-full p-6 text-center">
            {/* Başarı İkonu */}
            <div className="mb-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>

            {/* Başlık */}
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Siparişiniz Başarıyla Oluşturuldu!
            </h3>

            {/* Sipariş Detayları */}
            <div className="bg-gray-50 rounded-lg p-4 mb-4 text-left">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Sipariş Numarası:</span>
                  <span className="font-semibold">{orderSuccess.orderNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Müşteri:</span>
                  <span className="font-semibold">{orderSuccess.customerName}</span>
                </div>
                {orderSuccess.email && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">E-posta:</span>
                    <span className="font-semibold">{orderSuccess.email}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-600">Telefon:</span>
                  <span className="font-semibold">{orderSuccess.phone}</span>
                </div>
                <div className="flex justify-between border-t pt-2">
                  <span className="text-gray-600">Toplam Tutar:</span>
                  <span className="font-bold text-green-600">₺{orderSuccess.total.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Bilgi Mesajı */}
            <p className="text-gray-600 text-sm mb-6">
              Siparişiniz admin panelinde görüntülenebilir ve en kısa sürede işleme alınacaktır.
            </p>

            {/* Buton */}
            <Button
              onClick={() => {
                setShowSuccessModal(false);
                setOrderSuccess(null);
                onClose();
              }}
              className="w-full"
              variant="primary"
            >
              Tamam
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckoutForm; 
