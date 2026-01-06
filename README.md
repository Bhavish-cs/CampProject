# 🏕️ CampProject - Campground Discovery Platform

A full-stack web application for discovering, reviewing, and sharing campgrounds. Built with the MERN stack (MongoDB, Express.js, EJS, Node.js), this platform allows users to explore campgrounds, view interactive maps, leave reviews, and manage their own campground listings.

![License](https://img.shields.io/badge/license-ISC-blue.svg)
![Node Version](https://img.shields.io/badge/node-%3E%3D14.0.0-brightgreen)
![MongoDB](https://img.shields.io/badge/mongodb-5.0%2B-green)

## ✨ Features

### 🔐 Authentication & Authorization
- **Local Authentication** - Email/password registration and login with bcrypt encryption
- **Google OAuth 2.0** - Sign in with Google integration
- **Session Management** - Secure session handling with express-session
- **Protected Routes** - Authorization middleware for campground and review operations

### 🏞️ Campground Management
- **CRUD Operations** - Create, read, update, and delete campgrounds
- **Image Upload** - Multiple image uploads with Cloudinary integration
- **Location Services** - Real-time location with MapTiler SDK
- **Interactive Maps** - Dynamic maps showing campground locations
- **Validation** - Server-side validation with Joi

### ⭐ Review System
- **Star Ratings** - 5-star rating system for campgrounds
- **User Reviews** - Authenticated users can leave and delete reviews
- **Review Display** - Beautiful review cards with timestamps

### 🎨 Modern UI/UX
- **Responsive Design** - Mobile-first approach, works on all devices
- **Dark Mode** - Toggle between light and dark themes
- **Loading Animations** - Smooth preloader with Lottie animations
- **Flash Messages** - User feedback with connect-flash
- **Custom CSS** - Elite design with gradient effects and animations

### 🗺️ Map Features
- **Interactive Maps** - Powered by MapTiler SDK
- **Multiple Map Styles** - Switch between different map views
- **Geolocation** - Accurate campground coordinates
- **Custom Markers** - Enhanced map markers with popups

## 🛠️ Technologies Used

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling

### Frontend
- **EJS** - Templating engine
- **Bootstrap 5** - CSS framework
- **Custom CSS** - Enhanced styling with animations
- **JavaScript** - Interactive features

### Authentication
- **Passport.js** - Authentication middleware
- **Passport Local** - Local strategy
- **Passport Google OAuth 2.0** - Google authentication
- **Bcrypt** - Password hashing

### File Upload & Storage
- **Multer** - File upload middleware
- **Cloudinary** - Cloud-based image storage and CDN

### Maps & Location
- **MapTiler SDK** - Interactive maps
- **GeoJSON** - Location data format

### Additional Libraries
- **Joi** - Schema validation
- **Connect-Flash** - Flash messages
- **Method-Override** - HTTP verb support
- **Dotenv** - Environment variable management
- **Express-Session** - Session management
- **Nodemailer** - Email functionality

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v14.0.0 or higher)
- **MongoDB** (v5.0 or higher)
- **npm** or **yarn**

You'll also need accounts for:
- **Cloudinary** (for image storage)
- **MapTiler** (for maps)
- **Google Cloud Platform** (for OAuth)

## 🚀 Installation

1. **Clone the repository**
```bash
git clone https://github.com/Bhavish-cs/CampProject.git
cd CampProject
```

2. **Install dependencies**
```bash
npm install
```

3. **Create a `.env` file in the root directory**
```env
# Database
MONGO_URI=your_mongodb_connection_string

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# MapTiler Configuration
MAPTILER_API_KEY=your_maptiler_api_key

# Google OAuth Configuration
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Session Secret
SESSION_SECRET=your_session_secret_key

# Server Configuration
PORT=3000
```

4. **Seed the database (optional)**
```bash
node seeds/index.js
```

5. **Start the application**

For development with auto-restart:
```bash
npm run dev
```

For production:
```bash
npm start
```

6. **Access the application**
```
http://localhost:3000
```

## 📁 Project Structure

```
CampProject/
├── config/               # Configuration files
│   ├── cloudinary.js    # Cloudinary setup
│   └── passport.js      # Passport authentication
├── middlewares/         # Custom middleware
│   ├── auth.js          # Authentication checks
│   ├── authorization.js # Authorization logic
│   └── validateCampground.js # Validation middleware
├── models/              # Mongoose models
│   ├── campground.js    # Campground schema
│   ├── review.js        # Review schema
│   └── user.js          # User schema
├── public/              # Static files
│   ├── js/              # Client-side JavaScript
│   │   ├── preloader.js
│   │   ├── theme-toggle.js
│   │   └── ...
│   └── stylesheets/     # CSS files
│       ├── home.css
│       ├── campground-show.css
│       ├── dark-mode.css
│       └── ...
├── routes/              # Express routes
│   └── auth.js          # Authentication routes
├── seeds/               # Database seeding
│   ├── index.js
│   └── cities.js
├── uploads/             # Temporary upload directory
├── utils/               # Utility functions
│   └── catchAsync.js    # Async error handler
├── views/               # EJS templates
│   ├── campgrounds/     # Campground views
│   ├── layouts/         # Layout templates
│   └── home.ejs         # Home page
├── app.js               # Main application file
├── package.json         # Dependencies
└── .env                 # Environment variables (not in repo)
```

## 🎯 Usage

### For Users
1. **Browse Campgrounds** - View all available campgrounds on the home page
2. **View Details** - Click on any campground to see full details, location, and reviews
3. **Register/Login** - Create an account or sign in with Google
4. **Add Campground** - Share your favorite camping spots
5. **Leave Reviews** - Rate and review campgrounds you've visited
6. **Edit/Delete** - Manage your own campground listings and reviews

### For Developers
- **Development Mode**: `npm run dev` (uses nodemon for auto-restart)
- **Production Mode**: `npm start`
- **Seed Database**: `node seeds/index.js`

## 🔒 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `MONGO_URI` | MongoDB connection string | Yes |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name | Yes |
| `CLOUDINARY_API_KEY` | Cloudinary API key | Yes |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | Yes |
| `MAPTILER_API_KEY` | MapTiler API key | Yes |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID | Yes |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret | Yes |
| `SESSION_SECRET` | Secret for session encryption | Yes |
| `PORT` | Server port (default: 3000) | No |

## 🌟 Key Features Explained

### Dark Mode
Toggle between light and dark themes with smooth transitions. The theme preference is saved in localStorage.

### Preloader
Beautiful loading animation using Lottie files that appears during page load.

### Interactive Maps
- Click campground markers to see details
- Switch between different map styles (streets, satellite, outdoor)
- Zoom and pan for better navigation

### Image Management
- Upload multiple images per campground
- Automatic image optimization via Cloudinary
- Responsive image display with carousel

### Authorization System
- Users can only edit/delete their own campgrounds
- Users can only delete their own reviews
- Protected routes ensure security

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License.

## 👨‍💻 Author

**Bhavish**
- GitHub: [@Bhavish-cs](https://github.com/Bhavish-cs)
- Repository: [CampProject](https://github.com/Bhavish-cs/CampProject)

## 🙏 Acknowledgments

- [MapTiler](https://www.maptiler.com/) for amazing map services
- [Cloudinary](https://cloudinary.com/) for image hosting
- [Pexels](https://www.pexels.com/) for sample campground images
- [Bootstrap](https://getbootstrap.com/) for responsive design
- [Lottie](https://lottiefiles.com/) for animations

## 📞 Support

If you have any questions or issues, please open an issue on GitHub or contact the repository owner.

---

Made with ❤️ by Bhavish
