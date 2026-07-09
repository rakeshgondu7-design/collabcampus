// Meaningful dummy data used across the app.
export const currentUser = {
  id: "u_001",
  name: "Aarav Sharma",
  email: "aarav.sharma@campus.edu",
  role: "Student" as "Student" | "Faculty" | "Placement Officer" | "Club Coordinator" | "Admin",
  department: "Computer Science & Engineering",
  year: "3rd Year",
  rollNo: "CSE21B045",
  avatar: "https://api.dicebear.com/9.x/initials/svg?seed=Aarav%20Sharma",
  cgpa: 8.72,
  attendance: 87,
  skills: ["React", "TypeScript", "Node.js", "Python", "PostgreSQL", "AWS", "Figma"],
  github: "aarav-sharma",
  linkedin: "aarav-sharma",
  portfolio: "aarav.dev",
};

export const notices = [
  { id: 1, title: "Mid-semester exams schedule released", category: "Exam", date: "2026-07-08", author: "Exam Cell", priority: "high" },
  { id: 2, title: "TCS Digital hiring drive — Register by July 14", category: "Placement", date: "2026-07-07", author: "Placement Cell", priority: "high" },
  { id: 3, title: "IEEE Student Chapter — call for volunteers", category: "Club", date: "2026-07-06", author: "IEEE Chapter", priority: "medium" },
  { id: 4, title: "Library timings extended during exam week", category: "College", date: "2026-07-05", author: "Admin Office", priority: "low" },
  { id: 5, title: "Data Structures assignment 3 due July 12", category: "Department", date: "2026-07-04", author: "Prof. Rao", priority: "medium" },
  { id: 6, title: "Annual cultural fest 'Rhythm 2026' — registrations open", category: "College", date: "2026-07-03", author: "Cultural Committee", priority: "medium" },
];

export const events = [
  { id: 1, title: "HackCampus 2026 — 36 hr Hackathon", date: "2026-07-18", venue: "Innovation Lab", category: "Technical", registrations: 214, capacity: 300 },
  { id: 2, title: "Resume Building Workshop", date: "2026-07-12", venue: "Auditorium B", category: "Placement", registrations: 88, capacity: 150 },
  { id: 3, title: "TEDx CampusConnect", date: "2026-07-25", venue: "Main Auditorium", category: "Cultural", registrations: 412, capacity: 500 },
  { id: 4, title: "AI/ML Bootcamp — Weekend Series", date: "2026-07-20", venue: "Room 302", category: "Technical", registrations: 62, capacity: 80 },
  { id: 5, title: "Inter-college Football Tournament", date: "2026-08-02", venue: "Sports Ground", category: "Sports", registrations: 24, capacity: 32 },
];

export const teamProjects = [
  { id: 1, title: "Campus Food Delivery App", owner: "Priya Nair", ownerAvatar: "PN", description: "Building a food ordering app connecting canteen and hostels with real-time tracking.", skills: ["Flutter", "Firebase", "Node.js"], needed: 3, applicants: 9, deadline: "2026-07-20", status: "Open" },
  { id: 2, title: "IoT Smart Attendance", owner: "Rahul Menon", ownerAvatar: "RM", description: "RFID + facial recognition based attendance system for classrooms.", skills: ["Python", "OpenCV", "Arduino"], needed: 2, applicants: 5, deadline: "2026-07-30", status: "Open" },
  { id: 3, title: "Mental Health Chatbot", owner: "Sneha Iyer", ownerAvatar: "SI", description: "AI-powered anonymous support chatbot for students, hosted on-campus.", skills: ["NLP", "React", "Fine-tuning"], needed: 4, applicants: 14, deadline: "2026-08-05", status: "Open" },
  { id: 4, title: "Sustainable Campus Dashboard", owner: "Aarav Sharma", ownerAvatar: "AS", description: "Live energy + water monitoring dashboard across campus buildings.", skills: ["React", "D3.js", "MQTT"], needed: 2, applicants: 3, deadline: "2026-07-28", status: "Open" },
];

export const resources = [
  { id: 1, title: "Operating Systems — Complete Notes", type: "PDF", subject: "OS", uploader: "Kavya R.", rating: 4.8, downloads: 1240, likes: 312 },
  { id: 2, title: "DBMS Lab Programs (All 12)", type: "ZIP", subject: "DBMS", uploader: "Rohan G.", rating: 4.6, downloads: 890, likes: 201 },
  { id: 3, title: "Machine Learning — CS229 Slides", type: "PPT", subject: "ML", uploader: "Anika S.", rating: 4.9, downloads: 2103, likes: 512 },
  { id: 4, title: "DSA Interview Question Bank", type: "PDF", subject: "DSA", uploader: "Vikram P.", rating: 4.7, downloads: 3021, likes: 802 },
  { id: 5, title: "Previous Year Papers — CN 2019–2024", type: "PDF", subject: "Networks", uploader: "Admin", rating: 4.5, downloads: 1580, likes: 240 },
  { id: 6, title: "React + TypeScript Cheatsheet", type: "PDF", subject: "Web Dev", uploader: "Aarav S.", rating: 4.9, downloads: 640, likes: 178 },
];

