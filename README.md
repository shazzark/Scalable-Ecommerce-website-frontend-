# 🛒 E-Commerce Frontend

A modern, responsive e-commerce frontend built with Next.js 14, React, and Tailwind CSS. Features a complete shopping experience with product browsing, cart management, checkout, and user authentication.

## 🚀 Features

- **Modern UI/UX** - Clean, responsive design with Tailwind CSS
- **User Authentication** - Login, registration, and profile management
- **Product Browsing** - Filter, search, and sort products
- **Shopping Cart** - Real-time cart updates and management
- **Checkout Process** - Complete checkout flow with Paystack integration
- **Order Management** - View and track orders
- **Admin Dashboard** - Full admin interface for store management
- **Responsive Design** - Mobile-first approach
- **Image Optimization** - Next.js Image component

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Context API
- **HTTP Client**: Fetch API with custom service
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **Forms**: React Hook Form

## 📁 Project Structure

frontend/
├── src/
│ ├── app/ # Next.js App Router
│ │ ├── (auth)/ # Authentication routes
│ │ │ ├── login/
│ │ │ ├── register/
│ │ │ └── forgot-password/
│ │ ├── (store)/ # Store routes
│ │ │ ├── cart/
│ │ │ ├── products/
│ │ │ ├── categories/
│ │ │ ├── orders/
│ │ │ └── profile/
│ │ ├── (admin)/ # Admin routes
│ │ │ ├── dashboard/
│ │ │ ├── products/
│ │ │ ├── orders/
│ │ │ ├── users/
│ │ │ └── categories/
│ │ ├── api/ # API routes
│ │ ├── layout.tsx # Root layout
│ │ └── page.tsx # Homepage
│ ├── components/ # Reusable components
│ │ ├── ui/ # UI components
│ │ │ ├── Button.tsx
│ │ │ ├── Card.tsx
│ │ │ ├── Input.tsx
│ │ │ └── Modal.tsx
│ │ ├── layout/ # Layout components
│ │ │ ├── Header.tsx
│ │ │ ├── Footer.tsx
│ │ │ └── Sidebar.tsx
│ │ ├── product/ # Product components
│ │ ├── cart/ # Cart components
│ │ └── checkout/ # Checkout components
│ ├── hooks/ # Custom React hooks
│ │ ├── useAuth.ts
│ │ ├── useCart.ts
│ │ └── useToast.ts
│ ├── lib/ # Utilities & config
│ │ ├── apiService.ts # API service layer
│ │ └── constants.ts
│ ├── contexts/ # React contexts
│ │ ├── AuthContext.tsx
│ │ ├── CartContext.tsx
│ │ └── ToastContext.tsx
│ ├── types/ # TypeScript types
│ │ ├── product.ts
│ │ ├── user.ts
│ │ └── order.ts
│ └── styles/ # Global styles
│ └── globals.css
├── public/ # Static assets
│ ├── images/
│ └── favicon.ico
├── .env.local # Environment variables
├── tailwind.config.ts # Tailwind config
├── next.config.js # Next.js config
└── package.json
