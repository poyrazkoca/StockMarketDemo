# 📈 Stock Market Demo - Publish-Subscribe Pattern

This project demonstrates the **Publish-Subscribe (Pub-Sub)** architectural pattern through a real-time stock market price update system. The pattern enables asynchronous, message-driven communication where publishers and subscribers are decoupled through a central broker.

## 🏗️ Architecture

The system consists of three main components:

- **Broker**: Central message broker that manages subscriptions and routes messages from publishers to subscribers
- **Publisher**: Publishes stock price updates to the broker at regular intervals (decoupled from subscribers)
- **Subscriber**: Receives updates from the broker for subscribed topics (multiple subscribers can receive the same message)

## 🚀 Quick Start

### Option 1: Using Python (Recommended)
```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```

Then open: `http://localhost:8000`

### Option 2: Using Node.js
```bash
npx http-server
```

### Option 3: Direct File Opening
Simply open `index.html` in your browser (some browsers may block ES6 modules).

## 📁 Project Structure

```
StockMarketDemo/
├── index.html      # Main HTML file with UI
├── app.js          # Application logic and UI interactions
├── broker.js       # Broker class (central message router)
├── publisher.js    # Publisher class (publishes stock updates)
├── subscriber.js   # Subscriber class (receives updates)
├── styles.css      # Styling for the UI
└── README.md       # This file
```

## 🎬 Demo Steps

1. **Start Publishing**: Click "Start Publishing" to begin generating stock price updates
2. **Add Subscribers**: Click "Add Subscriber" to create subscribers that receive updates
3. **Subscribe/Unsubscribe**: Use the controls to manage subscriptions dynamically
4. **Switch Stocks**: Change the stock symbol to see topic-based message routing
5. **Observe Updates**: Watch how multiple subscribers receive messages asynchronously

## ✨ Key Features

- ✅ **Decoupled Communication**: Publishers and subscribers don't know about each other
- ✅ **Asynchronous Messaging**: Messages distributed asynchronously through broker
- ✅ **Dynamic Subscriptions**: Subscribe/unsubscribe at runtime
- ✅ **Topic-Based Routing**: Messages routed by stock symbols (topics)
- ✅ **One-to-Many**: One publisher can serve many subscribers
- ✅ **Real-time Updates**: Live price updates every 2 seconds

## 🎯 Learning Objectives

This project demonstrates:

1. **Publish-Subscribe Pattern**: Core architectural pattern implementation
2. **Asynchronous Communication**: Non-blocking message distribution
3. **Message-Driven Architecture**: Event-driven system design
4. **Decoupling**: Loose coupling between components
5. **Scalability**: Easy to add more publishers/subscribers

## 📚 Technologies Used

- **JavaScript (ES6 Modules)**: Modern JavaScript with module system
- **HTML5**: Semantic HTML structure
- **CSS3**: Modern styling with gradients and animations
- **No Dependencies**: Pure vanilla JavaScript implementation

## 🔍 How It Works

1. **Publisher** generates stock price updates and publishes them to the broker
2. **Broker** receives messages and routes them to all subscribers of that topic
3. **Subscribers** receive messages asynchronously via callback functions
4. **UI** updates in real-time to show the message flow

## 📖 Code Documentation

All code includes comprehensive comments explaining:
- Architecture pattern implementation
- Asynchronous message flow
- Component interactions
- Design decisions

## 🤝 Contributing

This is a demonstration project. Feel free to fork and enhance it!

## 📄 License

This project is open source and available for educational purposes.

---

**Built to demonstrate the Publish-Subscribe architectural pattern** 🎓
