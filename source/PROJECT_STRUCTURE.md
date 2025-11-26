source/
├── 📄 .gitignore
├── 📄 README.md
├── 📄 PROJECT_STRUCTURE.md
├── 📄 file_query.sql
├── 📄 replay_pid23084.log
├── 📂 .vscode/
│
├── 📂 Backend/ 
│   ├── 📄 .gitattributes
│   ├── 📄 .gitignore
│   ├── 📄 pom.xml
│   ├── 📄 mvnw
│   ├── 📄 mvnw.cmd
│   ├── 📂 .mvn/
│   ├── 📂 target/
│   └── 📂 src/
│       ├── 📂 main/
│       │   ├── 📂 java/com/acare/backend/
│       │   │   ├── 📄 BackendApplication.java
│       │   │   │
│       │   │   ├── 📂 config/
│       │   │   │   └── 📄 CorsConfig.java
│       │   │   │
│       │   │   ├── 📂 controller/
│       │   │   │   ├── 📄 UserController.java
│       │   │   │   ├── 📄 AppointmentController.java
│       │   │   │   ├── 📄 ServiceController.java
│       │   │   │   ├── 📄 RoomController.java
│       │   │   │   ├── 📄 ActivityController.java
│       │   │   │   ├── 📄 AuthController.java
│       │   │   │   └── 📄 CustomErrorController.java
│       │   │   │
│       │   │   ├── 📂 dto/
│       │   │   │   └── 📄 ResponseDTO.java
│       │   │   │
│       │   │   ├── 📂 entity/
│       │   │   │   ├── 📄 User.java
│       │   │   │   ├── 📄 Appointment.java
│       │   │   │   ├── 📄 Service.java
│       │   │   │   ├── 📄 Room.java
│       │   │   │   └── 📄 ActivityLog.java
│       │   │   │
│       │   │   ├── 📂 repository/
│       │   │   │   ├── 📄 UserRepository.java
│       │   │   │   ├── 📄 AppointmentRepository.java
│       │   │   │   ├── 📄 ServiceRepository.java
│       │   │   │   ├── 📄 RoomRepository.java
│       │   │   │   └── 📄 ActivityLogRepository.java
│       │   │   │
│       │   │   └── 📂 service/
│       │   │       ├── 📄 UserService.java
│       │   │       ├── 📄 AppointmentService.java
│       │   │       ├── 📄 ServiceService.java
│       │   │       └── 📄 ActivityLogService.java
│       │   │
│       │   ├── 📂 python/
│       │   │   └── 📂 RAG/  
│       │   │       ├── 📄 app.py
│       │   │       ├── 📄 config.py
│       │   │       ├── 📄 rag.py
│       │   │       ├── 📄 ingest.py
│       │   │       ├── 📄 requirements.txt
│       │   │       ├── 📂 data/
│       │   │       │   ├── 📂 docs/
│       │   │       │   │   └── 📄 CHATBOT_TRAINING_DATA.txt
│       │   │       │   └── 📂 raw_texts/
│       │   │       ├── 📂 vectordb/
│       │   │       │   ├── 📄 index.faiss
│       │   │       │   └── 📄 index.pkl
│       │   │       └── 📂 __pycache__/
│       │   │
│       │   └── 📂 resources/
│       │       └── 📄 application.properties
│       │
│       └── 📂 test/
│           └── 📂 java/com/acare/backend/
│               └── 📄 BackendApplicationTests.java
│
└── 📂 Frontend/ 
    ├── 📄 .gitignore
    ├── 📄 package.json
    ├── 📄 package-lock.json
    ├── 📄 vite.config.js
    ├── 📄 index.html
    ├── 📂 node_modules/
    ├── 📂 public/
    │
    └── 📂 src/
        ├── 📄 main.jsx
        ├── 📄 App.jsx
        │
        ├── 📂 api/
        │   ├── 📄 auth.js
        │   ├── 📄 getAnswerFromGemini.js
        │   │
        │   ├── 📂 activity/
        │   │   └── 📄 getRecentActivities.js
        │   │
        │   ├── 📂 appointment/
        │   │   ├── 📄 getAppointments.js
        │   │   ├── 📄 getAppointmentById.js
        │   │   ├── 📄 getAppointmentsByDoctorId.js
        │   │   ├── 📄 getTodayAppointments.js
        │   │   ├── 📄 filterAppointments.js
        │   │   ├── 📄 addAppoinment.js
        │   │   ├── 📂 delete/
        │   │   ├── 📂 done/
        │   │   ├── 📂 pending/
        │   │   └── 📂 update/
        │   │
        │   ├── 📂 room/
        │   │   ├── 📄 getRoom.js
        │   │   ├── 📄 getRoomById.js
        │   │   ├── 📄 addRoom.js
        │   │   ├── 📄 updateRoom.js
        │   │   ├── 📄 deleteRoom.js
        │   │   └── 📄 searchRooms.js
        │   │
        │   ├── 📂 service/
        │   │   ├── 📄 getServices.js
        │   │   ├── 📄 getServiceById.js
        │   │   ├── 📄 getServiceByName.js
        │   │   ├── 📄 addService.js
        │   │   ├── 📄 updateService.js
        │   │   ├── 📄 deleteService.js
        │   │   └── 📄 searchServices.js
        │   │
        │   └── 📂 user/
        │       ├── 📄 getUsers.js
        │       ├── 📄 getUser.js
        │       ├── 📄 getDoctors.js
        │       ├── 📄 getPatients.js
        │       ├── 📄 addUser.js
        │       ├── 📄 updateUser.js
        │       ├── 📄 deleteUser.js
        │       └── 📄 searchUsers.js
        │
        ├── 📂 assets/
        │   ├── 📂 fonts/
        │   ├── 📂 images/
        │   │   ├── 📂 auth/
        │   │   ├── 📂 booking/
        │   │   ├── 📂 cart/
        │   │   ├── 📂 doctor/
        │   │   ├── 📂 logo/
        │   │   └── 📂 profile/
        │   └── 📂 styles/
        │       └── 📄 index.css
        │
        ├── 📂 components/
        │   ├── 📄 Header.jsx
        │   ├── 📄 Footer.jsx
        │   ├── 📄 SideBar.jsx
        │   └── 📄 Chatbot.jsx
        │
        ├── 📂 contexts/
        │   └── 📄 SideBarContext.jsx
        │
        ├── 📂 data/
        │   ├── 📄 faq.js
        │   ├── 📄 footerList.js
        │   └── 📄 headerList.js
        │
        ├── 📂 layouts/
        │   └── 📄 MainLayout.jsx
        │
        ├── 📂 pages/
        │   ├── 📄 About.jsx
        │   ├── 📄 Contact.jsx
        │   ├── 📄 Services.jsx
        │   ├── 📄 FAQ.jsx
        │   ├── 📄 Profile.jsx
        │   ├── 📄 EditProfile.jsx
        │   ├── 📄 Instruction.jsx
        │   ├── 📄 NotFound.jsx
        │   │
        │   ├── 📂 admin/
        │   │   ├── 📂 dashboard/
        │   │   │   ├── 📄 Dashboard.jsx
        │   │   │   └── 📄 DashboardReportTable.jsx
        │   │   │
        │   │   ├── 📂 user-management/
        │   │   │   ├── 📄 Users.jsx
        │   │   │   ├── 📄 AddUser.jsx
        │   │   │   ├── 📄 UpdateUser.jsx
        │   │   │   └── 📄 ShowUser.jsx
        │   │   │
        │   │   ├── 📂 service-management/
        │   │   │   ├── 📄 Services.jsx
        │   │   │   ├── 📄 AddService.jsx
        │   │   │   ├── 📄 UpdateService.jsx
        │   │   │   └── 📄 ShowService.jsx
        │   │   │
        │   │   ├── 📂 room-management/
        │   │   │   ├── 📄 Rooms.jsx
        │   │   │   ├── 📄 AddRoom.jsx
        │   │   │   └── 📄 UpdateRoom.jsx
        │   │   │
        │   │   └── 📂 appointment-management/
        │   │       ├── 📄 Appointments.jsx
        │   │       └── 📄 AppointmentLine.jsx
        │   │
        │   ├── 📂 auth/
        │   │   ├── 📄 Login.jsx
        │   │   └── 📄 Register.jsx
        │   │
        │   ├── 📂 doctor/
        │   ├── 📂 patient/
        │   └── 📂 home/
        │
        ├── 📂 routes/
        │   └── 📄 index.jsx
        │
        └── 📂 utils/
            └── 📄 authUtils.js

