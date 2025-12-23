# 📹 Stock Market Demo - Video Guide

## 🚀 How to Run the Project

### Prerequisites
- A modern web browser (Chrome, Firefox, Edge, or Safari)
- A local web server (optional, but recommended)

### Running the Project

#### Option 1: Using a Local Web Server (Recommended)
```bash
# Using Python 3
python -m http.server 8000

# Using Python 2
python -m SimpleHTTPServer 8000

# Using Node.js (if you have http-server installed)
npx http-server

# Using PHP
php -S localhost:8000
```

Then open your browser and navigate to: `http://localhost:8000`

#### Option 2: Direct File Opening
Simply double-click `index.html` or open it directly in your browser.

**Note:** Some browsers may block ES6 modules when opening files directly. Using a local server is recommended.

---

## 🎬 Demo Video Script - Step by Step

### **Introduction (0:00 - 0:30)**

**What to Say:**
> "Welcome to the Stock Market Price Update System demonstrating the Publish-Subscribe architectural pattern. This project shows how publishers and subscribers communicate asynchronously through a central broker, enabling decoupled, message-driven communication."

**What to Show:**
- The main UI with all sections visible
- Point out the three main components: Publisher Controls, Subscriber Management, and the Architecture Overview section

---

### **Step 1: Explain the Architecture (0:30 - 1:30)**

**What to Say:**
> "The Publish-Subscribe pattern consists of three main components:
> 1. **Publisher** - Publishes stock price updates without knowing who receives them
> 2. **Broker** - Central message router that manages subscriptions and distributes messages
> 3. **Subscriber** - Receives updates for subscribed topics without knowing the publisher
> 
> This enables decoupled, asynchronous, one-to-many communication."

**What to Show:**
- Scroll to the Architecture Overview section
- Point to each component card (Broker, Publisher, Subscriber)
- Explain how messages flow: Publisher → Broker → Subscribers

---

### **Step 2: Start Publishing (1:30 - 2:00)**

**What to Say:**
> "Let's start by publishing stock price updates. I'll select AAPL (Apple) and click 'Start Publishing'."

**What to Do:**
1. Ensure "AAPL (Apple)" is selected in the Stock Symbol dropdown
2. Click the **"Start Publishing"** button
3. Point out that the status changes to "Publishing" with a pulsing animation

**What to Show:**
- The Publisher Status section showing "Status: Publishing"
- The "Latest Published Update" box starting to show price updates
- Updates appearing every 2 seconds with price, change percentage, and timestamp

**Key Points to Highlight:**
- Updates are generated asynchronously
- Each update includes: symbol, price, percentage change, and timestamp
- The publisher doesn't know who will receive these messages

---

### **Step 3: Create First Subscriber (2:00 - 2:45)**

**What to Say:**
> "Now let's create a subscriber. When I click 'Add Subscriber', a new subscriber is created and automatically subscribed to the current stock (AAPL)."

**What to Do:**
1. Click the **"Add Subscriber"** button
2. A new subscriber card appears in the Subscribers section

**What to Show:**
- The new subscriber card appearing
- The subscriber's name and ID displayed
- The "Subscriptions" section showing "AAPL" badge
- The "Latest Message" section showing the current price update
- Point out that the subscriber immediately receives the latest published message

**Key Points to Highlight:**
- Subscriber is automatically subscribed to AAPL
- The subscriber receives messages asynchronously
- Multiple subscribers can receive the same message (one-to-many)

---

### **Step 4: Create Multiple Subscribers (2:45 - 3:30)**

**What to Say:**
> "Let's add more subscribers to demonstrate how multiple subscribers can receive the same message simultaneously."

**What to Do:**
1. Click **"Add Subscriber"** 2-3 more times
2. Watch as multiple subscriber cards appear

**What to Show:**
- Multiple subscriber cards side by side
- All subscribers showing the same AAPL price updates
- Each subscriber receiving updates independently
- Point out that all subscribers are receiving the same messages in real-time

**Key Points to Highlight:**
- One publisher can serve many subscribers
- Each subscriber receives messages independently
- This demonstrates the one-to-many communication pattern

---

### **Step 5: Subscribe to Different Stocks (3:30 - 4:30)**

**What to Say:**
> "Now let's demonstrate dynamic subscriptions. I'll subscribe one subscriber to multiple stocks."

**What to Do:**
1. Select a subscriber from the "Select Subscriber" dropdown
2. Select a different stock (e.g., "GOOGL") from the "Select Stock" dropdown
3. Click **"Subscribe"**
4. Repeat with another stock (e.g., "MSFT")

**What to Show:**
- The subscriber card updating to show multiple subscription badges
- The subscriber now receiving updates from multiple stocks
- The "Latest Message" section showing updates from different stocks
- Point out that subscribers can subscribe to multiple topics

**Key Points to Highlight:**
- Dynamic subscription management
- Subscribers can subscribe to multiple topics
- Each subscription is independent

---

### **Step 6: Switch Publisher Stock (4:30 - 5:15)**

**What to Say:**
> "Let's switch the publisher to a different stock. Notice how only subscribers subscribed to that stock will receive updates."

**What to Do:**
1. Select "TSLA (Tesla)" from the Stock Symbol dropdown
2. The publisher automatically switches to TSLA
3. Publishing continues (if it was running)

**What to Show:**
- The "Current Stock" changing to TSLA
- The Latest Published Update showing TSLA prices
- Only subscribers subscribed to TSLA receive updates
- Subscribers not subscribed to TSLA don't receive updates

