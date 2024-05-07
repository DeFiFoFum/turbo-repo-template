# Workflows (Disabled)

This directory contains GitHub Actions workflows that are disabled. To enable a workflow, move it to the `.github/workflows` directory.

## Workflows

The workflows are intended to provided an automated way to manage version flows through an alpha (PR), beta (`staging`), and stable release (`main`) process.

Most of the magic happens in [./release-process.yaml](./release-process.yaml) which is a reusable workflow which takes parameters to determine the release type and version number.

It handles the following:

1. Docker image build and push to GitHub Container Registry
2. NPM package build and publish

It does NOT handle:

1. Versioning, which currently should be done manually with `lerna`
