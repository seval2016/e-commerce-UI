import React from 'react';
import Button from './Button';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError() {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
          <div className="max-w-md w-full text-center">
            {/* Error Icon */}
            <div className="mb-8">
              <div className="w-32 h-32 mx-auto bg-gradient-to-br from-red-500 to-pink-600 rounded-full flex items-center justify-center shadow-lg">
                <i className="bi bi-exclamation-triangle text-6xl text-white"></i>
              </div>
            </div>

            {/* Content */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  Bir Hata Oluştu
                </h1>
                <p className="text-lg text-gray-600 leading-relaxed">
                  Beklenmeyen bir hata oluştu. Lütfen sayfayı yenileyin veya ana sayfaya dönün.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  variant="primary" 
                  size="lg"
                  onClick={this.handleReload}
                >
                  <i className="bi bi-arrow-clockwise mr-2"></i>
                  Sayfayı Yenile
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  onClick={this.handleGoHome}
                >
                  <i className="bi bi-house-door mr-2"></i>
                  Ana Sayfa
                </Button>
              </div>

              {/* Error Details (Development Only) */}
              {import.meta.env.DEV && this.state.error && (
                <details className="mt-8 text-left bg-white p-4 rounded-lg border border-gray-200">
                  <summary className="cursor-pointer font-medium text-gray-700 mb-2">
                    Hata Detayları (Geliştirici Modu)
                  </summary>
                  <div className="text-sm text-gray-600 space-y-2">
                    <div>
                      <strong>Hata:</strong>
                      <pre className="mt-1 p-2 bg-gray-100 rounded text-xs overflow-x-auto">
                        {this.state.error.toString()}
                      </pre>
                    </div>
                    {this.state.errorInfo && (
                      <div>
                        <strong>Stack Trace:</strong>
                        <pre className="mt-1 p-2 bg-gray-100 rounded text-xs overflow-x-auto">
                          {this.state.errorInfo.componentStack}
                        </pre>
                      </div>
                    )}
                  </div>
                </details>
              )}
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary; 
