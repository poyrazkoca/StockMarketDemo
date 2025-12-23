/**
 * Stock Market Demo - Publish-Subscribe Architecture Implementation
 * 
 * This application demonstrates the Publish-Subscribe (Pub-Sub) architectural pattern
 * in the context of a stock market price update system. The pattern enables:
 * 
 * 1. Decoupled Communication: Publishers and Subscribers don't know about each other
 * 2. Asynchronous Messaging: Messages are broadcast asynchronously through the broker
 * 3. Scalability: Multiple subscribers can receive the same message simultaneously
 * 4. Dynamic Subscriptions: Subscribers can subscribe/unsubscribe at runtime
 * 
 * Architecture Components:
 * - Broker: Central message router that manages subscriptions and message distribution
 * - Publisher: Publishes stock price updates to specific topics (stock symbols)
 * - Subscriber: Receives updates for subscribed topics via the broker
 * 
 * Message Flow:
 * Publisher -> Broker -> All Subscribed Subscribers
 */

import { Broker } from './broker.js';
import { Publisher } from './publisher.js';
import { Subscriber } from './subscriber.js';

/**
 * Initialize the central message broker
 * The broker acts as the intermediary between publishers and subscribers,
 * managing subscriptions and routing messages asynchronously.
 */
const broker = new Broker();

/**
 * Application State Management
 * 
 * Publishers: Map of stock symbols to Publisher instances
 * Each publisher publishes price updates for a specific stock symbol (topic)
 */
const publishers = new Map();
let currentPublisher = null; // Currently active publisher for UI controls

/**
 * Subscribers: Map of subscriber IDs to Subscriber instances
 * Each subscriber can subscribe to multiple stock symbols (topics)
 */
let subscriberCounter = 0; // Counter for generating unique subscriber IDs
const subscribers = new Map();

/**
 * Initialize publishers for all available stocks
 * Each stock symbol acts as a topic in the publish-subscribe pattern
 */
const stockSymbols = ['AAPL', 'GOOGL', 'MSFT', 'TSLA', 'AMZN'];
stockSymbols.forEach(symbol => {
    const publisher = new Publisher(broker, symbol);
    publishers.set(symbol, publisher);
});

// Set default publisher for initial UI state
currentPublisher = publishers.get('AAPL');

/**
 * DOM Element References
 * These will be initialized when DOM is ready
 */
let startPublishingBtn, stopPublishingBtn, stockSymbolSelect;
let addSubscriberBtn, removeSubscriberBtn, subscriberSelect, topicSelect;
let subscribeBtn, unsubscribeBtn, publisherState, currentStock;
let latestUpdateContent, subscribersContainer;
let subscriberNameInput, defaultNamesSelect;

// Track subscriber creation order for proper removal
const subscriberCreationOrder = [];

/**
 * Add Subscriber Handler
 * Creates a new subscriber instance and adds it to the system
 * Demonstrates:
 * 1. Dynamic subscriber creation at runtime
 * 2. Callback-based message handling (asynchronous notification)
 * 3. Automatic subscription to current stock for demo purposes
 */
function handleAddSubscriber() {
    // Check if required elements are available
    if (!subscriberNameInput || !subscriberSelect || !subscribersContainer) {
        console.error('Required DOM elements not available for adding subscriber');
        return;
    }
    
    subscriberCounter++;
    
    // Get subscriber name from input or use default
    let subscriberName = subscriberNameInput.value.trim();
    if (!subscriberName) {
        subscriberName = `Subscriber ${subscriberCounter}`;
    }
    
    const subscriberId = `sub-${subscriberCounter}`;
    const subscriber = new Subscriber(
        subscriberId,
        subscriberName,
        broker
    );
    
    subscribers.set(subscriber.id, subscriber);
    subscriberCreationOrder.push(subscriber.id); // Track creation order
    
    /**
     * Set up update callback for asynchronous message handling
     * This callback is invoked whenever the subscriber receives a message
     * from the broker, demonstrating the asynchronous nature of the pattern
     */
    subscriber.setUpdateCallback((topic, message) => {
        updateSubscriberCard(subscriber.id, topic, message);
    });
    
    // Add subscriber to dropdown for subscription management
    const option = document.createElement('option');
    option.value = subscriber.id;
    option.textContent = subscriber.name;
    subscriberSelect.appendChild(option);
    
    // Create visual representation of subscriber
    createSubscriberCard(subscriber);
    
    // Auto-subscribe to current stock for demonstration
    if (stockSymbolSelect && stockSymbolSelect.value) {
        subscriber.subscribe(stockSymbolSelect.value);
        updateSubscriberCard(subscriber.id);
    }
    
    // Clear input fields
    subscriberNameInput.value = '';
    if (defaultNamesSelect) {
        defaultNamesSelect.value = '';
    }
    
    // If publishing is active, trigger immediate update
    if (currentPublisher && publisherState && publisherState.textContent === 'Publishing') {
        // Force an immediate update to show subscription
        // The broker's subscribe method already sends the last message,
        // but we ensure it's displayed
        setTimeout(() => {
            updateSubscriberCard(subscriber.id);
        }, 50);
    }
    
    console.log(`Subscriber added: ${subscriberName} (${subscriberId})`);
}

