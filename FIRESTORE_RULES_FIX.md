# Fix Firestore Permissions Error

## Error: "Missing or insufficient permissions"

This happens when Firestore security rules are not properly configured.

---

## ✅ Step 1: Go to Firebase Console

1. Visit [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **ai-resume-analyser-cf280**
3. Go to **Firestore Database** (left sidebar)

---

## ✅ Step 2: Update Security Rules

1. Click on **Rules** tab at the top
2. **Replace ALL existing rules** with this:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow anyone to read/write to users collection if authenticated
    match /users/{uid} {
      allow read, write: if request.auth.uid == uid;
      
      // Allow read/write to analyses subcollection if authenticated as owner
      match /analyses/{analysisId} {
        allow read, write: if request.auth.uid == uid;
      }
    }

    // Deny all other access
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

3. Click **Publish** button
4. **Wait for confirmation** - it shows a checkmark when deployed

---

## ✅ Step 3: Verify Collection Structure

The app expects this structure in Firestore:

```
users/
  {userId}/
    - uid: string
    - name: string
    - email: string
    - photoURL: string
    - createdAt: timestamp
    
    analyses/
      {analysisId}/
        - id: string
        - jobTitle: string
        - companies: array
        - resumeText: string
        - atsScore: number
        - strengths: array
        - weaknesses: array
        - ... (other analysis fields)
        - createdAt: timestamp
```

---

## ✅ Step 4: Test Again

1. **Refresh your browser** (Ctrl+Shift+R)
2. **Sign in with Google**
3. **Upload a resume**
4. **Click "Analyze Resume"**

It should now work without permission errors! ✅

---

## 🆘 If Still Getting Errors

**Option 1: Use Test Mode (Temporary)**
- Go to Firestore → Rules
- Replace all rules with:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    allow read, write: if true;
  }
}
```
- This allows everyone read/write (only for testing!)
- ⚠️ Switch back to secure rules before deploying!

**Option 2: Check Authentication**
- Make sure you're signed in (check for Google profile icon)
- Check browser console (F12) for error details
- Look for "user.uid" in console logs

**Option 3: Check Firebase Project**
- Verify you're using correct `VITE_FIREBASE_PROJECT_ID`
- Go to Settings → General to confirm project ID

---

## 📝 Security Rules Explanation

| Rule | Purpose |
|------|---------|
| `match /users/{uid}` | Only let user with matching uid read/write their doc |
| `match /analyses/{analysisId}` | Only let user read/write their analyses |
| `allow if request.auth.uid == uid` | Ensure authenticated user owns the data |
| `allow read, write: if false` | Block all other access |

---

## ✅ Once Firestore Rules Are Set

Your app will:
1. ✅ Save user profiles on first login
2. ✅ Save resume analyses to `/users/{uid}/analyses/{id}`
3. ✅ Display analysis results from Firestore
4. ✅ Only show data to authenticated user

**Go to Firebase Console NOW and update the rules!** 🚀
