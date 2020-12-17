/**
 * In production mode (on-wiki),
 * some of our libraries are loaded as separate ResourceLoader modules,
 * provided by MediaWiki core.
 * This test checks that the versions provided by MediaWiki core
 * are compatible with the requirements in our package.json.
 */

const assert = require( 'assert' );
const process = require( 'process' );
const semver = require( 'semver' );
const requireFromUrl = require( 'require-from-url/sync' );
const packageJson = require( '../package.json' );

const branch = process.env.ZUUL_BRANCH || 'master';

const mwVue = requireFromUrl(
	`https://raw.githubusercontent.com/wikimedia/mediawiki/${branch}/resources/lib/vue/vue.common.prod.js`,
);
const mwVuex = requireFromUrl(
	`https://raw.githubusercontent.com/wikimedia/mediawiki/${branch}/resources/lib/vuex/vuex.js`,
);

assert( semver.satisfies( mwVue.version, packageJson.devDependencies.vue ) );
assert( semver.satisfies( mwVuex.version, packageJson.devDependencies.vuex ) );
