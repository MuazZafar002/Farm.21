// @ts-expect-error TS(7034): Variable 'app' implicitly has type 'any' in some l... Remove this comment to see the full error message
import {app, auth, db, storage} from './firebase.config'
import {store} from '../redux/store'
import {colors} from './colors'

// @ts-expect-error TS(7005): Variable 'app' implicitly has an 'any' type.
export {app, auth, db, store, colors, storage}
