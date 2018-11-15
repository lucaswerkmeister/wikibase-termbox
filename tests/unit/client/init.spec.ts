import Vue from 'vue';
import ImmediatelyInvokingEntityLoadedHookHandler from '@/mock-data/ImmediatelyInvokingEntityLoadedHookHandler';
import init from '@/client/init';
import MwWindow from '../../../src/client/MwWindow';

function configureMwHookWithEntity( key: string, entity: any ) {
	( window as MwWindow ).mw = {
		hook: () => new ImmediatelyInvokingEntityLoadedHookHandler( entity ),
		config: { get: () => null }
	};
}

describe( 'client/init', () => {

	it( 'returns a Promise with an App component', () => {
		configureMwHookWithEntity(
			'wikibase.entityPage.entityLoaded', {
				id: 'Q1',
				labels: {},
				descriptions: {},
				aliases: {},
			} );
		const appPromise = init();

		expect( appPromise ).toBeInstanceOf( Promise );
		expect( appPromise ).resolves.toBeInstanceOf( Vue );
	} );

	it( 'initializes the store with entity data', () => {
		const entity = {
			id: 'Q1',
			labels: { en: { language: 'en', value: 'potato' } },
			descriptions: { en: { language: 'en', value: '...' } },
			aliases: { en: [ { language: 'en', value: '...' } ] },
		};
		configureMwHookWithEntity( 'wikibase.entityPage.entityLoaded', entity );
		init().then( ( app ) => {
			expect( app.$store.state.entity.id ).toBe( entity.id );
			expect( app.$store.state.entity.labels ).toBe( entity.labels );
			expect( app.$store.state.entity.descriptions ).toBe( entity.descriptions );
			expect( app.$store.state.entity.aliases ).toBe( entity.aliases );
		} );
	} );

} );
