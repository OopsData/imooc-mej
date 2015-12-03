var mongoose = require('mongoose')
var Schema = mongoose.Schema
var ObjectId = Schema.Types.ObjectId

var MovieSchema = new Schema({
    stats: [{type: ObjectId, ref: 'Stat'}],
    url: String,
    vn: Number,
    state: Boolean,
    next_sync_time: {
        default: 0,
        type: Number
    },
    subtitle: String,
    duration: Number,
    publishTime: Number,
    title: String,
    meta: {
        createAt: {
            type: Date,
            default: Date.now()
        },
        updateAt: {
            type: Date,
            default: Date.now()
        }
    }
})

MovieSchema.pre('save', function(next) {    
    if (this.isNew) {
        this.meta.createAt = this.meta.updateAt = Date.now()
    } else {
        this.meta.updateAt = Date.now()
    }

    next()
})

MovieSchema.statics = {
    findByTitle: function(title, cb) {
        return this
            .findOne({title: title})
            .exec(cb)
    },
    fetch: function(q, cb) {
        if (q) {
            return this
                .find({'title': q})
                .sort({'next_sync_time': -1})
                .exec(cb)
        } else {
            return this
                .find({})
                .sort({'next_sync_time': -1})
                .exec(cb)
        }   
    }
}

module.exports = MovieSchema