/**
 * Remove Subscriber Handler
 * Removes the last created subscriber from the system
 * Demonstrates dynamic unsubscription and cleanup
 */
function handleRemoveSubscriber() {
    if (subscribers.size === 0 || subscriberCreationOrder.length === 0) {
        console.log('No subscribers to remove');
        return;
    }
    
    // Get the most recently added subscriber (last in creation order)
    const lastSubscriberId = subscriberCreationOrder[subscriberCreationOrder.length - 1];
    const subscriber = subscribers.get(lastSubscriberId);
    
    if (!subscriber) {
        console.warn(`Subscriber ${lastSubscriberId} not found in map`);
        subscriberCreationOrder.pop(); // Clean up anyway
        return;
    }
    
    console.log(`Removing subscriber: ${subscriber.name} (${lastSubscriberId})`);
    
    // Unsubscribe from all topics before removal
    stockSymbols.forEach(symbol => {
        subscriber.unsubscribe(symbol);
    });
    
    // Remove from internal data structures
    subscribers.delete(lastSubscriberId);
    subscriberCreationOrder.pop(); // Remove from creation order
    
    // Remove from dropdown
    if (subscriberSelect) {
        const option = Array.from(subscriberSelect.options).find(
            opt => opt.value === lastSubscriberId
        );
        if (option) {
            option.remove();
        }
        
        // Clear selection if removed subscriber was selected
        if (subscriberSelect.value === lastSubscriberId) {
            subscriberSelect.value = '';
        }
    }
    
    // Remove visual card
    const card = document.getElementById(`subscriber-${lastSubscriberId}`);
    if (card) {
        card.remove();
        console.log(`Subscriber card removed: ${lastSubscriberId}`);
    } else {
        console.warn(`Card not found for subscriber: ${lastSubscriberId}`);
    }
}

/**
 * Subscribe Handler
 * Allows a selected subscriber to subscribe to a specific stock symbol (topic)
 * Demonstrates runtime subscription management
 */
function handleSubscribe() {
    const subscriberId = subscriberSelect.value;
    const topic = topicSelect.value;
    
    if (subscriberId && topic) {
        const subscriber = subscribers.get(subscriberId);
        if (subscriber) {
            subscriber.subscribe(topic);
            updateSubscriberCard(subscriberId);
            
            // Update card immediately - broker's subscribe already sends last message
            // But we ensure UI is updated
            setTimeout(() => {
                updateSubscriberCard(subscriberId);
            }, 50);
        }
    }
}

/**
 * Unsubscribe Handler
 * Allows a selected subscriber to unsubscribe from a specific stock symbol (topic)
 * Demonstrates runtime unsubscription management
 */
function handleUnsubscribe() {
    const subscriberId = subscriberSelect.value;
    const topic = topicSelect.value;
    
    if (subscriberId && topic) {
        const subscriber = subscribers.get(subscriberId);
        if (subscriber) {
            subscriber.unsubscribe(topic);
            updateSubscriberCard(subscriberId);
        }
    }
}

/**
 * UI Helper Functions
 * These functions manage the visual representation of subscribers and their state
 */

/**
 * Create Subscriber Card
 * Creates a visual card in the UI to represent a subscriber
 * Shows subscriber information, subscriptions, and received messages
 * @param {Subscriber} subscriber - The subscriber instance to display
 */
