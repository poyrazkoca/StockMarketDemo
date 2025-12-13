/**
 * Subscriber - Receives and processes stock price updates
 */
export class Subscriber {
    constructor(id, name, broker) {
        this.id = id;
        this.name = name;
        this.broker = broker;
        this.receivedMessages = [];
        this.updateCallback = null;
    }

    /**
     * Set callback function to be called when message is received
     * @param {Function} callback - Callback function
     */
    setUpdateCallback(callback) {
        this.updateCallback = callback;
    }

    /**
     * Receive a message from the broker
     * @param {string} topic - The topic (stock symbol)
     * @param {Object} message - The message data
     */
    receive(topic, message) {
        this.receivedMessages.push({
            topic,
            message,
            receivedAt: new Date().toISOString()
        });

        // Keep only last 50 messages
        if (this.receivedMessages.length > 50) {
            this.receivedMessages.shift();
        }

        // Call update callback if set
        if (this.updateCallback) {
            this.updateCallback(topic, message);
        }

        console.log(`Subscriber ${this.name} (${this.id}) received update for ${topic}:`, message);
    }

    /**
     * Subscribe to a topic
     * @param {string} topic - The topic to subscribe to
     */
    subscribe(topic) {
        this.broker.subscribe(topic, this);
    }

    /**
     * Unsubscribe from a topic
     * @param {string} topic - The topic to unsubscribe from
     */
    unsubscribe(topic) {
        this.broker.unsubscribe(topic, this);
    }

    /**
     * Get message history
     * @returns {Array} Array of received messages
     */
    getMessageHistory() {
        return this.receivedMessages;
    }
}

