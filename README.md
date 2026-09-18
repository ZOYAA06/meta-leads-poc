# Meta Lead Ads + React Native PoC

A Proof of Concept that receives a test lead from Meta Lead Ads and displays it live in an already-open React Native app without any manual action on the device.

## Architecture

```text
Meta Lead Testing Tool
        ↓
Meta Webhook
        ↓
ngrok
        ↓
Node.js + Express
        ↓
Meta Graph API
        ↓
Server-Sent Events (SSE)
        ↓
React Native App
````

When a test lead is submitted, Meta sends a webhook containing the lead ID. The backend retrieves the lead details using the Meta Graph API and sends the lead to the connected React Native app through SSE. The app updates the leads list automatically.

## Tech Stack

* React Native + Expo
* TypeScript
* Node.js + Express
* Meta Graph API
* Meta Webhooks
* Server-Sent Events (SSE)
* ngrok

## Setup

### Install dependencies

From the project root:

```bash
npm install
```

Install backend dependencies:

```bash
cd backend
npm install
```

### Environment Variable

Create a `.env` file inside the `backend` folder:

```env
META_PAGE_ACCESS_TOKEN=your_page_access_token
```

### Run Backend

```bash
cd backend
node index.js
```

### Run ngrok

```bash
ngrok http 3000
```

### Run React Native App

From the project root:

```bash
npx expo start
```

## Testing

1. Keep the React Native Leads screen open.
2. Start the backend and ngrok.
3. Open the Meta Lead Testing Tool.
4. Submit a test lead.
5. The lead appears automatically in the React Native app without any manual action on the device.
