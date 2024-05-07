
# Developer Guide: Building and Pushing Docker Containers to GitHub Package Registry

This guide covers the steps required to build Docker containers, push them to GitHub Package Registry, and then pull and use them on remote servers.

## Prerequisites

- Docker installed on your local machine
- GitHub account
- Personal Access Token (PAT) from GitHub with `read:packages`, `write:packages`, and `delete:packages` scopes
- A remote server with SSH access and Docker installed

## Steps

### 1. Building Docker Image

Before pushing your Docker image to the GitHub Package Registry, you need to build it with the appropriate tag.

1. **Tag Naming**: Your image tag must follow the pattern `ghcr.io/USERNAME/IMAGE_NAME:TAG`, where `USERNAME` is your GitHub username or organization, `IMAGE_NAME` is the name of your Docker image, and `TAG` is the version of the image.

2. **Platform Specification**: If you are on a Mac or a system with a different CPU architecture than your target server (e.g., ARM instead of AMD64), you must specify the platform for which the Docker image should be built. Use the `--platform` flag in your Docker build command:

    ```sh
    docker build --platform linux/amd64 -t ghcr.io/USERNAME/IMAGE_NAME:TAG .
    ```

### 2. Pushing to GitHub Package Registry

Once your Docker image is built, you can push it to the GitHub Package Registry.

1. **Login to GitHub Package Registry**: Use the `docker login` command to authenticate with GitHub Package Registry using your GitHub username and PAT.

    ```sh
    docker login ghcr.io
    ```

    Enter your Username and PAT when prompted.

2. **Push the Image**: With the Docker CLI, push your image to the GitHub Package Registry using the tag you specified during the build.

    ```sh
    docker push ghcr.io/USERNAME/IMAGE_NAME:TAG
    ```

### 3. Pulling and Running on a Remote Server

To use your Docker image on a remote server, you need to pull it from the GitHub Package Registry.

1. **SSH into Your Server**: Log into your remote server using SSH.

    ```sh
    ssh USERNAME@SERVER_IP
    ```

2. **Install Docker**: If Docker is not installed on the server, install it using the package manager. For Ubuntu, you can use:

    ```sh
    sudo apt-get update
    sudo apt-get install docker.io
    ```

3. **Start and Enable Docker**: Ensure the Docker service is running and enabled to start on boot.

    ```sh
    sudo systemctl start docker
    sudo systemctl enable docker
    ```

4. **Login to GitHub Package Registry**: Similar to your local machine, log into the GitHub Package Registry on your server.

    ```sh
    docker login ghcr.io
    ```

    Enter your Username and PAT when prompted.

5. **Pull the Image**: Pull your Docker image from the GitHub Package Registry.

    ```sh
    docker pull ghcr.io/USERNAME/IMAGE_NAME:TAG
    ```

6. **Run the Container**: Start a container using your Docker image. The following example maps the container's port 3001 to the same port on the host.

    ```sh
    docker run -d -p 3001:3001 ghcr.io/USERNAME/IMAGE_NAME:TAG
    ```

## Considerations

- **Security**: Your PAT is sensitive information. Treat it like a password and do not expose it in scripts or logs.
- **Image Size**: Large images will take longer to push and pull. Consider optimizing your Docker images to reduce their size.
- **Server Resources**: Ensure your server has enough resources to run the Docker containers you're deploying.
- **DDoS Protection**: If your containerized application is internet-facing, consider using a hosting provider that offers DDoS protection.
- **Monitoring and Backups**: Use tools like Grafana for monitoring your containers and set up regular backups for persistence and disaster recovery.

## Gotchas

- **Architecture Mismatch**: Building an image on a platform with a different CPU architecture than the target server can cause the container to fail to run. Always specify the target platform when building your image.
- **Private Repositories**: If your Docker image is in a private repository, you must log in to pull the image, even from your own server.
- **Network Issues**: Pulling and pushing large images can be affected by network speed and reliability. Ensure a stable connection when performing these operations.

## Conclusion

This guide has walked you through the process of building a Docker image, pushing it to the GitHub Package Registry, and pulling it onto a remote server to run. Remember to handle your credentials securely and to consider the architecture and network implications of working with Docker images.
