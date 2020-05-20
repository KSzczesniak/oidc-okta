import {UserClaims as OktaUserClaims} from '@okta/okta-angular'
export interface UserClaims extends OktaUserClaims {
    groups?: string[]
}