**Key Points to Highlight:**
- Topic-based message routing
- Subscribers only receive messages for subscribed topics
- Publisher can switch topics dynamically

---

### **Step 7: Unsubscribe Demonstration (5:15 - 5:45)**

**What to Say:**
> "Let's unsubscribe a subscriber from a topic to show how they stop receiving updates."

**What to Do:**
1. Select a subscriber from the dropdown
2. Select a stock they're subscribed to (e.g., "AAPL")
3. Click **"Unsubscribe"**

**What to Show:**
- The subscription badge disappearing from the subscriber card
- The subscriber no longer receiving updates for that stock
- Other subscribers still receiving updates

**Key Points to Highlight:**
- Runtime subscription management
- Unsubscribed subscribers stop receiving messages immediately
- Other subscribers are unaffected

---

### **Step 8: Stop Publishing (5:45 - 6:00)**

**What to Say:**
> "Let's stop publishing to show how the system handles the stop state."

**What to Do:**
1. Click the **"Stop Publishing"** button

**What to Show:**
- The status changing to "Stopped"
- The pulsing animation stopping
- No new updates being published
- Subscribers retaining their last received messages

**Key Points to Highlight:**
- Publisher can be stopped/started dynamically
- Subscribers remain subscribed but don't receive new messages
- System state is preserved

---

### **Step 9: Remove Subscriber (6:00 - 6:15)**

**What to Say:**
> "Finally, let's remove a subscriber to demonstrate cleanup."

**What to Do:**
1. Click **"Remove Last Subscriber"**

**What to Show:**
- The last subscriber card disappearing
- The subscriber being removed from the dropdown
- Other subscribers continuing to function normally

**Key Points to Highlight:**
- Dynamic subscriber management
- Clean removal of subscribers
- System continues to function with remaining subscribers

---

### **Step 10: Full Scenario Demonstration (6:15 - 7:00)**

**What to Say:**
> "Let me demonstrate a complete scenario: multiple publishers, multiple subscribers, and dynamic subscriptions."

**What to Do:**
1. Start publishing AAPL
2. Add 2-3 subscribers
3. Subscribe some subscribers to multiple stocks
4. Switch between different stocks
5. Show how different subscribers receive different messages based on their subscriptions

**What to Show:**
- Multiple subscribers with different subscription patterns
- Real-time updates flowing to different subscribers
- The asynchronous nature of message distribution
- The decoupled nature of the system

**Key Points to Highlight:**
- Complete Publish-Subscribe pattern in action
- Asynchronous message-driven communication
- Decoupled architecture
- Scalability (can add more publishers/subscribers)

---

### **Conclusion (7:00 - 7:30)**

**What to Say:**
> "This demonstration shows the key benefits of the Publish-Subscribe pattern:
> - **Decoupling**: Publishers and subscribers don't know about each other
> - **Asynchronous Communication**: Messages are distributed asynchronously
> - **Scalability**: Easy to add more publishers and subscribers
> - **Flexibility**: Dynamic subscriptions and unsubscriptions
> - **One-to-Many**: One publisher can serve many subscribers
> 
> This pattern is widely used in real-time systems, event-driven architectures, and message queues."

**What to Show:**
- Final state of the application
- Summary of what was demonstrated
- Point to the Architecture Overview section one more time

---

## 📋 Quick Demo Checklist

- [ ] **Introduction** - Explain the project and architecture
- [ ] **Start Publishing** - Show publisher generating updates
- [ ] **Create Subscribers** - Add multiple subscribers
- [ ] **Show Real-time Updates** - Demonstrate asynchronous message delivery
- [ ] **Dynamic Subscriptions** - Subscribe/unsubscribe to different stocks
- [ ] **Switch Publishers** - Change stock symbols
- [ ] **Multiple Scenarios** - Show various subscription patterns
- [ ] **Stop/Start** - Demonstrate publisher control
- [ ] **Conclusion** - Summarize key benefits

---

## 🎯 Key Points to Emphasize

1. **Decoupled Communication**: Publishers and subscribers don't know about each other
2. **Asynchronous Messaging**: Messages are distributed asynchronously through the broker
3. **One-to-Many**: One publisher can serve many subscribers
4. **Topic-Based Routing**: Messages are routed based on topics (stock symbols)
5. **Dynamic Management**: Subscriptions can be changed at runtime
6. **Message-Driven**: System is event-driven and reactive

---

## 💡 Tips for Recording

1. **Screen Recording**: Use screen recording software (OBS, Camtasia, or built-in screen recorder)
2. **Browser Console**: Keep the browser console open to show the log messages
3. **Zoom**: Zoom in on important sections when demonstrating specific features
4. **Pace**: Take your time explaining each step - don't rush
5. **Highlight**: Use cursor highlighting or annotations to point out important elements
6. **Test Run**: Do a practice run before recording to ensure smooth flow

---

## 🔧 Troubleshooting

**If updates don't appear:**
- Check browser console for errors
- Ensure you're using a modern browser
- Try using a local web server instead of opening file directly

**If subscribers don't receive messages:**
- Verify they are subscribed to the correct stock
- Check that publishing is active
- Look at browser console for any errors

**If UI doesn't load properly:**
- Clear browser cache
- Check that all files are in the same directory
- Verify browser supports ES6 modules

---

## 📚 Additional Resources

- Architecture Pattern: Publish-Subscribe (Pub-Sub)
- Asynchronous Message-Driven Communication
- Event-Driven Architecture
- Message Broker Pattern

---

**Good luck with your demo! 🎥**

