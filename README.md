# NC News Seeding

A RESTful API for a news aggregation service, built with Node.js, Express, and PostgreSQL.

## Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL (v15 or higher)
- Git

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/nc-news-project.git
cd nc-news-project
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Database Configuration
Create these environment files:
#### .env.test
```env
PGDATABASE=nc_news_test
```
#### .env.development
```env
PGDATABASE=nc_news
```
#### Important: these files are included in `.gitignore` - never commit them!