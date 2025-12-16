# Job Search Dashboard

A professional, production-ready web application to systematically track your job applications throughout your job search journey.

![Job Search Dashboard](https://img.shields.io/badge/React-18.3-blue) ![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8) ![Vite](https://img.shields.io/badge/Vite-7.3-646cff)

## Features

### Core Functionality

- **Job Application Tracking**: Add, edit, and delete job applications with comprehensive details
- **Multiple Dashboard Views**:
  - **Kanban Board**: Drag-and-drop interface to move applications between stages
  - **List View**: Sortable table with advanced filters and search
  - **Calendar View**: Visualize upcoming deadlines and next actions
  - **Analytics Dashboard**: Charts and insights about your job search

### Application Fields

Each job application includes:
- Company name and role/position
- Application date
- Method (Referral, Direct Outreach, LinkedIn, Company Website)
- Stage (Applied → Screening → Interview 1 → Case Study → Final Interview → Offer → Rejected)
- Priority (1-10 with color coding)
- Next action and deadline
- Salary range
- Notes
- Job description URL

### Analytics & Insights

- Total applications count
- Applications by stage (pie chart)
- Applications over time (line chart showing weekly trends)
- Response rate by application method
- Average time in each stage
- Conversion funnel (Applied → Interviews → Offers)
- Success metrics and statistics

### Smart Features

- **Quick Actions**: Alerts for applications needing follow-up
- **Priority-Based Color Coding**: Visual indicators for high/medium/low priority
- **Deadline Tracking**: Today, upcoming, and overdue indicators
- **Data Persistence**: Automatic saving to browser localStorage
- **Export/Import**: Backup and restore your data as JSON
- **Sample Data**: Pre-loaded examples to get you started
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile

## Tech Stack

- **Frontend**: React 18 with functional components and hooks
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Icons**: Lucide React
- **Drag-and-Drop**: @hello-pangea/dnd
- **Date Handling**: date-fns
- **Build Tool**: Vite

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone or download the repository**

2. **Install dependencies**
   ```bash
   npm install --cache /tmp/npm-cache
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

### Building for Production

```bash
npm run build
```

The production-ready files will be in the `dist` directory.

### Preview Production Build

```bash
npm run preview
```

## Usage Guide

### Adding a New Application

1. Click the floating "+" button in the bottom-right corner
2. Fill in the application details
3. Click "Add Application"

### Managing Applications

- **Edit**: Click the edit icon on any application card or row
- **Delete**: Click the delete icon (with confirmation)
- **Change Stage**: Drag and drop cards in Kanban view or edit in List view

### Using Filters (List View)

- Search by company name or role
- Filter by stage, method, or priority level
- Sort by any column (click column headers)
- Clear all filters with one click

### Tracking Deadlines

- **Calendar View**: See all deadlines in a monthly calendar
- **Quick Actions Banner**: Get alerts for overdue or today's deadlines
- **Color Indicators**: Visual cues for deadline urgency

### Analyzing Your Progress

- Navigate to the Analytics tab
- View charts and metrics
- Track conversion rates and response rates
- Identify which application methods work best

### Data Management

- **Export**: Download your data as JSON (top-right menu)
- **Import**: Upload a previously exported JSON file
- **Clear All**: Remove all data (with confirmation)

## Project Structure

```
job-search-dashboard/
├── src/
│   ├── components/
│   │   ├── AnalyticsView.jsx      # Analytics dashboard with charts
│   │   ├── CalendarView.jsx       # Calendar view for deadlines
│   │   ├── Header.jsx              # Top header with export/import
│   │   ├── JobFormModal.jsx        # Add/edit form modal
│   │   ├── KanbanView.jsx          # Drag-and-drop kanban board
│   │   ├── ListView.jsx            # Filterable list view
│   │   └── QuickActions.jsx        # Follow-up notifications
│   ├── context/
│   │   └── JobContext.jsx          # Global state management
│   ├── data/
│   │   └── sampleData.js           # Sample applications
│   ├── utils/
│   │   ├── dateUtils.js            # Date formatting utilities
│   │   └── localStorage.js         # Data persistence
│   ├── App.jsx                     # Main app component
│   ├── index.css                   # Global styles with Tailwind
│   ├── main.jsx                    # App entry point
│   └── types.js                    # Type definitions & constants
├── public/                         # Static assets
├── index.html                      # HTML template
├── package.json                    # Dependencies
├── tailwind.config.js              # Tailwind configuration
├── vite.config.js                  # Vite configuration
└── README.md                       # This file
```

## Data Storage

All data is stored in browser localStorage under the key `job-search-dashboard`. Your data persists between sessions and is automatically saved when you make changes.

**Important**:
- Data is stored locally in your browser
- Clearing browser data will erase your applications
- Use Export/Import to backup your data
- Data is not synced across devices

## Customization

### Changing Colors

Edit `tailwind.config.js` to customize the color scheme:

```javascript
theme: {
  extend: {
    colors: {
      primary: {
        // Your custom colors
      },
    },
  },
}
```

### Adding New Stages or Methods

Edit `src/types.js`:

```javascript
export const STAGES = [
  'Applied',
  'Your New Stage',
  // ...
];

export const METHODS = [
  'Your New Method',
  // ...
];
```

## Browser Compatibility

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Performance

- Fast initial load with Vite
- Optimized re-renders with React hooks
- Efficient drag-and-drop with @hello-pangea/dnd
- Responsive charts with Recharts

## Troubleshooting

### Dev Server Won't Start

If you encounter npm cache permission issues:
```bash
npm install --cache /tmp/npm-cache
```

### Data Not Persisting

Check if localStorage is enabled in your browser. Some privacy modes disable it.

### Charts Not Rendering

Ensure you have applications with data. Charts require at least one application to display.

## Future Enhancements

Potential features for future versions:
- Dark mode toggle
- Templates for cover letters and messages
- Company research notes section
- Weekly review prompts and reminders
- Email notifications for deadlines
- Browser extension
- Mobile app
- Cloud sync and backup

## License

This project is open source and available for personal use.

## Support

For issues, questions, or suggestions, please create an issue in the repository.

---

**Built with React, Tailwind CSS, and modern web technologies.**

Happy job hunting!
