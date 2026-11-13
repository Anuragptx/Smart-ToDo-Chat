# Smart Todo-Chat

### A Smarter Way to Organize Your Day.

Smart Todo-Chat is a modern task management and productivity application built with React. It combines intuitive task organization, an intelligent task assistant, and productivity analytics to help users manage their daily activities efficiently.

Designed with a clean interface and practical features, Smart Todo-Chat makes planning, tracking, and completing tasks simple and organized.

---

## Features

### Task Management
- Create, edit, and delete tasks.
- Set task priorities: High, Medium, and Low.
- Add descriptions, categories, and due dates.
- Mark tasks as completed or pending.
- Organize tasks using custom categories.
- Break larger tasks into smaller subtasks.
- Undo recently completed tasks.

### Smart Assistant
- Intelligent task priority suggestions.
- Automatic subtask generation.
- Task analysis based on keywords.
- Suggestions for organizing complex tasks.
- Dedicated assistant interface.

### Productivity Analytics
- Track completed and pending tasks.
- Monitor daily and weekly productivity.
- Visualize task completion statistics.
- Track productivity streaks.
- Identify productive days.
- Get insights based on task activity.

### Task Organization
- Search tasks quickly.
- Filter tasks by priority and status.
- View today's tasks.
- Track upcoming deadlines.
- Access completed tasks.
- Sort tasks based on different criteria.

### Personalization
- Modern and responsive user interface.
- Dark and light themes.
- Customizable profile settings.
- Sound effects for interactions.
- Keyboard shortcuts.
- Interactive notifications.

### Data Management
- Automatic data persistence using Local Storage.
- Export tasks in JSON format.
- Export tasks in CSV format.
- Save user preferences and application settings.

---

## Tech Stack

| Technology | Usage |
|---|---|
| React 19 | Frontend development |
| JavaScript | Application logic |
| Vite | Development and build tool |
| CSS3 | Styling and responsive design |
| HTML5 | Application structure |
| Local Storage | Data persistence |
| ESLint | Code quality |

---

## Project Structure

```text
Smart Todo-Chat/
│
├── public/
│
├── src/
│   ├── components/
│   │   ├── analytics/
│   │   ├── modals/
│   │   ├── tasks/
│   │   └── ui/
│   │
│   ├── constants/
│   ├── hooks/
│   ├── layouts/
│   ├── services/
│   ├── utils/
│   │
│   ├── App.jsx
│   ├── App.css
│   ├── index.css
│   └── main.jsx
│
├── index.html
├── package.json
├── vite.config.js
└── eslint.config.js
```

---

## Getting Started

Follow these instructions to run the project on your local machine.

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/smart-todo-chat.git
```

### 2. Navigate to the Project Directory

```bash
cd smart-todo-chat
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Start the Development Server

```bash
npm run dev
```

### 5. Open in Browser

Visit the local development URL:

```text
http://localhost:5173
```

---

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Starts the development server |
| `npm run build` | Builds the application for production |
| `npm run preview` | Previews the production build |
| `npm run lint` | Runs ESLint checks |

---

## Smart Assistant

The application includes a lightweight, rule-based task intelligence system.

It analyzes task-related keywords to provide priority recommendations and generate relevant subtasks.

**Example:**

Input:

`Prepare for upcoming exams`

Suggested subtasks:
- Review study material.
- Practice important questions.
- Prepare revision notes.
- Complete final revision.

This helps make larger tasks easier to organize and manage.

---

## Future Enhancements

- Cloud synchronization.
- User authentication.
- Collaborative task management.
- Calendar integration.
- Push notifications.
- Cross-device accessibility.
- Advanced AI-powered task recommendations.

---

## Contributing

Contributions, suggestions, and improvements are welcome.

To contribute:

1. Fork this repository.
2. Create a new branch.
3. Make your changes.
4. Commit your changes.
5. Submit a Pull Request.

---

## License

This project is currently intended for educational and personal use. A formal open-source license can be added when required.

---

<div align="center">

**Smart Todo-Chat**

Plan Better. Stay Organized. Get Things Done.

</div>
