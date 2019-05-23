import openApiSpec from '@/../openapi.json';
import buildOpenApiSpec from '@/server/buildOpenApiSpec';
import InvalidRequest from '@/server/route-handler/termbox/error/InvalidRequest';

describe( 'buildOpenApiSpec', () => {

	it( 'returns the unmodified openapi.json without a healthCheckQuery', () => {
		const validator = { validate: jest.fn() };
		const spec = buildOpenApiSpec( null, validator as any );
		expect( spec ).toBe( openApiSpec );
	} );

	it( 'sets x-amples and x-monitor given a valid healthCheckQuery', () => {
		const validator = { validate: jest.fn() };
		const language = 'de';
		const entity = 'Q123';
		const revision = '3';
		const editLink = '/edit/Q123';
		const preferredLanguages = 'de|en';

		const spec = buildOpenApiSpec(
			`language=${language}`
				+ `&entity=${entity}`
				+ `&revision=${revision}`
				+ `&editLink=${editLink}`
				+ `&preferredLanguages=${preferredLanguages}`,
			validator as any,
		);

		const termboxRouteSpec = spec.paths[ '/termbox' ].get;

		expect( termboxRouteSpec[ 'x-monitor' ] ).toBeTruthy();
		expect( termboxRouteSpec[ 'x-amples' ] ).not.toBeUndefined();

		const xAmples = termboxRouteSpec[ 'x-amples' ][ 0 ];
		expect( xAmples.title ).not.toBeUndefined();
		expect( xAmples.request ).toEqual( {
			query: {
				language,
				entity,
				revision,
				editLink,
				preferredLanguages,
			},
			response: {
				status: 200,
				headers: { 'content-type': 'text/html' },
			},
		} );
	} );

	it( 'throws an exception given an invalid healthCheckQuery', () => {
		const errors = [
			{ path: 'revision', message: 'should have required property "revision"' },
		];
		const validator = {
			validate: () => ( {
				code: 400,
				errors,
			} ),
		};

		try {
			buildOpenApiSpec( 'wrong=query&validator=sad', validator as any );
			expect( false ).toBe( true ); // expected exception did not happen
		} catch ( e ) {
			expect( e ).toBeInstanceOf( InvalidRequest );
			expect( e.info ).toBe( errors );
		}
	} );

} );
