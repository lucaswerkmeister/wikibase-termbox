import { ActionContext } from 'vuex';
import {
	LANGUAGE_PREFERENCE,
	USER_NAME_SET,
} from './actionTypes';
import {
	LANGUAGE_INIT,
	SECONDARY_LANGUAGES_INIT,
	USER_SET_NAME,
} from './mutationTypes';
import { MESSAGES_INIT } from '@/store/messages/actionTypes';
import User from '@/store/user/User';
import {
	NS_LANGUAGE,
	NS_MESSAGES,
} from '@/store/namespaces';
import { ENSURE_AVAILABLE_IN_LANGUAGE } from '@/store/language/actionTypes';
import { action } from '@/store/util';

export const actions = {

	[ LANGUAGE_PREFERENCE ](
		context: ActionContext<User, any>,
		{ primaryLanguage, preferredLanguages }: { primaryLanguage: string, preferredLanguages: string[] },
	): Promise<[void, void]> {
		context.commit( LANGUAGE_INIT, primaryLanguage );

		context.commit( SECONDARY_LANGUAGES_INIT, preferredLanguages.filter( ( languageKey: string ) => {
			return languageKey !== primaryLanguage;
		} ) );

		return Promise.all( [
			context.dispatch( action( NS_MESSAGES, MESSAGES_INIT ), primaryLanguage, { root: true } ),
			context.dispatch( action( NS_LANGUAGE, ENSURE_AVAILABLE_IN_LANGUAGE ), primaryLanguage, { root: true } ),
		] );
	},

	[ USER_NAME_SET ]( context: ActionContext<User, any>, name: string ) {
		context.commit( USER_SET_NAME, name );
	},
};
