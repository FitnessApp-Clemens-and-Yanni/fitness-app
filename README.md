# Monorepo Fitness App

## Prerequisites

To start developing in this repo it's important that you install the following CLI tools globally for a good DX!

- git
- dotnet
- turbo
- docker
- pnpm

## Access to docker

To use update the docker images, you will need to verify your access rights to the repo in the docker CLI.
For that, go to your GitHub account and generate a classic access token with read/write privilages to packages.
Then save the token into an environment variable, e.g. with:

```
export CR_PAT=INSERT_TOKEN_HERE
```

(Be careful to not leak this!!)

Now you can run the following command to allow Docker to push to the repo:

```
echo $CR_PAT | docker login ghcr.io -u INSERT_USERNAME_HERE --password-stdin
```

There you go! Now try for instance running `docker compose up -d` in the project root folder!

## Pushing to docker

Before you can push to docker, you will have build the images and tag them. Run:

```
turbo docker-build
turbo docker-tag
```

and _THEN_ you can run:

```
turbo docker-push
```

## PLEASE do not use `npm` in this repo!!! Any `package-lock.json` or `npm` artifact will not pass code reviews.

## Starting All Projects

`docker compose up -d`

## Project Planning

- Sprint planning runs on GitHub issues
- Documents are hosted on Google Drive and are public ![https://drive.google.com/drive/folders/19lpbNJcOhSzu6dgTf4em5GLhbSm4QyvB?usp=sharing](https://drive.google.com/drive/folders/19lpbNJcOhSzu6dgTf4em5GLhbSm4QyvB?usp=sharing).

## Have fun coding! :D
