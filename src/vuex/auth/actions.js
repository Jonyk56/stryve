import * as token from '../../utils/token'
import * as types from '../mutation-types'
import * as helpers from '../../utils/helpers'
import { switchChannelsPanel } from '../app/actions'
import {
	fetchUser,
	resetUser,
	disconnectFromUserSocket } from '../users/actions'
import {
	resetActiveServer,
	unsubscribeFromAllChannels,
	disconnectFromServerSocket } from '../servers/actions'

/** TESTING **/
import { auth } from '../../../../stryve-api-client/lib/index'

export const setIsAuthenticated = (store, boolean) => {
	store.dispatch(types.SET_IS_AUTHENTICATED, boolean)
}

export const toggleAuthForm = (store, form) => {
	store.dispatch(types.TOOGLE_AUTH_FORM, form)
}

export const setAuthMessage = (store, tone, message) => {
	store.dispatch(types.SET_AUTH_MESSAGE, tone, message)
}

export const attemptUserLogin = (store, payload, tryAccessToken) => {
	auth.postLogin(
		payload,
		tryAccessToken,
		cb 	=> {
			store.dispatch(types.LOGIN_SUCCESS, cb)
			fetchUser(store)
		},
		errorCb	=> {
			store.dispatch(types.LOGIN_FAILURE, errorCb)
		}
	)
}

export const attemptUserLogout = (store) => {
	auth.postLogout(
		token.get(),
		cb 	=> {
			store.dispatch(types.LOGOUT)
			unsubscribeFromAllChannels(store)
			resetUser(store)
			disconnectFromUserSocket(store)
			resetActiveServer(store, true)
			disconnectFromServerSocket(store)
			switchChannelsPanel(store, 'contacts')
		}
	)
}

export const attemptUserRegistration = (store, payload) => {
	auth.postRegister(
		payload, 
		cb => {
			store.dispatch(types.REGISTRATION_SUCCESS, cb)
			fetchUser(store)
		},
		errorCb => { store.dispatch(types.REGISTRATION_FAILURE, errorCb) }
	)
}

