import { AlertCircle, Book, CreditCard, Lightbulb, Smartphone } from "lucide-react";

export interface SupportItem {
    id: string;
    title: string;
    content: string;
}

export interface SupportCategory {
    title: string;
    icon: any;
    items: SupportItem[];
}

export interface SupportData {
    [key: string]: SupportCategory;
}

export const supportData: SupportData = {
    'onboarding': {
        title: "Onboarding Checklist",
        icon: Book,
        items: [
            {
                id: 'gs-1',
                title: 'Getting Started',
                content: `Welcome, and thank you for choosing Sales Watch!

This guide will walk you through our system basics, key user roles, and setup steps to get your team up and running quickly.

Sales Watch User Roles
There are three types of users in our system:

1. Sales Reps, who only use the Sales Watch mobile companion app to collect data on their work in the field (check-in/check-out times, travel route, visit location, etc.).
2. Analytics Users, who have read-only access to reports and performance analytics via the web app.

3. Admins, who have full access to manage users, schedules, stores, and settings.

Access to Sales Watch
We will provide your company with a set of admin login credentials to access the web app at saleswatch.id.

Next Steps
Follow these steps below to set up Sales Watch for your company. This guide will walk you through our core features and help you get started quickly.

We use a lot of links in our guide. Feel free to click on any blue or purple underlined text for more information.

Need help? Feel free to contact us. See How Do I Contact Support? for more details.`
            },
            {
                id: 'gs-2',
                title: 'Step 1: Log In to Sales Watch',
                content: `Use the admin login credentials we provided to access the web app at saleswatch.id.

For detailed instructions, see: How Do I Log In for the First Time?`
            },
            {
                id: 'gs-3',
                title: 'Step 2: Set Language',
                content: `In the top-right corner of the web app, you'll find options for:
- Language Settings
- Dark/Light mode
- Your profile

Click the language dropdown to select your preferred language before continuing setup.`
            },
            {
                id: 'gs-4',
                title: 'Step 3: Register Sales Reps',
                content: `To get your team started, you'll need to register each sales rep in the system.

Follow the instructions on these pages to complete the registration process:
- For Admins: How Do I Add a New Sales Rep?
- For Sales Reps: How Do I Sign Up and Log In for the First Time?`
            },
            {
                id: 'gs-5',
                title: 'Step 4: Add Store Data',
                content: `Add store or outlet data into Sales Watch in one of two ways:
- Using our web app: add one store at a time via the web dashboard. See: How Do I Add a Store?
- By file import: upload multiple stores using an Excel (.xlsx) file. See: How Do I Import Stores in Bulk?

We recommend using the import function. There will be another separate import function to add visit schedules. Importing these two (.xlsx) files is the quickest way to set up.`
            },
            {
                id: 'gs-6',
                title: 'Step 5: Add Visit Schedules',
                content: `Add sales visit schedules using one of two methods:
- Using our web app: add one visit at a time via the web dashboard. See: How Do I Assign a Sales Visit?
- By file import: upload the entire schedule using an Excel (.xlsx) file. See: How Do I Import Sales Visit Schedules in Bulk?

As with store data, we recommend using the import function. Importing these two (.xlsx) files is the quickest way to set up.`
            },
            {
                id: 'gs-7',
                title: 'Step 6: Monitor Sales Rep Activities',
                content: `After setup, sales reps will start to see their assigned visit schedules starting the next day. They will be able to start collecting activity data which will automatically sync with our web app.

Admins and analytics users can view this data to monitor performance and visit compliance.

For more details, see: How Do I View Analytics and Daily Reports?`
            },
            {
                id: 'gs-8',
                title: 'Step 7: Maximize Your Sales Watch Experience',
                content: `To get the most out of Sales Watch, explore our guides and documentations:
- How to - Web
- How to - Mobile
- Troubleshooting
- Additional Resources`
            }
        ]
    },
    'howtoWeb': {
        title: "How to - Web",
        icon: Book,
        items: [
            {
                id: 'web-1',
                title: 'How Do I Log In for the First Time?',
                content: `To log in for the first time:

1. Go to the Sales Watch Login page.
2. Enter your Company Code, Username, and Password.
3. On your first login, you will be prompted to create a new password as a security measure.`
            },
            {
                id: 'web-2',
                title: 'How Do I Create a New Admin or Analytics User?',
                content: `To create a new admin or analytics account:

1. Go to the Admin Management page.
2. Click 'Add New User'.
3. Enter the user's details. Take note of their username and generated password before clicking 'Submit'.
4. Share the username and password you noted in the step above with the new user. They will be prompted to create a new password upon first login as a security measure.`
            },
            {
                id: 'web-3',
                title: 'How Do I Add a New Sales Rep?',
                content: `To add a new sales rep to your company account:

1. Collect the Sales Rep's email address.
2. Go to the Sales Rep Management page.
3. Click 'Add New User'.
4. Enter the sales rep's details. External ID refers to the ID used to identify this sales rep in your company's documents. If this is left blank, we will generate an ID for you.
5. Instruct the Sales Rep to follow these instructions: How Do I Sign Up and Log In for the First Time?
6. Ensure the email address registered matches the one added to our system.
7. Generate an OTP and share this with the sales rep through WhatsApp or a messaging application of your choice to complete this process.`
            },
            {
                id: 'web-4',
                title: 'How Do I Remove an Admin or Analytics User?',
                content: `Users cannot be permanently deleted, but their accounts can be deactivated to maintain security.

To deactivate an admin or analytics user:

1. Go to the Admin Management page.
2. Click the red deactivate button under the 'Actions' column.`
            },
            {
                id: 'web-5',
                title: 'How Do I Remove a Sales Rep?',
                content: `Users cannot be permanently deleted, but their accounts can be deactivated to maintain security.

To deactivate a sales rep:

1. Go to the Sales Rep Management page.
2. Click the red deactivate button under the 'Actions' column.`
            },
            {
                id: 'web-6',
                title: 'How Do I Add a Store?',
                content: `To add a new store:

1. Go to the Store List page.
2. Click 'Insert New Store'.
3. Fill out the store details. If external ID is left blank, we will generate an ID for you. If location data is unavailable, fill out both latitude and longitude with zeroes for now.
4. Click 'Add Store'.`
            },
            {
                id: 'web-7',
                title: 'How Do I Import Stores in Bulk?',
                content: `To import stores by file:

1. Go to the Store Import page.
2. Download our template. If you would like to edit the current store list instead of downloading a blank template, download existing stores instead.
3. Fill out the template according to the instructions attached to the template. If external ID is left blank, we will generate an ID for you. If location data is unavailable, fill out both latitude and longitude with zeroes for now. Keep in mind that this process is an upsert.
4. Upload the completed file.

What is an upsert?
An upsert is a process that updates the store list following these rules:
- Entries with new IDs or no IDs will be added to the system.
- Entries with IDs that exist in our database will update the stores with those matching IDs.
- All other entries in the system will remain as is.`
            },
            {
                id: 'web-8',
                title: 'How Do I Approve New Outlets Submitted by Sales Reps?',
                content: `Sales reps may discover and submit new stores while in the field. These stores require admin approval before being added to the system.

To review and approve new outlets:

1. Go to the New Outlet Review page.
2. Review each store, then edit and approve them as needed.`
            },
            {
                id: 'web-9',
                title: 'How Do I Assign a Sales Visit?',
                content: `To assign a sales visit:

1. First adjust the repeat frequency of the schedule. Go to the Company Configurations page.
2. Changing the repeat frequency will remove all visit schedule data from our systems. Ensure all important data has been backed-up before changing this setting.
3. Adjust the schedule frequency: weekly sets the schedule to repeat every week, biweekly sets the schedule to repeat every two weeks, etc.
4. Go to the Visit Assignment page.
5. Select a sales rep from the dropdown.
6. Click 'Add Visit'.
7. Select a store and fill out the required details.
8. Reorder if needed.
9. Save changes.`
            },
            {
                id: 'web-10',
                title: 'How Do I Import Sales Visit Schedules in Bulk?',
                content: `To import sales visit schedule by file:

First, adjust schedule repeat frequency:
1. Go to the Company Configurations page.
2. Ensure all important visit schedule data has been backed-up before changing the repeat frequency setting. Changing the repeat frequency will remove all visit schedule data from our systems.
3. Adjust the schedule frequency if needed: weekly sets the schedule to repeat every week, biweekly sets the schedule to repeat every two weeks, etc.

Then, to import the file itself:
1. Go to the Visit Schedule Import page.
2. Download our template. If you would like to edit the current schedule instead of downloading a blank template, export the current schedule.
3. Fill out our template according to the instructions attached to the template. Ensure all external IDs for both sales reps and stores match those already in the system. Ensure the number of weeks match the schedule type you selected earlier.
4. Upload the completed file. Note that this will entirely replace the previous schedule.`
            },
            {
                id: 'web-11',
                title: 'How Do I View Analytics and Daily Reports?',
                content: `To view daily reports and check performance:

1. Go to the analytics section of the sidebar.
2. Select any of the pages under this section. We have compiled the data collected by your sales reps here.`
            },
            {
                id: 'web-12',
                title: 'How Do I Change Company Configuration Settings?',
                content: `To update company-wide settings:

1. Go to the Company Configurations page.
2. Adjust key settings such as minimum visit duration and GPS distance threshold.`
            },
            {
                id: 'web-13',
                title: 'How Do I Set Up Customized Visit Reminders?',
                content: `Admins can create custom reminders that appear during sales visits. To set up a reminder:

1. Go to the Sales Reminders page.
2. Click 'New Reminder'.
3. Fill out reminder details: message and target sales reps.
4. Click 'Create' to activate the reminder.`
            }
        ]
    },
    'howtoMobile': {
        title: "How to - Mobile",
        icon: Smartphone,
        items: [
            {
                id: 'mobile-1',
                title: 'How Do I Sign Up and Log In for the First Time?',
                content: `To sign up and log into Sales Watch for the first time:

1. Download, then open the Sales Watch mobile app.
2. Tap on 'Daftar' on the login screen.
3. Enter your email and create a password.
4. Provide the email you used to sign up to your admin.
5. Request your admin for your OTP and input it into the app when prompted.
6. Log in.`
            },
            {
                id: 'mobile-2',
                title: 'How Do I Move to a New Company Using the Same Email?',
                content: `If you've already signed up and want to join a new company with the same email:

1. Make sure your old company has deactivated your account. For more details, see: How Do I Remove a Sales Rep?
2. Share your registered email with the new company.
3. Request your new company for an OTP.
4. Log in, then enter the OTP when prompted.`
            },
            {
                id: 'mobile-3',
                title: 'How Do I Use the App as a Sales Rep?',
                content: `At the start of your workday, follow these steps to ensure accurate tracking and reporting:

1. Press 'Mulai' at the bottom-right corner of the screen before leaving for your visits. Be careful not to press the button to add incidental visits by mistake as the buttons are close together.
2. Visit your assigned stores as usual. Use the "Check-In" and "Check-Out" buttons at each location.
3. At the end of the day, press the 'Berhenti' to finish tracking.

Note: If you forgot to start tracking, when you check in at a store without starting your day, the app will prompt you to start tracking at that point.`
            },
            {
                id: 'mobile-4',
                title: 'How Do I Record a Visit That\'s Not in Today\'s Schedule?',
                content: `To record a visit outside of your assigned schedule:

1. On the 'Jadwal' screen, tap the plus '+' button.
2. Choose one of the following options:
   - If the outlet is not in the company database, add new store and enter the store details.
   - If the store is listed in the company database, add from existing stores and proceed with the check in process.`
            },
            {
                id: 'mobile-5',
                title: 'How Do I See My Visit History?',
                content: `To view your past visits:

1. Go to the 'Profil' tab.
2. Tap on 'Riwayat' to see your visit history.`
            }
        ]
    },
    'troubleshooting': {
        title: "Troubleshooting",
        icon: AlertCircle,
        items: [
            {
                id: 'ts-1',
                title: 'The Website Is Not Working',
                content: `If our web app isn't loading or behaving as expected, try the following:

- Check Internet Connection: Ensure a stable connection.
- Refresh Page: Press 'Ctrl + R' or 'Cmd + R' to refresh.
- Log Out: Try logging out, then in again.
- Clear Cache: Clear browser cache and cookies, then refresh the page.
- Try Private Browsing: Switch to a private or incognito window, then try again.
- Try a Different Browser: Switch from the current browser to another. We recommend Firefox or Chrome.
- Disable Browser Extensions: Some extensions such as ad blockers may interfere with loading. Try disabling them temporarily.
- Update Browser: Check if an update is required. Outdated browsers may cause errors.`
            },
            {
                id: 'ts-2',
                title: 'The Mobile App Is Not Working',
                content: `If our mobile app isn't working as expected, try the following:

- Check Internet Connection: Ensure a stable connection. Switch between Wi-Fi and mobile data if needed. While our mobile app is designed to work offline, some functionalities require an internet connection.
- Force Close and Reopen: Force the app to close and reopen it.
- Clear Cache: Go to Device Settings → Apps → Sales Watch → Storage → Clear Cache.
- Update the App: Make sure you're using the latest version of the Sales Watch app. Try reinstalling if the problems persist.
- Restart Device: A device restart may solve the issue.`
            },
            {
                id: 'ts-3',
                title: 'Why Is the Time Data Different From What the Sales Reps Reported?',
                content: `The website automatically converts and displays all time data based on your device's local time zone.

This may cause the data to appear out of place—a rep may appear to start their day extremely early or late—if the sales rep works in a different time zone.

To avoid confusion:
- Confirm the time zone your device is set to.
- Be aware that the original time was recorded based on the rep's local time.`
            },
            {
                id: 'ts-4',
                title: 'How Do I Fix: Cannot Login?',
                content: `In the case of a failed login, please try the following:

- Check Username and Password: Ensure you are entering the correct credentials. If you have forgotten your password, we have an option to reset it.
- Check Internet Connection: Ensure a stable connection. Switch between Wi-Fi and mobile data if needed.
- Clear Cache: Follow these steps to clear browser or app cache.
  - Web App: Clear browser cache and cookies, then refresh the page.
  - Mobile App: Go to Device Settings → Apps → Sales Watch → Storage → Clear Cache.
- Update the App or Browser: Make sure you're using the latest version of the Sales Watch app and a supported browser. Try reinstalling if the problems persist.
- Restart Device: A device restart may solve the issue.`
            },
            {
                id: 'ts-5',
                title: 'How Do I Fix: Cannot Import by File?',
                content: `When importing data by file, please ensure:

- Each column is correctly filled with the required data.
- There are no duplicate entries.
- The file is saved in XLSX format. Files not in XLSX format can be converted to XLSX using tools such as Google Sheets.`
            },
            {
                id: 'ts-6',
                title: 'How Do I Contact Support?',
                content: `If issues persist after troubleshooting, please contact our support team by submitting a ticket through our web app or by emailing us at support@saleswatch.id.`
            }
        ]
    },
    'subscription': {
        title: "Subscription Policies",
        icon: CreditCard,
        items: [
            {
                id: 'sub-1',
                title: 'How Do I Modify My Plan, and What\'s the Policy?',
                content: `You can modify your plan by contacting our team via email, WhatsApp, or by submitting an in-app support ticket.

Changes typically take effect at the end of your current billing cycle. However, they may be applied earlier upon request. In the case of a downgrade, we do not offer refunds for unused time on your current plan. However, credits may be issued to be used in future billing cycles.`
            },
            {
                id: 'sub-2',
                title: 'How Do I Cancel My Plan, and What\'s the Policy?',
                content: `You can cancel your plan by contacting our team via email, WhatsApp, or by submitting an in-app support ticket.

Cancellations typically take effect at the end of your current billing cycle. We do not offer refunds for unused time on your current plan. However, in cases of early cancellation, credits may be issued to be used in future billing cycles should you decide to rejoin our service.`
            },
            {
                id: 'sub-3',
                title: 'How Do I Extend My Subscription, and What\'s the Policy?',
                content: `Subscriptions are automatically renewed at the end of each billing cycle unless cancellation has been requested. To avoid service disruption, please ensure of timely payments.`
            }
        ]
    },
    'additional': {
        title: "Additional Resources",
        icon: Lightbulb,
        items: [
            {
                id: 'add-1',
                title: 'How Do I Maximize Sales Watch?',
                content: `To get the most out of Sales Watch, follow these best practices:

- Review Reports Regularly: Check visit data (GPS, timestamp, etc) and photo uploads at least weekly to catch unwanted behavior.

- Specify When to Start and Stop Tracking: Our system allows sales reps to start and stop tracking at any time. However, it is important to define when you expect tracking to begin and end. For example, ask sales rep to begin tracking immediately upon starting their journey or when they reach the first store. And tell to stop only after they reach the office. This ensures consistent data.

- Require Selfies as Proof of Visit: Ask sales reps to upload selfies as proof of visit. We also recommend to ask sales reps to keep the store sign in frame.

- Require Pictures as Proof of Order: Ask sales reps to upload additional pictures when a store orders. We recommend a picture of the store owner or clerk signing the order slip. This significantly reduces the chance of fraud. Make sure to ask for permission before taking a picture of another person. These images may be added to each visit as an attachment. This way, the check-in and check-out selfies are not disturbed.

- Require Pictures as Proof of Payment: Ask sales reps to upload additional pictures when receiving payment from stores. This is for a similar reason as above.

- Investigate Flagged Entries: Determine whether this flagging is the result of fraudulent behavior or simply an honest mistake.

- Use Reminders: Add reminders using our system to communicate with the sales reps in the field. This can be to remind them of ongoing promotions or other special instructions.

- Deactivate Inactive Users: Deactivate any accounts belonging to sales reps who have left the company. If left active, not only is it a security threat, it also takes away valuable user slots within the system.

- Avoid Sharing Logins: Require individual logins to ensure accountability and protect account security.

- Understand the System: Read through our "How to" and troubleshooting guides to understand all the features Sales Watch offers and to be able to quickly troubleshoot should a problem arises.`
            }
        ]
    }
};