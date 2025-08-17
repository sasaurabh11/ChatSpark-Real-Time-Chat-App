# ChatSpark

A modern, feature-rich real-time chat application built with React, Node.js, and Socket.IO. ChatSpark provides seamless communication with real-time messaging, file sharing, friend management, and video calling capabilities.

## 🚀 Features

### Core Chat Features
- **Real-time messaging** with Socket.IO
- **Private conversations** between users
- **File sharing** with image support
- **Message history** and conversation management
- **Online/offline status** indicators
- **Message notifications**

### User Management
- **User authentication** with JWT
- **Google OAuth integration**
- **User profiles** with customizable avatars
- **Friend system** with request/accept functionality
- **User search** and discovery

### Advanced Features
- **WebRTC video calling** capabilities
- **Multi-language support** with transliteration
- **Responsive design** for all devices
- **Real-time notifications**

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern React with hooks
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Material-UI** - React component library
- **Socket.IO Client** - Real-time communication
- **React Router** - Client-side routing
- **Axios** - HTTP client for API calls

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **Socket.IO** - Real-time bidirectional communication
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Token authentication
- **Cloudinary** - Cloud image management
- **Multer** - File upload handling

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB database
- Cloudinary account (for image uploads)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/sasaurabh11/ChatSpark-Real-Time-Chat-App.git
   cd ChatSpark-Real-Time-Chat-App
   ```

2. **Install backend dependencies**
   ```bash
   cd server
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../client
   npm install
   ```

4. **Environment Setup**

   Create `.env` files in both `server/` and `client/` directories:

   **Server (.env)**
   ```env
   PORT=3000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   CLOUDINARY_CLOUD_NAME=your_cloudinary_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   ```

   **Client (.env)**
   ```env
   VITE_API_URL=http://localhost:3000
   VITE_GOOGLE_CLIENT_ID=your_google_oauth_client_id
   ```

5. **Start the application**

   **Start backend server**
   ```bash
   cd server
   npm run dev
   ```

   **Start frontend development server**
   ```bash
   cd client
   npm run dev
   ```

   The application will be available at:
   - Frontend: http://localhost:5173
   - Backend: http://localhost:3000

## 📱 Usage

### Authentication
- Sign up with email/password or use Google OAuth
- Login to access the chat interface

### Chat Features
- Start conversations with other users
- Send real-time messages
- Share images and files
- View conversation history

### Friend Management
- Send friend requests
- Accept/reject incoming requests
- Search for new users to connect with

### Video Calling
- Initiate video calls with friends
- Use WebRTC for peer-to-peer communication

## 🔧 Available Scripts

### Backend
- `npm run dev` - Start development server with nodemon
- `npm start` - Start production server

### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### Users
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user profile

### Messages
- `GET /api/messages/:conversationId` - Get conversation messages
- `POST /api/messages` - Send new message

### Friends
- `POST /api/friends/request` - Send friend request
- `PUT /api/friends/accept` - Accept friend request
- `GET /api/friends` - Get user's friends

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- CORS protection
- File upload validation
- Input sanitization

## 🚀 Deployment

### Backend Deployment
1. Set up environment variables on your hosting platform
2. Build and deploy the Node.js application
3. Ensure MongoDB connection is accessible

### Frontend Deployment
1. Build the React application: `npm run build`
2. Deploy the `dist` folder to your hosting service
3. Update API URLs in environment variables

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 👥 Author

- Saurabh Jaiswar


---

**ChatSpark** - Connecting people through real-time communication 🚀

---

**Happy Chat >3 ❤️**