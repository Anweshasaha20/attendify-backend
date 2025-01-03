#### **Essential Routes (Priority 1)**

4. **Session Management**
   - **GET /:id/sessions**
     - **Purpose**: To fetch all sessions in a class.
     - **Controller**: `classController.getClassSessions`
     - **Middleware**: `verifyJWT`

---

#### **Important Routes (Priority 2)**

These routes add flexibility and administrative control.

1. **Class Management**

   - **PUT /:id**

     - **Purpose**: To update the details of a class (Admin only).
     - **Controller**: `classController.updateClass`
     - **Middleware**: `verifyJWT`

   - **DELETE /:id**
     - **Purpose**: To delete a class (Admin only).
     - **Controller**: `classController.deleteClass`
     - **Middleware**: `verifyJWT`

2. **Participant Management**

   - **POST /:id/remove-participant**

     - **Purpose**: To remove a participant from a class (Admin only).
     - **Controller**: `classController.removeParticipant`
     - **Middleware**: `verifyJWT`

   - **PUT /:id/promote-participant**
     - **Purpose**: To promote a participant to admin (Admin only).
     - **Controller**: `classController.promoteParticipant`
     - **Middleware**: `verifyJWT`

3. **Session Management**

   - **POST /:id/sessions**

     - **Purpose**: To create a new session in a class (Admin only).
     - **Controller**: `classController.createSession`
     - **Middleware**: `verifyJWT`

   - **PUT /:id/sessions/:sessionId**

     - **Purpose**: To update the details of a session (Admin only).
     - **Controller**: `classController.updateSession`
     - **Middleware**: `verifyJWT`

   - **DELETE /:id/sessions/:sessionId**
     - **Purpose**: To delete a session (Admin only).
     - **Controller**: `classController.deleteSession`
     - **Middleware**: `verifyJWT`

---

#### **Optional Routes (Priority 3)**

These routes provide extended functionality for better tracking and management.

1. **Attendance Management**

   - **GET /:id/attendance**

     - **Purpose**: To fetch attendance logs for a class.
     - **Controller**: `classController.getAttendanceLogs`
     - **Middleware**: `verifyJWT`

   - **GET /:id/absent**
     - **Purpose**: To fetch a list of absent students in a class.
     - **Controller**: `classController.getAbsentStudents`
     - **Middleware**: `verifyJWT`

2. **Class Search and Filter**

   - **GET /search**
     - **Purpose**: To search for classes based on keywords.
     - **Controller**: `classController.searchClasses`
     - **Middleware**: `verifyJWT`

3. **Session Reports**
   - **GET /:id/sessions/:sessionId/report**
     - **Purpose**: To generate and fetch a report for a specific session.
     - **Controller**: `classController.getSessionReport`
     - **Middleware**: `verifyJWT`

---

### **Proposed Updates to Code**

Here’s how your current code could look with the above structure:

```javascript
import { Router } from "express";
import classController from "../controllers/class.controller.js";
import verifyJWT from "../middlewares/auth.middleware.js";

const router = Router();

// Request Management (Priority 1)
router.post("/:id/join-request", verifyJWT, classController.joinRequest);
router.get("/:id/request-status", verifyJWT, classController.checkRequestStatus);
router.post("/:id/accept-request", verifyJWT, classController.acceptRequest);
router.post("/:id/reject-request", verifyJWT, classController.rejectRequest);

// Essential Class Management (Priority 1)
router.post("/create", verifyJWT, classController.create);
router.get("/", verifyJWT, classController.getAllClasses);
router.get("/:id", verifyJWT, classController.getClassDetails);
router.get("/:id/participants", verifyJWT, classController.getParticipants);
router.get("/:id/sessions", verifyJWT, classController.getClassSessions);

// Important Routes (Priority 2)
router.put("/:id", verifyJWT, classController.updateClass);
router.delete("/:id", verifyJWT, classController.deleteClass);
router.post("/:id/remove-participant", verifyJWT, classController.removeParticipant);
router.put("/:id/promote-participant", verifyJWT, classController.promoteParticipant);
router.post("/:id/sessions", verifyJWT, classController.createSession);
router.put("/:id/sessions/:sessionId", verifyJWT, classController.updateSession);
router.delete("/:id/sessions/:sessionId", verifyJWT, classController.deleteSession);

// Optional Routes (Priority 3)
router.get("/:id/attendance", verifyJWT, classController.getAttendanceLogs);
router.get("/:id/absent", verifyJWT, classController.getAbsentStudents);

export default router;
```
