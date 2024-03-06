
![Logo](/public/Sky%20Chat%20Web.png)


# Sky Chat Web

This is a real time chat application developed using Nextjs and Nodejs. It has features like Whatsapp, Realtime Chat, and Push messages, upload status and share photo with your friends.

## Tech Stack

**Client:** Nextjs, Redux toolkit, TailwindCSS, shadcn ui, react-hook-form

**Server:** Node, Express, kafkajs, mongoose, socket.io, zod, ioredis, multer

**Database:** Redis (pub/sub), MongoDB 


## Features

- User authentication with JWT and bcrypt
- Real time chat using Socket io
- Image uploading feature with Multer
- Share Status with your friends
- Light/dark mode toggle
- Application is fully responsive
- Realtime Sketch with friends
<!-- - Group real chat feature -->
## Screenshot

![App Screenshot](/public/image.png)
<!-- ![App Screenshot](https://via.placeholder.com/468x300?text=App+Screenshot+Here) -->
## Realtime Sketch Video
[![Watch the video](/public/github.mp4)](/public/github.mp4)
    
## Run Locally

Clone the project

```bash
  git clone https://github.com/AkashMondal0/Sky-Chat-App-Nextjs.git
```

Go to the project directory

```bash
  cd Sky-Chat-App-Nextjs
```

Install dependencies

```bash
  npm install
```

## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`1. change ip address to your local ip address (192.168.31.212)`

`NEXT_PUBLIC_BACKEND_URL`

`NEXT_PUBLIC_STORAGE_URL`

`MONGODB_URI`

`REDIS_URL`

`JWT_SECRET`

`KAFKA_BROKER`

# for kafka ssl

`CA_PATH`: "./src/kafka/ca.pem"

`SASL_MECHANISM`: "plain"

`SASL_USERNAME`

`SASL_PASSWORD`

## Set up backend

Docker  is required to set up a local instance of MongoDB and Redis. You can download it from [here](https://www.docker.com/).

1. Install all required docker images  by running `docker-compose up -d` in the root folder of this repository.


```bash
docker-compose up -d
```

Start the app development mode

```bash
  npm run dev
```

build app for start app

```bash
  npm run build
```

Start the app

```bash
  npm run start
```

## Next js App running  on 
`http://localhost:3000`
## Server API running on 
`http://localhost:4000`

## Backend github repository

backend repository link : [https://github.com/AkashMondal0/sky-chat-backend.git](https://github.com/AkashMondal0/sky-chat-backend.git)

## Feedback

If you have any feedback, please reach out to us at akash2003mondal@gmail.com