function createSubscriberCard(subscriber) {
    // Check if subscribersContainer is available
    if (!subscribersContainer) {
        console.error('subscribersContainer is not available');
        return;
    }
    
    // Check if card already exists
    const existingCard = document.getElementById(`subscriber-${subscriber.id}`);
    if (existingCard) {
        console.log(`Card for ${subscriber.id} already exists`);
        return;
    }
    
    const card = document.createElement('div');
    card.id = `subscriber-${subscriber.id}`;
    card.className = 'subscriber-card';
    
    card.innerHTML = `
        <div class="subscriber-header">
            <span class="subscriber-name">${subscriber.name}</span>
            <span class="subscriber-id">${subscriber.id}</span>
        </div>
        <div class="subscriptions-list">
            <strong>Subscriptions:</strong> <span id="subs-${subscriber.id}">None</span>
        </div>
        <div class="latest-message" id="msg-${subscriber.id}">
            <h4>Latest Message:</h4>
            <div class="message-content">No messages received yet</div>
        </div>
    `;
    
    subscribersContainer.appendChild(card);
    console.log(`Subscriber card created for ${subscriber.name} (${subscriber.id})`);
    updateSubscriberCard(subscriber.id);
}

/**
 * Update Subscriber Card
 * Updates the visual representation of a subscriber with current state
 * This function is called asynchronously when messages are received,
 * demonstrating real-time updates in the publish-subscribe pattern
 * 
 * @param {string} subscriberId - The ID of the subscriber to update
 * @param {string} topic - The topic (stock symbol) of the received message (optional)
 * @param {Object} message - The message data received (optional)
 */
function updateSubscriberCard(subscriberId, topic = null, message = null) {
    const subscriber = subscribers.get(subscriberId);
    if (!subscriber) {
        console.warn(`Subscriber ${subscriberId} not found`);
        return;
    }
    
    const card = document.getElementById(`subscriber-${subscriberId}`);
    if (!card) {
        console.warn(`Card for subscriber ${subscriberId} not found`);
        return;
    }
    
    const subsElement = document.getElementById(`subs-${subscriberId}`);
    const msgElement = document.getElementById(`msg-${subscriberId}`);
    
    if (!subsElement || !msgElement) {
        console.warn(`Elements for subscriber ${subscriberId} not found`);
        return;
    }
    
    // Update subscriptions
    const subscriptions = [];
    stockSymbols.forEach(symbol => {
        const subs = broker.getSubscribers(symbol);
        if (subs.includes(subscriberId)) {
            subscriptions.push(symbol);
        }
    });
    
    if (subscriptions.length > 0) {
        subsElement.innerHTML = subscriptions.map(s => 
            `<span class="subscription-badge">${s}</span>`
        ).join('');
        card.classList.add('active');
    } else {
        subsElement.textContent = 'None';
        card.classList.remove('active');
    }
    
    // Update latest message
    if (message) {
        const changeClass = message.change >= 0 ? 'positive' : 'negative';
        const changeSign = message.change >= 0 ? '+' : '';
        
        msgElement.innerHTML = `
            <h4>Latest Message (${topic}):</h4>
            <div class="message-content">
                <div class="message-price">$${message.price.toFixed(2)}</div>
                <div class="message-change ${changeClass}">
                    ${changeSign}${message.change.toFixed(2)}%
                </div>
                <div style="font-size: 0.8em; color: #666; margin-top: 5px;">
                    ${new Date(message.timestamp).toLocaleTimeString()}
                </div>
            </div>
        `;
    }
}

/**
 * UI Display Subscriber
 * A special subscriber used to display the latest published updates in the UI
 * This demonstrates how subscribers can be used for different purposes
 * (e.g., UI updates, logging, analytics, etc.)
 */
const uiSubscriber = new Subscriber('ui-display', 'UI Display', broker);

/**
 * Set callback for UI subscriber to update the latest update display
 * This callback is invoked asynchronously whenever a message is published
 * to the subscribed topic, demonstrating asynchronous message-driven updates
 */
