🚀 Employee Performance & Task Management System (MERN)

A backend-focused MERN application that models real-world company workflows such as task assignment, performance reviews, attendance tracking, internal communication, and document management.

Built to demonstrate enterprise-style role-based access control, relational data modeling, and scalable REST APIs.

✨ Key Features

- JWT-based authentication & authorization  
- Employee–Manager–HR hierarchy  
- Task assignment, monitoring, and lifecycle tracking  
- Performance review workflow (Employee → Manager → HR)  
- Attendance monitoring for managers  
- Internal announcements, feedback & kudos  
- Employee document upload & verification  
- Real-time notifications (Socket.IO)  

🛠️ Tech Stack

- Backend: Node.js, Express.js, MongoDB, Mongoose  
- Authentication: JWT  
- Real-time: Socket.IO  
- Frontend: React, Tailwind CSS  

🧠 System Highlights

- Role-based access control (Employee, Manager, HR)  
- Managers can only access their assigned team data  
- Multi-stage performance review approval flow  
- Deadline-based overdue task detection  
- Secure and scalable schema relationships  

⚙️ Setup

```bash
git clone https://github.com/shairaaktar/employee-management-system.git
cd employee-management-system
npm install
npm run dev
