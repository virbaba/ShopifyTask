# Shopify Announcement Banner App

A Shopify embedded app built using the modern React Router (v7) Shopify framework template. It allows store merchants to set an announcement message from their Shopify Admin dashboard, which is then stored in MongoDB, synchronized with a Shopify Shop Metafield, and rendered dynamically on the storefront using a Theme App Extension (App Embed Block).

---

## 🌐 How to Install & Test the App (For Evaluators)

When you visit the deployed Render URL (e.g., `https://shopify-announcement-app-w2fp.onrender.com/`), you will see a clean landing page with a login form:

1. **Enter your Shopify Development Store Domain** (e.g., `announcement-test-store-2p2lpp1v.myshopify.com`) into the **Shop domain** input field.
2. Click **Log in / Install**.
3. You will be redirected to your Shopify Admin interface to approve the app installation.
4. Once installed, you will be redirected to the **Announcement Banner Admin** dashboard inside your Shopify Admin where you can type your announcement and save it!

---

## 🚀 Features

1. **Merchant Dashboard (Shopify Admin)**: A clean, Polaris-themed input form built using App Bridge React. Merchants can configure their announcement text and save it with one click. The dashboard automatically pre-populates with the last saved database record on load.
2. **Dynamic Syncing**:
   - **Database Logging**: Saves audit records (with timestamps) to MongoDB for every announcement change.
   - **Shopify Metafield Sync**: Automatically updates the Shopify Shop Metafield (`namespace: "my_app"`, `key: "announcement"`) via the Shopify GraphQL Admin API.
3. **App Embed Storefront Block**: A Theme App Extension that displays the announcement banner floating at the top of every storefront page, powered by Liquid.

---

## 🛠️ Tech Stack

- **Frontend**: React, Shopify Polaris Web Components, Shopify App Bridge React
- **Backend**: React Router v7 (Server Side Rendering), Node.js
- **Database**: MongoDB (Audit Logging) + SQLite/Prisma (Shopify Session Management)
- **Storefront**: Shopify Theme App Extension (Liquid, CSS)

---

## ⚙️ Local Project Setup

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (>= 20.12)
- A [Shopify Partner Account](https://partners.shopify.com/)
- A development store with the **Online Store** channel enabled
- A [MongoDB database](https://www.mongodb.com/cloud/atlas) connection string

### 2. Installation
Clone this repository and run the following command in the project root to install the dependencies:
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env` file in the root directory and add your MongoDB connection string:
```env
MONGODB_URI="mongodb+srv://<username>:<password>@cluster.mongodb.net/database_name"
```
*(Note: Shopify API keys, secret keys, and application URLs are automatically injected and managed by the Shopify CLI during development).*

### 4. Running the Development Server
To link the app to your Shopify Partner account and start the development server, run:
```bash
npm run dev
```

During the setup:
- Choose your Shopify Partner organization.
- Select **Create a new app** or link it to an existing app.
- Select your development store.
- Shopify CLI will automatically update your app URLs and spin up the local development server.

---

## 🎨 Activating the Storefront Banner
To see the announcement banner live on your development storefront:

1. In your Shopify Partner Dashboard or terminal, open the generated **Developer Preview URL**.
2. Go to **Online Store** -> **Themes** in your Shopify Admin.
3. Click **Customize** on your active theme to open the Theme Editor.
4. On the left sidebar, click the **App Embeds** tab (the third icon).
5. Toggle on the **Announcement Banner** app embed block.
6. Click **Save** in the top right corner.

Now, whenever you update the announcement message from your App Home dashboard, the storefront banner will immediately update live across all pages of your store!