export const placements = [
  { id: 1, company: "Google", role: "SDE Intern", package: "₹1.8L/mo", cgpa: 8.0, deadline: "2026-07-15", status: "Open", eligibility: "CSE/ISE" },
  { id: 2, company: "Microsoft", role: "SWE New Grad", package: "₹52 LPA", cgpa: 8.5, deadline: "2026-07-20", status: "Open", eligibility: "All Branches" },
  { id: 3, company: "Amazon", role: "SDE-1", package: "₹44 LPA", cgpa: 7.5, deadline: "2026-07-25", status: "Open", eligibility: "CSE/ISE/ECE" },
  { id: 4, company: "TCS Digital", role: "Systems Engineer", package: "₹9 LPA", cgpa: 7.0, deadline: "2026-07-14", status: "Closing Soon", eligibility: "All Branches" },
  { id: 5, company: "Deloitte", role: "Analyst", package: "₹11 LPA", cgpa: 7.0, deadline: "2026-08-01", status: "Open", eligibility: "All Branches" },
];

export const lostFound = [
  { id: 1, type: "Lost", title: "Black Titan wristwatch", location: "Library, 2nd floor", date: "2026-07-06", category: "Accessories", verified: true },
  { id: 2, type: "Found", title: "USB drive (Sandisk 32GB)", location: "Lab 4", date: "2026-07-05", category: "Electronics", verified: true },
  { id: 3, type: "Lost", title: "Blue college ID card — Meera K.", location: "Canteen", date: "2026-07-04", category: "ID Card", verified: false },
  { id: 4, type: "Found", title: "Set of car keys with Ganesha keychain", location: "Parking B", date: "2026-07-03", category: "Keys", verified: true },
];

export const ideas = [
  { id: 1, title: "Skill-swap marketplace inside campus", author: "Anonymous Student", category: "Startup", likes: 142, comments: 28, anonymous: true },
  { id: 2, title: "Solar-powered charging stations near hostels", author: "Nikhil V.", category: "Campus Improvement", likes: 98, comments: 14, anonymous: false },
  { id: 3, title: "Peer-review platform for lab reports", author: "Anonymous Student", category: "Academic", likes: 76, comments: 22, anonymous: true },
  { id: 4, title: "Research paper reading group — weekly", author: "Dr. Kamath (Faculty)", category: "Research", likes: 54, comments: 9, anonymous: false },
];

export const notifications = [
  { id: 1, type: "team", text: "Priya Nair accepted your application to 'Campus Food Delivery App'", time: "2h ago", unread: true },
  { id: 2, type: "placement", text: "Google SDE Intern deadline is in 6 days", time: "5h ago", unread: true },
  { id: 3, type: "event", text: "You're registered for HackCampus 2026", time: "1d ago", unread: false },
  { id: 4, type: "notice", text: "New notice from Exam Cell: Mid-sem schedule", time: "1d ago", unread: false },
  { id: 5, type: "idea", text: "Your idea got 12 new upvotes", time: "2d ago", unread: false },
];

export const attendanceBySubject = [
  { subject: "Operating Systems", attended: 32, total: 36, percent: 89 },
  { subject: "DBMS", attended: 28, total: 34, percent: 82 },
  { subject: "Computer Networks", attended: 30, total: 33, percent: 91 },
  { subject: "Machine Learning", attended: 24, total: 30, percent: 80 },
  { subject: "Software Engineering", attended: 27, total: 30, percent: 90 },
];

export const attendanceTrend = [
  { month: "Feb", percent: 78 }, { month: "Mar", percent: 82 }, { month: "Apr", percent: 85 },
  { month: "May", percent: 84 }, { month: "Jun", percent: 88 }, { month: "Jul", percent: 87 },
];

export const assignments = [
  { id: 1, title: "OS: Process Scheduling Simulation", due: "2026-07-12", status: "Pending", subject: "OS" },
  { id: 2, title: "DBMS: Normalization exercise set 3", due: "2026-07-14", status: "Pending", subject: "DBMS" },
  { id: 3, title: "ML: Linear Regression from scratch", due: "2026-07-18", status: "Submitted", subject: "ML" },
  { id: 4, title: "CN: Socket programming assignment", due: "2026-07-20", status: "Pending", subject: "CN" },
];
