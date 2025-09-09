# 🎨 LottieFiles Integration Guide

## ✅ **What We've Implemented:**

### **1. Login Page** (`/views/auth/login.ejs`)
- **Animation**: Security/Login themed animation
- **URL**: `https://assets3.lottiefiles.com/packages/lf20_jcikwtux.json`
- **Theme**: Blue gradient background with security/lock animation
- **Layout**: Split screen - animation on left, form on right

### **2. Register Page** (`/views/auth/register.ejs`) 
- **Animation**: Welcome/Journey themed animation
- **URL**: `https://assets4.lottiefiles.com/packages/lf20_mjlh3hcy.json`
- **Theme**: Green gradient background with welcome animation
- **Layout**: Form on left, animation on right

### **3. OTP Verification Page** (`/views/auth/verify-otp.ejs`)
- **Animation**: Email/Message themed animation
- **URL**: `https://assets5.lottiefiles.com/packages/lf20_V9t630.json`
- **Theme**: Centered card with email verification animation
- **Layout**: Top header with animation, form below

## 🔧 **How to Customize Animations:**

### **Step 1: Find New Animations**
1. Visit **https://lottiefiles.com/**
2. Search for themes like:
   - "login" - for login page
   - "welcome" - for registration
   - "email" - for OTP verification
   - "security" - for authentication
   - "camping" - for your app theme
   - "outdoor" - for nature theme

### **Step 2: Get Animation URL**
1. Click on any animation
2. Copy the **JSON URL** or download the JSON file
3. If downloaded, place in `/public/animations/` folder

### **Step 3: Replace Animation**
Replace the `src` attribute in `lottie-player` tag:

```html
<!-- Current -->
<lottie-player
    src="https://assets3.lottiefiles.com/packages/lf20_jcikwtux.json"
    ...>
</lottie-player>

<!-- Replace with your animation -->
<lottie-player
    src="YOUR_NEW_ANIMATION_URL_HERE"
    ...>
</lottie-player>
```

### **Step 4: Local Animation Files (Optional)**
If you download JSON files:

```html
<!-- Use local file -->
<lottie-player
    src="/animations/your-animation.json"
    background="transparent"
    speed="1"
    loop
    autoplay>
</lottie-player>
```

## 🎯 **Recommended Animation Themes:**

### **For Login Page:**
- **Security/Lock**: Authentication, security, login
- **User Profile**: User login, account access
- **Shield**: Protection, secure login

### **For Register Page:**  
- **Welcome/Hello**: Greeting, welcome animations
- **User Creation**: Account creation, signup
- **Camping/Outdoor**: Nature, camping, adventure

### **For OTP Page:**
- **Email/Message**: Email sending, message delivery
- **Code/Numbers**: OTP, verification, codes
- **Check/Success**: Verification success

## ⚙️ **Animation Properties:**

```html
<lottie-player
    src="ANIMATION_URL"           <!-- Animation source -->
    background="transparent"      <!-- Background color -->
    speed="1"                    <!-- Playback speed (0.5 = slower, 2 = faster) -->
    style="width: 300px;"        <!-- Size control -->
    loop                         <!-- Repeat animation -->
    autoplay                     <!-- Start automatically -->
    controls                     <!-- Show play/pause controls (optional) -->
    hover                        <!-- Play on hover (optional) -->
    direction="1">               <!-- 1 = normal, -1 = reverse -->
</lottie-player>
```

## 🎨 **Color Customization:**

You can also customize the colors to match your brand:

```css
/* Custom styles for animation container */
.lottie-animation {
    max-width: 300px;
    width: 100%;
    filter: hue-rotate(30deg);  /* Change color tone */
    opacity: 0.9;               /* Transparency */
}
```

## 📱 **Responsive Design:**

```css
@media (max-width: 768px) {
    .lottie-animation {
        max-width: 200px;  /* Smaller on mobile */
    }
}
```

## 🚀 **Ready to Use!**

Your login pages now have beautiful Lottie animations! Visit:
- **Login**: http://localhost:3000/login
- **Register**: http://localhost:3000/register  
- **OTP**: (appears after email login)

Want different animations? Just replace the `src` URLs with your preferred LottieFiles animations!
