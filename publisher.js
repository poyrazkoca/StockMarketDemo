/**
 * Publisher - Publishes Stock Price Updates to the Broker
 * 
 * The Publisher component in the Publish-Subscribe pattern is responsible for:
 * 1. Generating stock price updates at regular intervals
 * 2. Publishing messages to the broker without knowing who will receive them
 * 3. Maintaining independence from subscribers (decoupled design)
 * 
 * This class demonstrates:
 * - Asynchronous message generation (using setInterval)
 * - Topic-based publishing (each publisher publishes to a specific stock symbol)
 * - Decoupled communication (publisher only interacts with the broker)
 * 
 * Architecture Pattern: Publish-Subscribe
 * Publisher -> Broker -> Subscribers (one-to-many communication)
 */
export class Publisher {
    /**
     * Constructor - Initialize a publisher for a specific stock symbol
     * 
     * @param {Broker} broker - The central message broker instance
     * @param {string} symbol - The stock symbol (acts as topic in pub-sub pattern)
     */
    constructor(broker, symbol) {
        this.broker = broker; // Reference to the central broker
        this.symbol = symbol; // Stock symbol (topic identifier)
        this.currentPrice = 100.00; // Starting price for simulation
        this.updateInterval = null; // Reference to the interval timer
    }

    /**
     * Start Publishing Price Updates at Regular Intervals
     * 
     * This method initiates asynchronous message publishing using JavaScript's setInterval.
     * The publisher generates and publishes messages periodically without blocking,
     * demonstrating asynchronous, message-driven communication.
     * 
     * Key aspects:
     * - Asynchronous: Uses setInterval for non-blocking periodic updates
     * - Message-driven: Each update triggers a message publication
     * - Decoupled: Publisher doesn't know who receives the messages
     * 
     * @param {number} intervalMs - Update interval in milliseconds (default: 2000ms)
     */
    startPublishing(intervalMs = 2000) {
        // Clear any existing interval to prevent duplicates
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
        }

        /**
         * Set up periodic message publishing
         * setInterval creates an asynchronous timer that calls publishUpdate()
         * at regular intervals, demonstrating asynchronous message generation
         */
        this.updateInterval = setInterval(() => {
            this.publishUpdate();
        }, intervalMs);

        // Publish initial update immediately to show current state
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
     * Generate and Publish a Price Update
     * 
     * This method creates a stock price update message and publishes it to the broker.
     * The broker then distributes this message to all subscribed subscribers asynchronously.
     * 
     * This demonstrates:
     * - Message creation: Structured data with symbol, price, timestamp, and change
     * - Topic-based publishing: Message is published to the stock symbol topic
     * - Asynchronous distribution: Broker handles message routing to subscribers
     * 
     * Message Structure:
     * - symbol: Stock symbol (topic identifier)
     * - price: Current stock price
     * - timestamp: ISO timestamp of the update
     * - change: Percentage change from previous price
     */
    publishUpdate() {
        /**
         * Simulate realistic price changes
         * Random change between -5% and +5% to simulate market volatility
         */
        const changePercent = (Math.random() * 10 - 5) / 100;
        this.currentPrice = Math.max(0.01, this.currentPrice * (1 + changePercent));
        
        /**
         * Create message object
         * This message will be broadcast to all subscribers subscribed to this symbol
         */
        const message = {
            symbol: this.symbol,
            price: parseFloat(this.currentPrice.toFixed(2)),
            timestamp: new Date().toISOString(),
            change: parseFloat((changePercent * 100).toFixed(2))
        };

        /**
         * Publish message to broker
         * The broker handles asynchronous distribution to all subscribers
         * Publisher doesn't need to know who receives the message (decoupled)
         */
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

