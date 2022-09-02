export const paginate = (filter = {}, skip = 0, limit = 10, sort = {}, lookup = {}) => [{
    $match: {
        ...filter,
        active: true,
    }
},
{
    $sort: {
        ...sort,
        createdAt: -1,
    }
},
{
    $lookup: {
        ...lookup
        // from: 'statistic',
        // localField: '_id',
        // foreignField: 'driverId',
        // as: 'driver',
    },
},
{
    $unwind: {
        path: '$driver',
        preserveNullAndEmptyArrays: true,
    },
},
{
    $project: {
        driver: {
            $ifNull: [{
                $concat: ['$driver.firstName', ' ', '$driver.lastName']
            }, 'Technical']
        },
        entityId: 1,
        message: 1,
        meta: 1,
        createdAt: 1,
    },
},
{
    $facet: {
        total: [{
            $count: 'createdAt'
        }],
        data: [{
            $addFields: {
                _id: '$_id'
            }
        }],
    },
},
{
    $unwind: '$total'
},
{
    $project: {
        data: {
            $slice: ['$data', skip, {
                $ifNull: [limit, '$total.createdAt']
            }]
        },
        meta: {
            total: '$total.createdAt',
            limit: {
                $literal: limit
            },
            page: {
                $literal: ((skip / limit) + 1)
            },
            pages: {
                $ceil: {
                    $divide: ['$total.createdAt', limit]
                }
            },
        },
    },
},
];
