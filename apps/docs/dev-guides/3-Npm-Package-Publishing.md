# NPM Package Publishing Through GitHub Actions

## Setup

1. Setup a fine grained NPM access token: https://www.npmjs.com/settings/<user>/tokens/granular-access-tokens/new
   1. Needs read/write access
   2. Fine grained control over a single repository
   3. 1 year expiration
2. Setup repo level secrets for `NPM_TOKEN`: https://github.com/<org>/<repo>/settings/secrets/actions