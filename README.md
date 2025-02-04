# 🚀 Chrome Extension: AI Helper for Gmail

## 📝 About

This Chrome extension enhances Gmail by providing **AI-powered thread summaries** and **custom notes system**, making it easier for users to quickly grasp the key points of long email conversations. Built with **JavaScript, React, Express, MongoDB, and OAuth 2.0**, it integrates seamlessly into Gmail for an optimized workflow.

## 🔗 Live Demo

The deployment to Google Store is in progress.

## ⚡ Tech Stack

- **Frontend:** React, JavaScript
- **Backend:** Express, MongoDB
- **Authentication:** OAuth 2.0 (Google Sign-In)
- **AI Integration:** OpenAI API
- **Build Tools:** Webpack

## 📂 Project Structure

```
📦 src
 ├── background/         # Background scripts handling persistent tasks
 │   ├── api/
 │   ├── auth/
 │   ├── backgroundMain.js
 │
 ├── content/            # Content scripts interacting with the Gmail UI
 │   ├── aiFunctionalityUtils.js
 │   ├── hashHandler.js
 │   ├── messagesToBk.js
 │   ├── observer.js
 │
 ├── dashboard/          # User-facing dashboard for managing summaries
 │   ├── dsBtnListenersForLogin.js
 │   ├── dsBtnListenersForNotes.js
 │   ├── dsBtnListenersForScreens.js
 │   ├── dsMainLogic.js
 │   ├── dsNoteManipulation.js
 │   ├── dsNotifHandler.js
 │   ├── dsSummaryManipulation.js
 │   ├── dsUtils.js
 │
 ├── widget/             # Popup UI and widgets
 │   ├── index.js
 │   ├── popup.js
 │
 ├── static/             # Static assets (icons, styles, etc.)
 │
 ├── utils.js            # Utility functions
 │
 ├── package.json        # Dependencies and scripts
 ├── webpack.config.js   # Webpack configuration
 └── .gitignore          # Ignored files
```

## 📸 Screenshots

### 🔹 Summary Feature

![Summary Feature](static/screenshots/summary-screen-new.png)

### 🔹 Login View

![Login Screen](static/screenshots/login-screen-new.png)

### 🔹 Notes View

![Login Screen](static/screenshots/notes-screen-new.png)

## 🤝 Connect with Me

- **LinkedIn:** [linkedin.com/in/ivan-via/](https://www.linkedin.com/in/ivan-via/)
- **GitHub:** [github.com/ivanvia7](https://github.com/ivanvia7)
- **Email:** [ivanvia.work@gmail.com](mailto:ivanvia.work@gmail.com)
