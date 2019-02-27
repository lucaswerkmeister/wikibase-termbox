# wikibase-termbox
User interface for managing terms in Wikibase.

This file can be considered a quick setup guide.
To dive into the development documentation please refer to the [docs folder](./docs).

## How this connects to Wikibase
This code can be found as a git submodule of Wikibase at the following relative path:
```
extensions/Wikibase/view/lib/wikibase-termbox/
```

This is because the client-side JS and styling needs to be served by Wikibase. It is served by a component of MediaWiki
called [ResourceLoader](https://www.mediawiki.org/wiki/ResourceLoader). The configuration for this can be seen in
[resources.php](../resources.php)

The commit of this submodule on Wikibase master may not be the latest development version of this code
so to get the latest development version you may need to run:
```
git checkout master
```

Since the Wikidata runs a weekly snapshot of Wikibase master we can be explicit about which version of termbox we run by
changing the commit of the submodule rather than always having to use master of termbox.

## Installation
```
# ensure the node user uses your user id, so you own generated files
docker-compose build --build-arg UID=$(id -u) --build-arg GID=$(id -g) node
```

```
# install npm dependencies
docker-compose run --rm node npm install
  ```

## Configuring
* set the server-specific environment variables: `cp .env.example .env` and modify `.env` accordingly
  * `SSR_PORT` is the port at which you can reach the node server performing server-side vue rendering
  * `MEDIAWIKI_NETWORK_TO_JOIN` is the (local docker) network the SSR service should also be attached to in order to make it available to wikibase and vice-versa.

    Recommendation is to use this in conjunction with [addshore/mediawiki-docker-dev](https://github.com/addshore/mediawiki-docker-dev/).

    The SSR service can be reached inside of this network at http://node-ssr:<SSR_PORT from your .env file>, in turn the SSR services retrieves some information from the <WIKIBASE_REPO>.
    > ⚠ Some versions of `docker-compose` insist this network exists. Make sure to set this value to an existing docker network (either created by another `docker-compose` project or you manually) - check via `docker network ls`
  * `CSR_PORT` is the port at which you can reach the development server
  * `NODE_ENV` is the environment to set for node.js
  * `WIKIBASE_REPO` is the wikibase installation used as information authority (e.g. to load entity information), including the path (where both `index.php` and `api.php` are located)

### Configuring Wikibase
In order to have this termbox displayed in Wikibase entity pages Wikibase need to be configured.
For details see: [options.wiki](https://gerrit.wikimedia.org/r/plugins/gitiles/mediawiki/extensions/Wikibase/+/master/docs/options.wiki)

## Building
* `docker-compose run --rm node npm run build` builds the frontend code
* `docker-compose run --rm node npm run build-server` builds the server-side manifest and the node entry point

## Starting the server
* `docker-compose up` starts two servers
  * a development SSR server at http://localhost:<SSR_PORT from your .env file>
  * a development server for the frontend part in development mode reachable at http://localhost:<CSR_PORT from your .env file>

## Development

### Run all code quality tools
* `docker-compose run --rm node npm test`

### Run code quality tools individually
* `docker-compose run --rm node npm run test:unit` runs all tests
* `docker-compose run --rm node npm run test:lint` for linting, `docker-compose run --rm node npm run fix` for fixing auto-fixable lint errors

## Blubber build

This project can be build with [blubber](https://wikitech.wikimedia.org/wiki/Blubber), configuration is located in the `.pipeline` directory.

Instructions above will gradually be migrated to use blubber.

### Running tests
```
blubber .pipeline/blubber.yaml test > Dockerfile
docker build -t wmde/wikibase-termbox-test .
docker run --rm wmde/wikibase-termbox-test
```

### Running for production

E.g. with production wikidata configured as the backend (`WIKIBASE_REPO`).

```
blubber .pipeline/blubber.yaml production > Dockerfile
docker build -t wmde/wikibase-termbox-production .
docker run --rm -p "3030:3030" -e WIKIBASE_REPO=https://www.wikidata.org/w -e SSR_PORT=3030 wmde/wikibase-termbox-production
```
