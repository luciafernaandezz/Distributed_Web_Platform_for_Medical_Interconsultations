# Distributed_Web_Platform_for_Medical_Interconsultations
University project: distributed web system built with Node.js, REST, RPC, and WebSockets to manage consultations between primary care and specialist doctors.

##  Project Overview
The goal of the project is to design and implement a **multi-module system** for managing medical cases and communication between doctors.  
It includes:
- A **central server** built with **Node.js** that handles all data and communication.
- A **web application for MAPs** (primary care physicians) to create and manage patient records.
- A **web application for MEs** (specialists) to access, respond to, and resolve interconsultations.

The system uses different communication mechanisms:
- **REST Web Services**
- **RPC (Remote Procedure Calls)**
- **WebSockets** for real-time chat between doctors.

## System Architecture
MAP App (REST + WebSockets)<----> Server (Node.js) <----> ME App (RPC + WebSockets)

- **Server:** Node.js application managing all information in memory (no database used).  
- **MAP Web App:** Implements asynchronous REST API communication.  
- **ME Web App:** Uses asynchronous RPC calls for data interaction.  
- **Chat Module:** Built with WebSockets for instant messaging between MAPs and MEs.

## Technologies Used
- **Frontend:** HTML, CSS, JavaScript  
- **Backend:** Node.js, Express  
- **Communication:** REST API, RPC, WebSockets  
- **Data Handling:** In-memory JavaScript objects and arrays  

## Main Features
### MAP Application
- User registration and login 
- Dashboard showing all created cases with details such as creation and resolution dates.  
- Ability to add, view, edit, and delete interconsultation records.  
- Real-time chat with assigned specialists.  

### ME Application
- User registration and login with specialist details.  
- Dashboard to view available interconsultations filtered by specialty.  
- Ability to assign themselves to open cases and respond with a diagnosis or recommendation.  
- Chat module for direct communication with the MAP.  

### Server
- Single Node.js server integrating **REST**, **RPC**, and **WebSocket** endpoints.  
- Stores all system data in arrays of objects:
  - `specialties`, `centers`, `doctors`, `records`  
- Each array is reset when the server restarts (no persistent database).

## How to Run the Project
1. Open a terminal and navigate to the project folder:  
   `cd practica_REST_RPC`
2. Start the server:
   `node servidor.js`
3. Once the server is running, open your browser and access the following URLs:
- For the **specialist app (ME)**: http://localhost:3000/me/
- For the **primary care app (MAP)**: http://localhost:3000/map/
