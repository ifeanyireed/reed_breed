1. Seed the Database:
  I have already seeded the database for you. You can use these credentials:
   * Admin: admin@reedbreed.cc / admin123
   * Client: client@example.com / client123

//Sounds
https://developers.google.com/assistant/tools/sound-library/office

To run your new Laravel PHP backend locally, you just need to use Laravel's built-in development server. 

  Since you are using Laravel Herd for your PHP environment, you can start the backend by
  following these steps:

   1. Open a new terminal window (keep your frontend terminal separate).
   2. Navigate to the backend directory:

   1    cd backend
   3. Start the development server:

   1    export PATH="$HOME/Library/Application Support/Herd/bin:$PATH"
   2    php artisan serve

  This will start the backend server, typically at http://127.0.0.1:8000. 

  (Note: Your frontend is already configured to point its API requests to this exact
  127.0.0.1:8000 URL, so everything will connect automatically!)

  Optional: Database Management
  If you ever need to view your local SQLite database or manually edit the data, you can use
  Prisma Studio. Open another terminal in the backend folder and run:

   1 npx prisma studio
  This will open a visual database browser in your web browser.

  To add works as external links (like YouTube videos or live
  websites), I've added support for a links.json file.

  How to add external links:
   1. Create/Edit the file: Open frontend/app/links.json.
   2. Add your projects: Add an array of objects like this:

    1     [
    2       {
    3         "title": "Agency Showreel 2026",
    4         "type": "video",
    5         "thumbnail": "/work4.jpg",
    6         "url":
      "https://www.youtube.com/watch?v=your-video-id"
    7       },
    8       {
    9         "title": "Client Live Site",
   10         "type": "live",
   11         "thumbnail": "/office.jpeg",
   12         "url": "https://client-website.com"
   13       }
   14     ]

  Features:
   * Automatic Discovery: These will appear alongside your
     Decks and Demos on the Homepage and /work page.
   * Smart Navigation: External links will automatically open
     in a new tab (target="_blank"), while internal
     decks/demos will still open in the same tab.
   * Visual Consistency: They follow the same Portrait design
     and have custom "Video" or "Live" labels.

  I've created a sample links.json for you to get started!

    Your Static Build Workflow:

   1. Build the Project: Run npm run build in the frontend folder.
   2. Locate the Output: Next.js will generate a folder named out. This folder contains everything (HTML, CSS, JS, Images).
   3. Deploy to Hostinger:
       * Open your Hostinger File Manager for reedbreed.cc.
       * Upload everything inside the out folder directly into your public_html directory.
       * Crucial Step: Upload the .htaccess.production file I created for you and rename it to exactly .htaccess in that same
         public_html folder. This ensures your routes like /dashboard and /payment/4 work correctly when refreshed.