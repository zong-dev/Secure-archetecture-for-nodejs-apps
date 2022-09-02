export const models = [
    {
        name: 'userModel',
        model: require('../models/user.model').default,
    },
    {
        name: 'tokenModel',
        model: require('../models/token.model').default,
    },
    {
        name: 'settingModel',
        model: require('../models/setting.model').default,
    },
    {
        name: 'profileModel',
        model: require('../models/profile.model').default,
    },
    {
        name: 'mediaModel',
        model: require('../models/media.model').default,
    },
    {
        name: 'restrictionModel',
        model: require('../models/restriction.model').default,
    },
    {
        name: 'notificationModel',
        model: require('../models/notification.model').default,
    }
]