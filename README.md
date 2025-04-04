# QuickChat

A real-time chat app built using Socket IO

https://github.com/user-attachments/assets/16683ccd-0cc7-4208-a67f-a904d8195cc9

## How to run locally ?

**1.Clone the repo**

```bash 
git clone https://github.com/Virajb19/QuickChat
cd QuickChat
```
**2. Install pnpm and then dependencies**

```bash 
npm i -g pnpm
```
```bash
pnpm install
```

**3. Run the server**

```bash
pnpm dev
```

**4. Create .env and add environment variables**

Refer .env.example

**5. Start Database**

Pull postgres image

```bash
docker pull postgres
```
Run docker container

```bash
docker run --name postgres-ctr -e POSTGRES_PASSWORD=password -p 5432:5432 -d postgres

```
Run this command

```bash
pnpm dlx prisma migrate deploy
```

Run this command to open prisma studio

```bash
pnpm dlx prisma studio
```
Open [http://localhost:5555]

**6. Authentication**

Run this to generate a key

```bash
openssl rand -base64 32
```

Add the key to AUTH_SECRET env var

Go to [https://github.com/settings/apps] and create an OAuth app

GITHUB_CLIENT_ID=""  
GITHUB_CLIENT_SECRET=""  

(Optional. You can just login using Github)

Go to [https://console.cloud.google.com/] and create an OAuth app

GOOGLE_CLIENT_ID="" GOOGLE_CLIENT_SECRET=""

**7. Websocket server**

Go to [https://github.com/Virajb19/Websocket-server]

This is express application. Clone it and then start the server
