# Pay-as-You-Use Digital Content Subscription System
> A flexible subscription system where users are charged based on their daily usage, capped at the subscription amount for the month.

---

## Links
- **Presentation**: [https://docs.google.com/presentation/d/1HIwLVG87sPhC5D3igc6uEzETRT2kpsyoSlYUmxthI6s/edit?usp=sharing]
---

## How it works
This project implements a "pay-as-you-use" model for digital content subscriptions. Instead of charging users a flat monthly fee, users are charged each day they log in to access the service. The system ensures that users who log in multiple times in one day are only charged once for that day. If a user logs in every day, they will only be charged up to the subscription cap, ensuring fair pricing.

After a user logs in, the system tracks their usage and places a pending payment for 30 days to simulate a monthly subscription. At the end of the 30-day period, the total amount owed will be calculated and processed. Due to time constraints, the amount is currently hardcoded, but the model is designed to eventually divide the total subscription amount by the number of days in the month and sum the usage to calculate the final bill.

The dashboard shows pending payments from subscribers, giving the content provider an overview of payments that are due.

---

## How to run

### Backend - Simulating User Login and Pending Payments
1. Navigate to the `test` folder under the `backend`:
   ```bash
   cd backend/test
   node main.js
   node app.js
   node complete.js
   ```
This simulates a user logging into the system.
After the login, a pending payment is set for 30 days, representing a monthly subscription cycle.
The system will accumulate the amount owed, which is currently hardcoded due to the limited time available to fully implement the daily payment calculations.

2.Frontend - Running the Dashboard
```bash
  cd frontend
  npm install
  npm start
```
This will launch the dashboard, where you can view the pending payments from subscribers.
The data on the dashboard is simulated based on partially hardcoded subscriber data, allowing you to visualize how pending payments are accumulated and displayed.

#Team members
Onesmus Maenzanise - https://github.com/oni1997
Thabang Mokoena - https://github.com/Shaunnn-m
Lethabo Letsoalo - https://github.com/LethaboCodes
Stanley Chapo - https://github.com/Stanleychapo


Learnings
During this hackathon, we gained valuable experience implementing flexible subscription models and dynamic billing mechanisms. Working with Firebase allowed us to rapidly prototype the back end, while using React for the front-end dashboard helped us focus on user experience and functionality. Additionally, we improved our teamwork by working under pressure and managing responsibilities within a short timeframe.

Achievements
We are most proud of successfully implementing the pay-as-you-use model and displaying the pending payments dashboard within the hackathon's tight deadline. Our solution dynamically handles daily logins, ensuring that users are fairly charged without being double-billed for multiple logins in a single day.

What comes next?
In the future, we plan to implement a dynamic calculation system that divides the subscription fee by the number of days in the month to more accurately track usage. Additionally, we aim to integrate a live payment processing system and enhance the dashboard to include monthly reports and more detailed insights into subscriber usage.

