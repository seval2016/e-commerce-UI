const mongoose = require('mongoose');

const supportSchema = new mongoose.Schema({
  ticketId: {
    type: String,
    unique: true
  },
  customer: {
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    phone: {
      type: String
    },
    avatar: {
      type: String
    }
  },
  subject: {
    type: String,
    required: true,
    trim: true
  },
  message: {
    type: String,
    required: true
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  status: {
    type: String,
    enum: ['open', 'in_progress', 'resolved', 'closed'],
    default: 'open'
  },
  category: {
    type: String,
    enum: ['siparis', 'iade', 'teknik', 'kargo', 'genel'],
    default: 'genel'
  },
  assignedTo: {
    type: String,
    default: 'Destek Ekibi'
  },
  rating: {
    type: Number,
    min: 1,
    max: 5
  },
  responseTime: {
    type: String
  },
  responses: [{
    author: {
      name: String,
      role: String // 'customer' veya 'admin'
    },
    message: String,
    timestamp: {
      type: Date,
      default: Date.now
    },
    isInternal: {
      type: Boolean,
      default: false // Admin yorumları için
    }
  }],
  attachments: [{
    filename: String,
    url: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  tags: [String],
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Ticket ID otomatik oluştur
supportSchema.pre('save', async function(next) {
  if (this.isNew && !this.ticketId) {
    try {
      const count = await this.constructor.countDocuments();
      this.ticketId = `TKT-${String(count + 1).padStart(3, '0')}`;
    } catch (error) {
      console.error('Error generating ticketId:', error);
      return next(error);
    }
  }
  next();
});

// Virtual field - response time calculation
supportSchema.virtual('calculatedResponseTime').get(function() {
  if (this.responses && this.responses.length > 0) {
    const firstResponse = this.responses.find(r => r.author.role === 'admin');
    if (firstResponse) {
      const diffMs = firstResponse.timestamp - this.createdAt;
      const diffHours = Math.round(diffMs / (1000 * 60 * 60));
      return diffHours < 24 ? `${diffHours} saat` : `${Math.round(diffHours/24)} gün`;
    }
  }
  return this.responseTime || '-';
});

// Index'ler
supportSchema.index({ ticketId: 1 });
supportSchema.index({ status: 1 });
supportSchema.index({ priority: 1 });
supportSchema.index({ category: 1 });
supportSchema.index({ createdAt: -1 });
supportSchema.index({ 'customer.email': 1 });

module.exports = mongoose.model('Support', supportSchema); 