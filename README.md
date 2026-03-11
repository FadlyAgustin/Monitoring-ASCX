# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
=======
# ASCX Monitoring System - Frontend
Frontend application for the ASCX (Airport Security & Customer Experience) Monitoring System.
This system is designed to help supervisors and management monitor operational activities, track staff tasks, and improve visibility into airport security and customer service performance.

The application is built using TypeScript and React to ensure scalability, maintainability, and a better developer experience.

⸻

Project Overview

The ASCX Monitoring System provides a centralized dashboard to monitor operational tasks and performance related to Airport Security and Customer Experience.

The system enables real-time tracking of staff activities, task progress, and operational reports to support better decision-making and operational transparency.

⸻

Features
	•	Task monitoring and activity tracking
	•	Real-time operational status updates
	•	Staff performance monitoring
	•	Interactive dashboard and analytics
	•	Role-based access control
	•	Secure authentication
	•	Responsive user interface

⸻

Tech Stack
	•	React
	•	TypeScript
	•	Node.js
	•	REST API Integration
	•	Modern UI Components

⸻

Project Structure
src
 ┣ assets
 ┃ ┗ icons
 ┃
 ┣ auth
 ┃ ┣ AuthLayout
 ┃ ┗ DashboardLayouth
 ┃
 ┣ components
 ┃ ┣ card
 ┃ ┣ common
 ┃ ┣ layout
 ┃ ┗ ui
 ┃
 ┣ pages
 ┃ ┣ auth
 ┃ ┣ dashboard
 ┃ ┗ skeleton
 ┃
 ┣ services
 ┃ ┣ api.tsx
 ┃ ┗ auth.tsx
 ┃
 ┣ ts
 ┃ ┣ echo.tsx
 ┃ ┗ global.tsx
 ┃
 ┣ App.tsx
 ┣ index.css
 ┗ main.tsx

 ⸻

 Installation
   Clone Repository:
     git clone https://github.com/username/ascx-monitoring-frontend.git
     
   Masuk ke folder project:
     cd ascx-monitoring-frontend

   Install Depedencies:
     npm install

   Jalankan Project:
     npm run dev
     
 ⸻

 API Integration
 Frontend terhubung dengan backend melalui REST API untuk:
  • Task management
	•	Staff monitoring
	•	Reporting system
	•	Authentication

⸻

Screenshots
<img width="1918" height="968" alt="Screenshot 2026-03-09 094205" src="https://github.com/user-attachments/assets/eebe14e2-479b-44a7-bf55-b318cf094ff9" />
<img width="1919" height="969" alt="Screenshot 2026-03-09 094335" src="https://github.com/user-attachments/assets/b61528eb-4d3d-4986-8714-2af522d35309" />
<img width="1919" height="966" alt="Screenshot 2026-03-09 094409" src="https://github.com/user-attachments/assets/20afdb2c-6b49-40df-901d-9fcd657e5a4b" />
<img width="1919" height="970" alt="Screenshot 2026-03-09 094505" src="https://github.com/user-attachments/assets/4d690805-22d3-4bb7-a2bf-438381e421f9" />
<img width="1919" height="969" alt="Screenshot 2026-03-09 094614" src="https://github.com/user-attachments/assets/b1f8fa71-703b-4647-93ba-4a0c22f85351" />

⸻

Future Improvements
	•	Real-time notification system
	•	Advanced analytics dashboard
	•	Mobile responsive improvements
	•	Performance optimization

⸻

License

This project is licensed under the MIT License.


 
>>>>>>> 6f326b3690b9c7e87fb1cfb9d116ff8f81d40b19
