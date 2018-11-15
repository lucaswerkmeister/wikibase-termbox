import App from '@/components/App.vue';
import store from '@/store';
import { NS_ENTITY } from '@/store/namespaces';
import { ENTITY_INIT } from '@/store/entity/mutationTypes';
import EntityInitializer from '@/common/EntityInitializer';
import Vue from 'vue';
import MwWindow from '@/client/MwWindow';

export default (): Promise<Vue> => {
	return new Promise<Vue>( ( resolve, reject ) => {
		( window as MwWindow ).mw.hook( 'wikibase.entityPage.entityLoaded' ).add( ( entity: any ) => {
			store.commit(
				`${NS_ENTITY}/${ENTITY_INIT}`,
				( new EntityInitializer() ).newFromSerialization( entity ),
			);

			resolve( new Vue( {
				store,
				render: ( h ) => h( App ),
			} ) );
		} );
	} );
};
