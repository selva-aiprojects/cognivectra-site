# 📅 Calendly Integration - Complete Setup Guide

## ✅ Current Status

**Calendly link is already integrated!**

- **Location:** Contact page → "Book a Call" tab
- **Link:** https://calendly.com/cognivectra-demo/15min
- **Button text:** "📅 Book 15-min Intro"

---

## 🎯 What's Already Working

When users click the "Book a Call" tab on your Contact page, they see:
1. A description of the 15-minute intro call
2. A button linking to your Calendly page
3. Direct contact information (email & WhatsApp)

---

## 🔧 Calendly Setup Checklist

### **1. Create/Verify Your Calendly Account**

1. **Go to:** https://calendly.com/
2. **Sign up** or **log in** with your business email (info@cognivectra.com)
3. **Verify** your email address

---

### **2. Create Event Type**

1. **Go to:** https://calendly.com/event_types
2. **Click "Create"** → **"Event Type"**
3. **Fill in details:**
   - **Event name:** "15-Minute Intro Call"
   - **Duration:** 15 minutes
   - **Location:** Google Meet / Zoom / Phone
   - **Description:**
     ```
     Quick intro call to discuss your startup's technical needs.
     
     What we'll cover:
     - Your current stage and challenges
     - Technical requirements
     - How we can help
     - Next steps (if there's a fit)
     
     No sales pressure - just practical guidance from our Principal Architect.
     ```

4. **Set availability:**
   - Choose your working hours
   - Set buffer time between meetings
   - Set minimum scheduling notice (e.g., 2 hours)

5. **Customize questions:**
   - Name (required)
   - Email (required)
   - Company name
   - "What's your biggest technical challenge right now?"
   - "What stage is your startup at?"

6. **Save** the event type

---

### **3. Get Your Calendly Link**

1. **Go to your event type**
2. **Copy the link** (e.g., `https://calendly.com/cognivectra-demo/15min`)
3. **Verify** it matches the link in your Contact page (line 255 in Contact.jsx)

---

### **4. Customize Your Calendly Page**

1. **Go to:** https://calendly.com/app/settings/my_account
2. **Upload profile photo** (your logo or headshot)
3. **Add welcome message:**
   ```
   Welcome! Let's discuss how we can help you build scalable, enterprise-grade technology foundations for your startup.
   ```
4. **Set timezone** to your local timezone
5. **Configure notifications:**
   - Email confirmations
   - SMS reminders (optional)
   - Calendar invites

---

## 🚀 Advanced Options

### **Option A: Embed Calendly Widget (Inline)**

If you want to embed the Calendly calendar directly on your Contact page instead of linking to it:

1. **Install Calendly React component:**
   ```bash
   npm install react-calendly
   ```

2. **Update Contact.jsx** to use inline widget:
   ```jsx
   import { InlineWidget } from "react-calendly";
   
   // In the "call" tab content:
   {activeTab === "call" && (
     <div className="contact-tab-panel">
       <h4>Book a 15-Minute Intro Call</h4>
       <p>Select a time that works for you:</p>
       
       <InlineWidget 
         url="https://calendly.com/cognivectra-demo/15min"
         styles={{
           height: '700px',
           marginTop: '20px'
         }}
       />
     </div>
   )}
   ```

### **Option B: Popup Widget**

Add a floating Calendly button that opens a popup:

1. **Add Calendly script to index.html:**
   ```html
   <script type="text/javascript" src="https://assets.calendly.com/assets/external/widget.js"></script>
   ```

2. **Add popup trigger button:**
   ```jsx
   <button 
     onClick={() => window.Calendly.initPopupWidget({
       url: 'https://calendly.com/cognivectra-demo/15min'
     })}
     className="btn"
   >
     📅 Schedule a Call
   </button>
   ```

---

## 📧 Email Integration

### **Update Calendly Notifications**

Make sure Calendly sends notifications to your new email:

1. **Go to:** https://calendly.com/app/settings/notifications
2. **Update email to:** info@cognivectra.com
3. **Enable:**
   - New event scheduled
   - Event canceled
   - Event rescheduled
   - Reminder 24 hours before

---

## 🔗 Current Calendly Link

**Your current link:** https://calendly.com/cognivectra-demo/15min

**Make sure this link:**
- ✅ Is active and accessible
- ✅ Points to the correct event type
- ✅ Has proper availability set
- ✅ Sends notifications to info@cognivectra.com

---

## ✅ Testing Checklist

- [ ] Visit https://calendly.com/cognivectra-demo/15min
- [ ] Verify the page loads correctly
- [ ] Check that available times show up
- [ ] Book a test appointment
- [ ] Confirm you receive email notification at info@cognivectra.com
- [ ] Test the calendar integration (Google Calendar/Outlook)
- [ ] Cancel the test appointment
- [ ] Verify cancellation email

---

## 🎨 Branding Your Calendly Page

1. **Go to:** https://calendly.com/app/settings/branding
2. **Upload logo:** Your CogniVectra logo
3. **Set brand color:** Match your website theme
4. **Custom domain (Pro plan):** calendly.cognivectra.com

---

## 📊 Analytics & Tracking

### **Track Calendly Bookings:**

1. **Go to:** https://calendly.com/app/analytics
2. **View metrics:**
   - Total bookings
   - No-shows
   - Cancellations
   - Popular time slots

### **Integrate with Google Analytics:**

Add tracking to your Calendly events:

1. **Go to:** Settings → Integrations → Google Analytics
2. **Enter your GA tracking ID**
3. **Enable event tracking**

---

## 🔧 Troubleshooting

### **Link not working?**
- Check if the event type is published (not draft)
- Verify your Calendly account is active
- Make sure you have availability set

### **Not receiving notifications?**
- Check spam folder
- Verify email in Calendly settings
- Test with a different email

### **Times not showing?**
- Check your availability settings
- Verify timezone is correct
- Make sure you haven't blocked all times

---

## 💡 Pro Tips

1. **Set buffer time:** Add 5-10 minutes between meetings
2. **Minimum notice:** Require at least 2-4 hours notice
3. **Limit daily bookings:** Prevent burnout with daily limits
4. **Add video conferencing:** Auto-generate Google Meet/Zoom links
5. **Send reminders:** Enable 24-hour and 1-hour reminders
6. **Collect payment (optional):** For paid consultations

---

## 📝 Next Steps

1. ✅ **Verify** your Calendly link is working
2. ✅ **Update** email notifications to info@cognivectra.com
3. ✅ **Test** the booking flow
4. ✅ **Customize** your Calendly page branding
5. ⚪ **Optional:** Embed inline widget on Contact page

---

**Your Calendly integration is ready to use! Users can book calls directly from your Contact page.** 🎉

**Need help with anything specific?** Let me know!
