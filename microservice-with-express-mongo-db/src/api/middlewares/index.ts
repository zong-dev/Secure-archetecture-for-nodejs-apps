import attachUser from "./route/attachUser"
import auth from "./route/auth"
import verified from "./route/verified"
import admin from "./route/admin"
import hasRestrictions from "./route/hasRestrictions"
import authSocket from "./socket/auth"

export default {
    routes:{
        auth, verified, attachUser, admin, hasRestrictions
    },
    socket: {
        authSocket
    }
}