uiSubscriber.setUpdateCallback((topic, message) => {
    // Always update the latest update content when a message is received
    if (latestUpdateContent && message) {
        const changeClass = message.change >= 0 ? 'positive' : 'negative';
        const changeSign = message.change >= 0 ? '+' : '';
        
        latestUpdateContent.innerHTML = `
            <div><strong>Symbol:</strong> ${message.symbol}</div>
            <div><strong>Price:</strong> <span class="message-price">$${message.price.toFixed(2)}</span></div>
            <div><strong>Change:</strong> <span class="message-change ${changeClass}">${changeSign}${message.change.toFixed(2)}%</span></div>
            <div><strong>Time:</strong> ${new Date(message.timestamp).toLocaleString()}</div>
        `;
    }
});

/**
 * Update Publisher Status
 * Manages the UI subscriber's subscription to match the current publisher
 * Demonstrates dynamic subscription changes based on user selection
 */
function updatePublisherStatus() {
    if (currentPublisher) {
        // Unsubscribe from all stocks first
        stockSymbols.forEach(symbol => {
            uiSubscriber.unsubscribe(symbol);
        });
        // Subscribe to current publisher's stock
        uiSubscriber.subscribe(currentPublisher.symbol);
    }
}

/**
 * Application Initialization
 * Sets up the initial state of the UI and all event listeners
 * Wait for DOM to be fully loaded before initializing
 */
function initializeApp() {
    // Get all DOM elements
    startPublishingBtn = document.getElementById('startPublishing');
    stopPublishingBtn = document.getElementById('stopPublishing');
    stockSymbolSelect = document.getElementById('stockSymbol');
    addSubscriberBtn = document.getElementById('addSubscriber');
    removeSubscriberBtn = document.getElementById('removeSubscriber');
    subscriberSelect = document.getElementById('subscriberSelect');
    topicSelect = document.getElementById('topicSelect');
    subscribeBtn = document.getElementById('subscribeBtn');
    unsubscribeBtn = document.getElementById('unsubscribeBtn');
    publisherState = document.getElementById('publisherState');
    currentStock = document.getElementById('currentStock');
    latestUpdateContent = document.getElementById('latestUpdateContent');
    subscribersContainer = document.getElementById('subscribersContainer');
    subscriberNameInput = document.getElementById('subscriberName');
    defaultNamesSelect = document.getElementById('defaultNames');
    
    // Ensure all DOM elements are available
    if (!startPublishingBtn || !stopPublishingBtn || !addSubscriberBtn || 
        !removeSubscriberBtn || !subscriberSelect || !topicSelect || 
        !subscribeBtn || !unsubscribeBtn || !publisherState || !currentStock || 
        !latestUpdateContent || !subscribersContainer || !subscriberNameInput || !defaultNamesSelect) {
        console.error('Some DOM elements are missing');
        return;
    }
    
    // Set up all event listeners
    startPublishingBtn.addEventListener('click', () => {
        if (currentPublisher) {
            currentPublisher.startPublishing(2000);
            publisherState.textContent = 'Publishing';
            publisherState.parentElement.classList.add('publishing');
            updatePublisherStatus();
        }
    });
    
    stopPublishingBtn.addEventListener('click', () => {
        if (currentPublisher) {
            currentPublisher.stopPublishing();
            publisherState.textContent = 'Stopped';
            publisherState.parentElement.classList.remove('publishing');
        }
    });
    
    stockSymbolSelect.addEventListener('change', (e) => {
        const symbol = e.target.value;
        if (currentPublisher) {
            currentPublisher.stopPublishing();
        }
        currentPublisher = publishers.get(symbol);
        currentStock.textContent = symbol;
        updatePublisherStatus();
        if (publisherState.textContent === 'Publishing') {
            currentPublisher.startPublishing(2000);
        }
    });
    
    defaultNamesSelect.addEventListener('change', (e) => {
        if (e.target.value) {
            subscriberNameInput.value = e.target.value;
        }
    });
    
    addSubscriberBtn.addEventListener('click', handleAddSubscriber);
    removeSubscriberBtn.addEventListener('click', handleRemoveSubscriber);
    subscribeBtn.addEventListener('click', handleSubscribe);
    unsubscribeBtn.addEventListener('click', handleUnsubscribe);
    
    // Initialize UI state
    updatePublisherStatus();
    if (currentStock) {
        currentStock.textContent = stockSymbolSelect.value;
    }
    
    console.log('Application initialized successfully');
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    // DOM is already loaded
    initializeApp();
}

