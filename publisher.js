/**
 * Publisher - Publishes stock price updates to the broker
 */
export class Publisher {
    constructor(broker, symbol) {
        this.broker = broker;
        this.symbol = symbol;
        this.currentPrice = 100.00; // Starting price
        this.updateInterval = null;
    }

    /**
     * Start publishing price updates at regular intervals
     * @param {number} intervalMs - Update interval in milliseconds
     */
    startPublishing(intervalMs = 2000) {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
        }

        this.updateInterval = setInterval(() => {
            this.publishUpdate();
        }, intervalMs);

        // Publish initial update
        this.publishUpdate();
    }

    /**
     * Stop publishing updates
     */
    stopPublishing() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
            this.updateInterval = null;
        }
    }

    /**
     * Generate and publish a price update
     */
    publishUpdate() {
        // Simulate price change (-5% to +5%)
        const changePercent = (Math.random() * 10 - 5) / 100;
        this.currentPrice = Math.max(0.01, this.currentPrice * (1 + changePercent));
        
        const message = {
            symbol: this.symbol,
            price: parseFloat(this.currentPrice.toFixed(2)),
            timestamp: new Date().toISOString(),
            change: parseFloat((changePercent * 100).toFixed(2))
        };

        this.broker.publish(this.symbol, message);
    }

    /**
     * Manually set a price (for testing)
     * @param {number} price - New price
     */
    setPrice(price) {
        this.currentPrice = price;
        this.publishUpdate();
    }
}

