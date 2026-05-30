**Interface**
<img width="1488" height="878" alt="Page" src="https://github.com/user-attachments/assets/fa07abe4-4cf4-4112-894c-40b5354af097" />
<img width="1488" height="878" alt="Interface" src="https://github.com/user-attachments/assets/327c5838-3a43-4ed5-b2f4-b9251f84b1f2" />
**Project Structure**
```
VisGuard/
├── 📄 index.html              # Entry HTML file
├── 📄 package.json            # Project dependencies & scripts
├── 📄 vite.config.js          # Vite configuration
├── 📄 tailwind.config.js      # Tailwind CSS configuration
├── 📄 eslint.config.js        # ESLint configuration
├── 📄 README.md               # Project documentation
│
├── 📁 src/                    # Source code
│   ├── App.jsx                # Main app component
│   ├── main.jsx               # React entry point
│   ├── index.css              # Global styles
│   └── 📁 assets/             # Static assets
│
├── 📁 pages/                  # Page components
│   ├── LandingPage.jsx        # Landing page
│   ├── SignInPage.jsx         # Login page
│   ├── SignUpPage.jsx         # Registration page
│   ├── AuthPage.jsx           # Authentication page
│   ├── AnalyticsPage.jsx      # Analytics dashboard
│   ├── ChatPage.jsx           # Chat interface
│   ├── ConfigurationPage.jsx  # Settings & config
│   ├── LiveStreamingPage.jsx  # Live stream page
│   ├── MapPage.jsx            # Map interface
│   └── NotificationPage.jsx   # Notifications page
│
├── 📁 components/             # Reusable components
│   ├── 📁 ui/                 # Basic UI components
│   │   ├── Button.jsx
│   │   ├── Card.jsx
│   │   ├── Dialog.jsx
│   │   └── Input.jsx
│   │
│   ├── 📁 layout/             # Layout components
│   │   ├── Navbar.jsx
│   │   └── Sidebar.jsx
│   │
│   └── 📁 dashboard/          # Dashboard-specific components
│       ├── Alerts.jsx
│       ├── BirdsEyeView.jsx
│       ├── CameraView.jsx
│       ├── ChartSection.jsx
│       ├── ClasswiseTable.jsx
│       ├── GlassCard.jsx
│       ├── LiveFeed.jsx
│       ├── StatCard.jsx
│       ├── StatsSection.jsx
│       │
│       ├── 📁 livestream/    # Live streaming components
│       │   ├── CameraCard.jsx
│       │   ├── CameraGrid.jsx
│       │   ├── CameraHeader.jsx
│       │   └── LiveHeader.jsx
│       │
│       └── 📁 zones/         # Zone management components
│           ├── ZoneCanvas.jsx
│           ├── ZoneControls.jsx
│           ├── ZonePoint.jsx
│           ├── ZoneRadialMenu.jsx
│           └── 📁 zones_interaction/  # Zone event handlers
│               ├── handleCanvasClick.js
│               ├── handleMouseDown.js
│               ├── handleMouseMove.js
│               ├── handleMouseUp.js
│               ├── saveZone.js
│               └── deleteZone.js
│
├── 📁 hooks/                  # Custom React hooks
│   └── useVideoEngine.js      # Video engine hook
│
├── 📁 data/                   # Static data & configs
│   ├── areasData.js
│   ├── chartData.js
│   ├── statsData.js
│   └── videoConfig.js
│
├── 📁 public/                 # Public static files
├── 📁 research_part/          # Research/documentation
├── 📁 venv/                   # Python virtual environment
├── 📁 node_modules/           # NPM packages
│
└── Configuration Files
    ├── .git/                  # Git repository
    ├── .gitignore
    └── package-lock.json
```


