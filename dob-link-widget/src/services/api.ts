// Simple API service for widget analytics and tracking
class ApiService {
  private baseUrl: string;

  constructor() {
    const env = import.meta.env.VITE_ENVIRONMENT || 'local';
    if (env === 'production') {
      this.baseUrl = 'https://api.dobprotocol.com';
    } else {
      this.baseUrl = 'http://localhost:3001';
    }
  }

  async trackWidgetView(hash: string, domain: string) {
    try {
      // In production, this would send to analytics service
      console.log('Widget view tracked:', { hash, domain });
    } catch (error) {
      console.error('Failed to track widget view:', error);
    }
  }

  async trackWalletConnect(hash: string, domain: string) {
    try {
      // In production, this would send to analytics service
      console.log('Wallet connect tracked:', { hash, domain });
    } catch (error) {
      console.error('Failed to track wallet connect:', error);
    }
  }

  async trackTransaction(hash: string, domain: string, amount: string, currency: string) {
    try {
      // In production, this would send to analytics service
      console.log('Transaction tracked:', { hash, domain, amount, currency });
    } catch (error) {
      console.error('Failed to track transaction:', error);
    }
  }

  async trackSale(hash: string, domain: string, amount: string, currency: string) {
    try {
      // In production, this would send to analytics service
      console.log('Sale tracked:', { hash, domain, amount, currency });
    } catch (error) {
      console.error('Failed to track sale:', error);
    }
  }

  async getPoolMetrics(tokenId: string): Promise<{ apr: number; tvl: number }> {
    try {

      const response = await fetch(`${this.baseUrl}/api/liquidity-pools/token/${tokenId}`);
      const data = await response.json();

      const apr = data?.liquidityPool?.rows[0].apy;
      const tvl = data?.liquidityPool?.rows[0].total_liquidity;

      return { apr, tvl };
    } catch (error) {
      console.error('Failed to get pool metrics:', error);
      return { apr: -1, tvl: -1 };
    }
  }

  async processPayment(amount: string, currency: string, tokenId: string, walletAddress: string) {
    try {
      // Mock payment processing - in production this would integrate with payment providers
      console.log('Processing payment:', { amount, currency, tokenId, walletAddress });

      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 2000));

      return {
        success: true,
        transactionId: `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        amount,
        currency,
        tokenId,
        walletAddress
      };
    } catch (error) {
      console.error('Payment processing failed:', error);
      throw error;
    }
  }
}

export default new ApiService(); 