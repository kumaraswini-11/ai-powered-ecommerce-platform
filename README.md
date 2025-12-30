# 🛒 AI-Powered Modern E-commerce Platform

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://react.dev/)
[![Sanity](https://img.shields.io/badge/Sanity-v3-F03E2F?logo=sanity)](https://www.sanity.io/)
[![Stripe](https://img.shields.io/badge/Stripe-Payments-008CDD?logo=stripe)](https://stripe.com/)
[![Bun](https://img.shields.io/badge/Bun-Fast%20Runtime-f9f1e1?logo=bun)](https://bun.sh/)
[![Zustand](https://img.shields.io/badge/Zustand-State%20Management-00C5E0?logo=zustand)](https://github.com/pmndrs/zustand)

> **"Modern Commerce with a Brain."** A high-performance, real-time e-commerce engine featuring an intelligent AI shopping assistant, live inventory management, and a data-driven admin dashboard.

---

## 🌟 Overview

This platform is a full-stack demonstration of modern web capabilities. It bridges the gap between traditional e-commerce and AI-driven user experiences. By leveraging **Sanity’s Real-time Content Lake** and **Claude AI**, the store provides instant feedback to both shoppers and administrators, ensuring data consistency across the entire stack.

### 🏗️ Why this project?

- **For Shoppers:** Natural language product discovery and real-time stock reliability.
- **For Admins:** AI-driven insights that suggest business actions based on live sales and inventory data.
- **For Developers:** A clean, type-safe architecture using the latest Next.js 16 and React 19 features.

---

## 🛠️ Tech Stack

| Layer           | Technology                        | Role                                  |
| :-------------- | :-------------------------------- | :------------------------------------ |
| **Frontend**    | Next.js (App Router), React 19    | Framework & UI Logic                  |
| **Styling**     | Tailwind CSS, Shadcn UI           | Design System & Components            |
| **Backend/CMS** | Sanity.io (App SDK)               | Content Database & Real-time Updates  |
| **AI Engine**   | Claude 3.5 Sonnet + Vercel AI SDK | Intelligent Assistant & Data Insights |
| **Auth**        | Clerk (AgentKit)                  | Identity Management & AI Context      |
| **Payments**    | Stripe                            | Secure Checkout & Webhooks            |
| **State**       | Zustand                           | Persistent Cart Management            |

---

## 🚀 Key Features

### 👤 For Shoppers

- **🤖 AI Shopping Assistant:** Powered by Claude AI. Search by material, color, price range, or complex specs using natural language (e.g., _"Show me lightweight waterproof jackets under $150"_).
- **📦 Order Intelligence:** Track history and delivery status via an AI-integrated chat interface.
- **🔄 Live Inventory:** Direct connection to Sanity ensures users never buy an "out of stock" item.
- **💳 One-Click Checkout:** Seamless Stripe integration with address validation and secure processing.

### 🛡️ For Admins

- **🧠 AI Insights Dashboard:** Automatically analyzes sales trends and flags inventory risks.
- **📝 Live Content Studio:** Edit products, descriptions, and prices with instant frontend propagation via Sanity Live.
- **⚠️ Smart Alerts:** Automated warnings for low stock or unfulfilled high-value orders.

---

## 🏗️ Architecture Highlights

- **Sanity Live Content:** Uses the Sanity App SDK to ensure that content changes in the studio reflect on the frontend without a page refresh.
- **Authenticated AI Context:** Using **Clerk AgentKit**, the AI assistant knows the user's identity, allowing it to answer personalized questions like _"Where is my last order?"_
- **Type Safety:** Full TypeScript implementation with **Sanity TypeGen** for end-to-end schema safety from the CMS to the UI.

---

## 🔮 Future Implementations

### Phase 1: Enhanced User Experience

- [ ] **Product Reviews:** Add star ratings and text reviews for social proof.
- [ ] **Wishlist:** Allow users to save favorite items for later.
- [ ] **Advanced Filtering:** Multi-selection filters for categories, brands, and custom attributes.
- [ ] **Social Sharing:** Integration for sharing products on social platforms.

### Phase 2: Communication & Marketing

- [ ] **Email Notifications:** Order confirmations and shipping updates via **Resend**.
- [ ] **Product Comparison:** A side-by-side tool for comparing technical specifications.
- [ ] **Multi-currency Support:** Automatic currency conversion based on user location.

### Phase 3: Advanced AI & Intelligence

- [ ] **AI Recommendations:** "You might also like..." engine based on browsing history.
- [ ] **Sentiment Analysis:** AI-powered analysis of product reviews to highlight pros/cons.
- [ ] **Inventory Forecasting:** Predictive AI to alert admins when to restock based on seasonal trends.

### Phase 4: Performance & Scaling

- [ ] **Edge Caching:** Implement **Redis** for frequently accessed product data.
- [ ] **Media Optimization:** Offload image processing to **Cloudinary**.
- [ ] **Global Search:** Implement **Algolia** for lightning-fast, full-text search.

---

## 📌 Getting Started

### Prerequisites

- [Bun](https://bun.sh/) installed
- Sanity.io Account
- Stripe Account (Test Mode)
- Clerk Account

### Installation

1. **Clone the repository:**

   ```bash
   git clone [https://github.com/kumaraswini-11/ai-powered-ecommerce-platform.git](https://github.com/kumaraswini-11/ai-powered-ecommerce-platform.git)
   cd ai-powered-ecommerce-platform
   ```

2. **Install dependencies:**

   ```bash
   bun install
   ```

3. **Environment Setup:**
   Create a `.env` file based on `.env.example`:

   ```bash
   cp .env.example .env
   ```

   > ⚠️ **Note:** Ensure `NEXT_PUBLIC_` prefixes are only used for variables intended for the client-side.

4. **Run Development Server:**

   ```bash
   bun run dev
   ```

5. **Import Sanity Sample Data:** To quickly populate your store (NEXT_PUBLIC_SANITY_DATASET), you can import sample data using the following command: `bunx sanity dataset import sample-data.ndjson production --replace`

   💡 **Note:** The Sanity import command operates on **newline‑delimited JSON (NDJSON)** files, where _each line is a complete JSON object representing a document_. A normal `.json` file (e.g., a single JSON array) will **not work** with the `sanity dataset import` command.  
   See: [Official Sanity Import Docs](https://www.sanity.io/docs/importing-data)

---

## 📄 License

This project is licensed under the **MIT License**. It is intended for educational and demonstration purposes.
