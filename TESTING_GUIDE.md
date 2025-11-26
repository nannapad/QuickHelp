# Quick Testing Guide

## 🧪 How to Test New Features

### 1. Views, Likes & Bookmarks

**Test Views:**

1. Open any manual (e.g., `http://localhost:5173/manual/1`)
2. Check hero section - view count should show
3. Refresh page - view count increases by 1
4. Open DevTools → Application → localStorage
5. Check `manualStats` - verify view increment

**Test Likes:**

1. Login as any user
2. Go to manual detail page
3. Click "Like" button
4. Button should change to "Liked"
5. Alert: "Manual liked!" appears
6. Click again to unlike
7. Check `manualStats` in localStorage
8. Verify `likedBy` array contains your user ID

**Test Bookmarks:**

1. Login as any user
2. Go to manual detail page
3. Click "Bookmark" button
4. Button changes to "Bookmarked"
5. Alert: "Bookmarked! You will be notified..."
6. Click again to remove bookmark
7. Check `manualStats` in localStorage
8. Verify `bookmarkedBy` array

---

### 2. Admin Notifications

**Test Creator Request Notification:**

1. Login as regular user
2. Go to Creator Request page
3. Fill out form and submit
4. Logout
5. Login as admin (demo: admin/password)
6. Check notification bell - should have red badge
7. Click bell - see "New creator request from..."
8. Click notification - goes to Admin Dashboard

**Test Pending Manual Notification:**

1. Login as creator
2. Create new manual
3. Click "Publish Manual"
4. Logout
5. Login as admin
6. Check notification bell
7. See "New manual pending approval..."
8. Go to Admin Dashboard to approve

**Test Manual Update Notification:**

1. Creator edits a published manual
2. Changes status to pending
3. Admin receives notification
4. "Manual '...' updated and needs re-approval"

---

### 3. Comment Edit/Delete

**Test Comment Edit:**

1. Login as any user
2. Go to manual with comments
3. Post a comment
4. After posting, see ✏️ and 🗑️ buttons
5. Click ✏️ (edit)
6. Textarea appears with comment text
7. Modify text
8. Click "Save"
9. Comment updates
10. "(edited)" badge appears

**Test Comment Delete:**

1. Find your comment
2. Click 🗑️ (delete) button
3. Confirmation dialog appears
4. Click "Delete"
5. Comment disappears
6. Success alert shown

**Test Permissions:**

1. Try editing someone else's comment
2. No edit/delete buttons should appear
3. Only your own comments have buttons

---

### 4. Real File Downloads

**Test File Upload (Creator):**

1. Login as creator
2. Go to Create Manual
3. Scroll to "Manual file" section
4. Click "Upload manual file"
5. Select a PDF/DOCX/ZIP file
6. File name appears: "📎 filename.pdf"
7. File info shows: "240.5 KB • application/pdf"
8. Publish manual

**Test File Download (User):**

1. Go to manual detail page
2. Check right sidebar "Download" section
3. Should show real file info:
   - "PDF • 240.5 KB"
   - "filename.pdf"
4. Click "Download File" button
5. File downloads to your computer
6. Verify downloaded file opens correctly

**Test Without File:**

1. View old manual (no uploaded file)
2. Download section shows fallback:
   - "PDF • 2.4 MB"
   - "v1.0"
3. Click shows "File not available" warning

---

## 📱 Browser Testing

Test in multiple browsers:

- ✅ Chrome/Edge (Chromium)
- ✅ Firefox
- ✅ Safari (if on Mac)

---

## 🔍 LocalStorage Inspection

**View Data:**

```javascript
// In browser console:

// Check view/like/bookmark stats
JSON.parse(localStorage.getItem("manualStats"));

// Check notifications
JSON.parse(localStorage.getItem("quickhelp_notifications"));

// Check custom manuals
JSON.parse(localStorage.getItem("customManuals"));

// Check users
JSON.parse(localStorage.getItem("quickhelp_users"));
```

**Expected Data Structure:**

```javascript
// manualStats
{
  "1": {
    "views": 42,
    "likes": 15,
    "likedBy": [1, 2, 5],
    "bookmarkedBy": [1, 3]
  }
}

// Manual with file
{
  "id": 1234567890,
  "title": "Test Manual",
  "fileInfo": {
    "name": "manual.pdf",
    "size": 245678,
    "type": "application/pdf",
    "dataUrl": "data:application/pdf;base64,..."
  }
}

// Notification
{
  "id": 1234567890,
  "userId": 1,
  "message": "New creator request from johndoe",
  "type": "info",
  "link": "/admin-dashboard",
  "read": false,
  "createdAt": "2025-11-26T..."
}
```

---

## 🐛 Common Issues & Solutions

### Views Not Incrementing

- **Check:** localStorage `manualStats`
- **Fix:** Clear localStorage and reload

### Likes Not Working

- **Check:** User is logged in
- **Fix:** Login first

### Notifications Not Showing

- **Check:** User role is "admin"
- **Fix:** Update user role in localStorage

### File Not Downloading

- **Check:** `fileInfo.dataUrl` exists
- **Fix:** Re-upload file in edit manual

### Comments Can't Edit

- **Check:** Comment `userId` matches current user
- **Fix:** Ensure comment was posted by logged-in user

---

## 🎯 Quick Test Scenarios

### Scenario 1: New User Journey

1. Visit site
2. Browse manuals (views increment)
3. Try to like (login prompt)
4. Register account
5. Like and bookmark manuals
6. Post comments
7. Edit own comment

### Scenario 2: Creator Workflow

1. Login as creator
2. Create manual with file upload
3. Verify file info displays
4. Publish manual
5. Check admin receives notification
6. Edit published manual
7. Verify admin notified of update

### Scenario 3: Admin Workflow

1. Login as admin
2. Check notifications
3. View pending requests
4. Approve creator
5. View pending manuals
6. Approve/reject manual
7. Edit any manual (preserves author)

---

## ✅ Success Criteria

All features working if:

- [x] Views increment on page load
- [x] Likes toggle with visual feedback
- [x] Bookmarks toggle with notifications
- [x] Admins receive all notifications
- [x] Comments can be edited/deleted
- [x] Files upload and download correctly
- [x] No console errors
- [x] Data persists after refresh

---

## 📞 Support

If issues persist:

1. Check browser console for errors
2. Verify localStorage data structure
3. Clear localStorage and test again
4. Check file in `IMPLEMENTATION_SUMMARY.md`

---

**Last Updated:** November 26, 2025
