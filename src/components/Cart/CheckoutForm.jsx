import { useState } from "react";
import { useCart } from "../../context/CartContext.jsx";
import { useData } from "../../context/DataContext.jsx";
import { message } from "antd";
import Button from "../common/Button";
import Input from "../common/Input";

const CheckoutForm = ({ onClose }) => {
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
    paymentMethod: "creditCard",
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
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

  const validateCardData = () => {
    if (formData.paymentMethod === 'creditCard') {
      if (!cardData.cardNumber.replace(/\s/g, '').match(/^\d{16}$/)) {
        message.error("Geçerli bir kart numarası girin!");
        return false;
      }
      if (!cardData.cardHolder.trim()) {
        message.error("Kart sahibi adını girin!");
        return false;
      }
      if (!cardData.expiryMonth || !cardData.expiryYear) {
        message.error("Son kullanma tarihini girin!");
        return false;
      }
      if (!cardData.cvv.match(/^\d{3,4}$/)) {
        message.error("Geçerli bir CVV girin!");
        return false;
      }

      // Son kullanma tarihi kontrolü
      const currentYear = new Date().getFullYear() % 100;
      const currentMonth = new Date().getMonth() + 1;
      const expiryYear = parseInt(cardData.expiryYear);
      const expiryMonth = parseInt(cardData.expiryMonth);

      if (expiryYear < currentYear || (expiryYear === currentYear && expiryMonth < currentMonth)) {
        message.error("Kartınızın son kullanma tarihi geçmiş!");
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (cartItems.length === 0) {
      message.warning("Sepetiniz boş!");
      return;
    }

    // Form validasyonu
    const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'address', 'city', 'postalCode'];
    const missingFields = requiredFields.filter(field => !formData[field]);
    
    if (missingFields.length > 0) {
      message.error("Lütfen tüm zorunlu alanları doldurun!");
      return;
    }

    // Kredi kartı validasyonu
    if (!validateCardData()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Sipariş objesi oluştur
      const order = {
        id: Date.now().toString(),
        customerInfo: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          postalCode: formData.postalCode,
          country: formData.country
        },
        items: cartItems,
        total: getCartTotal(),
        status: "pending",
        paymentMethod: formData.paymentMethod,
        paymentInfo: formData.paymentMethod === 'creditCard' ? {
          cardNumber: cardData.cardNumber.replace(/\s/g, '').slice(-4), // Sadece son 4 haneyi sakla
          cardHolder: cardData.cardHolder,
          expiryDate: `${cardData.expiryMonth}/${cardData.expiryYear}`
        } : null,
        notes: formData.notes,
        orderDate: new Date().toISOString(),
        orderNumber: `ORD-${Date.now()}`
      };

      // Admin paneline sipariş ekle
      addOrder(order);
      
      // Sepeti temizle
      clearCart();
      
      message.success("Siparişiniz başarıyla oluşturuldu! Sipariş numaranız: " + order.orderNumber);
      
      // Formu kapat
      onClose();
      
    } catch (error) {
      console.error('Sipariş oluşturma hatası:', error);
      message.error("Sipariş oluşturulurken bir hata oluştu!");
    } finally {
      setIsSubmitting(false);
    }
  };

  const subTotal = getCartTotal();
  const shipping = 15; // Sabit kargo ücreti
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
                  E-posta * <span className="text-red-500">*</span>
                </label>
                <Input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
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
                  <option value="creditCard">Kredi Kartı</option>
                  <option value="bankTransfer">Banka Havalesi</option>
                  <option value="cashOnDelivery">Kapıda Ödeme</option>
                </select>
              </div>

              {/* Kredi Kartı Bilgileri */}
              {formData.paymentMethod === 'creditCard' && (
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
                  <span className="text-gray-600">Kargo</span>
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
    </div>
  );
};

export default CheckoutForm; 