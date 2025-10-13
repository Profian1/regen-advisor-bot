# 🌱 AgroSense — AI-Powered Sustainable Farming Assistant

## 💡 Overview

**AgroSense** is an AI-driven web assistant designed to help smallholder farmers and agricultural communities make **data-informed, eco-friendly farming decisions**.
By analyzing basic inputs such as **crop type**, **soil condition**, and **rainfall levels**, AgroSense provides **personalized regenerative agriculture advice** — along with **scientific justifications** for each recommendation.

The project was developed during the **🌍 Land ReGen Hackathon (October 2025)**, under the theme *“AI for Land Rehabilitation and Sustainability.”*

---

## 🎯 Problem Statement

Across many regions, **soil degradation**, **erosion**, and **declining productivity** threaten food security and local livelihoods.
Farmers often lack **accessible expert guidance** on sustainable practices that can restore soil health while maintaining yields.

Traditional agricultural extension systems are often underfunded or unavailable in remote areas — leaving farmers with limited, outdated, or costly information.

---

## 🌾 Solution

**AgroSense** empowers farmers with instant, **AI-generated regenerative farming advice** directly from their browsers or mobile devices.

### Key Features

* 🧠 **AI Advisor:** Provides 3 actionable farming tips based on user input (e.g., “Plant cover crops,” “Apply compost mulch,” etc.).
* 🌍 **Scientific Justification:** Each set of recommendations includes a concise explanation rooted in soil science and agroecology.
* 💾 **Database Integration:** Every user query (problem and advice) is securely logged in a database.
* 🔄 **Live Community Feed:** Displays the last 3–5 recent farmer queries to show real-time engagement.
* 💚 **Eco-Friendly Focus:** Avoids chemical fertilizers and deep tilling; prioritizes organic, sustainable practices.

---

## 🧠 How It Works

1. The user inputs:

   * **Crop Type** (e.g., maize, beans)
   * **Soil Condition** (e.g., dry, compacted)
   * **Rainfall Level** (e.g., 200mm/month)

2. AgroSense sends this data to the **AI API** with a custom system prompt that instructs the AI to:

   * Provide *3 actionable recommendations*
   * Include a *scientific justification* explaining the advice

3. The results are:

   * Displayed in two visually distinct boxes: **Advice** (green) and **Justification** (yellow/brown)
   * Shown in a **Recent Queries** section at the bottom of the app

---

## 🌍 Impact on the Community

AgroSense supports **farmers, students, and agricultural extension officers** by:

* 🧑🏾‍🌾 Democratizing expert farming advice through AI
* 🌱 Encouraging the adoption of **regenerative and climate-smart agriculture**
* 💬 Building a shared knowledge base where users can see what others are asking
* 📉 Reducing dependence on synthetic inputs and improving **soil health and resilience**

By offering real-time, location-agnostic insights, AgroSense bridges the gap between **AI innovation** and **grassroots sustainability**.

---

## 🌎 Alignment with the United Nations Sustainable Development Goals (SDGs)

| SDG                                    | Alignment                                                         |
| -------------------------------------- | ----------------------------------------------------------------- |
| **SDG 2: Zero Hunger**                 | Promotes sustainable food production and soil fertility           |
| **SDG 13: Climate Action**             | Encourages carbon-sequestering and climate-resilient practices    |
| **SDG 15: Life on Land**               | Focuses on preventing land degradation and restoring ecosystems   |
| **SDG 17: Partnerships for the Goals** | Combines AI innovation with open data and community collaboration |

---

## 🧩 Future Enhancements

* 🌾 Integration with **GIS data** for location-based soil and rainfall mapping
* 🛰️ Satellite-powered monitoring (NDVI-based degradation tracking)
* 🔔 SMS or email alert system for farmers via **Resend API**
* 🗺️ Multi-language support for local communities
* 📊 Community leaderboard for shared sustainable practices

---

**Live Preview**

Simply visit the [Agro Sense](https://regen-advisor-bot.lovable.app)

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

---

## 🏁 Acknowledgements

Built with ❤️ during the **Land ReGen Hackathon 2025**
by **Ian Mwangi** 



