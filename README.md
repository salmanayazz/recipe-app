# Recipe App

This application is built with a variety of technologies including **React**, **Node.js**, **Express.js**, **Google Cloud Platform**, **Docker**, **GitHub Actions**, **Apache**, and styled with **TailwindCSS**.

## Features

- **Create, Update, and Delete Recipes**: Users can create their own recipes, update them as needed, and also also delete them.
- **Image Upload**: Users can upload images for their recipes. Image handling is done using Google Cloud Storage.
- **View Recipes**: Users can view recipes created by other users.
- **Authentication**: User authentication is handled securely using the bcrypt library. This ensures that user passwords are securely hashed before being stored in the database.
- **HTTPS**: The application is served over HTTPS with Apache and Certbot using a Let's Encrypt certificate.

## Environment Variables

### Required for Building

Before you can run the project, will need to add the following environment variables:

**Server:**

Place these environment variables in a `.env` file in the server directory.

- **SESSION_SECRET**
  - A secret string used to sign the session ID cookie.
- **MONGODB_URI**
  - URI for the MongoDB database.
- **GCS_PROJECT_ID**
  - ID of the Google Cloud Platform project.
- **GOOGLE_APPLICATION_CREDENTIALS**
  - Path to the Google Cloud Platform service account key file. The service account must have the `Storage Object Admin` role.
- **GCS_BUCKET_NAME**
  - Name of the Google Cloud Storage bucket to use for storing images.
- **CLIENT_URL**
  - URL of the client application.
- **PORT**
  - Port to run the server on. Defaults to 3000 which is the same port used by the client application.

**Client:**

Place these environment variables in a `.env` file in the client directory.

- **VITE_SERVER_URL**
  - URL of the server application.

### Required for GitHub Actions Workflow

To run the GitHub Actions workflow, you will need to add the following environment variables alongside the ones listed above as secrets in your GitHub repository:

- **GCP_REGION**
  - Region of the Google Cloud Platform project.
- **GCP_SA_KEY**
  - Contents of the Google Cloud Platform service account key file. The service account must have the `Artifact Registry Writer` role along with the `Storage Object Admin` role.
- **GCE_IP_ADDRESS**
  - IP address of the Google Compute Engine instance.
- **GCE_USERNAME**
  - Username used to connect to the Google Compute Engine instance.
- **GCE_SSH_KEY**
  - Contents of the SSH private key file used to connect to the Google Compute Engine instance.

## Running the Project

You will need Node.js and NPM installed on your machine. Instructions for installing Node.js and NPM can be found [here](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm).

### Server

1. From the root directory, navigate to the server directory:

```
cd server
```

2. Install dependencies:

```
npm i
```

3. Start the project:

```
npm run start
```

The server will be running on the port specified in the `PORT` environment variable and will be accessible at `http://localhost:<PORT>`.

### Client

1. From the root directory, navigate to the client directory:

```
cd client
```

2. Install dependencies:

```
npm i
```

3. Start the project:

```
npm run dev
```

The client will be running on port 3000 by default and will be accessible at `http://localhost:3000`.

## Testing

This project features server-side tests using Mocha and Chai. To run the tests, navigate to the server directory and run the following command after installing dependencies:

```
npm test
```

## GitHub Actions Workflow

This project features a GitHub Actions workflow that tests and builds the project, creates a Docker image, and pushes the image to GCP Cloud Artifact Registry. It then connects to a GCP Compute Engine instance, pulls the image from Artifact Registry, and runs the image in a Docker container. The workflow is triggered on pushes to the `main` branch.
