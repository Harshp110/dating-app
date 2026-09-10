# API and Server Actions

The MVP primarily uses server actions rather than public JSON mutation APIs.

- Auth: `signUp`, `signIn`, `signOut`
- Onboarding: `saveOnboarding`
- Discovery: `expressInterest`, `answerQuestion`, `updateConnectionState`
- Interaction: `sendMessage`, `setMeetingReadiness`, `proposeDate`, `respondToDate`, `recordMeeting`
- Safety: `blockUser`, `reportUser`
- Admin: `resolveReport`, `suspendUser`

`GET /api/conversations/:id/messages` returns the latest authorized messages for short polling. It returns `401` without a session and `404` for non-members.