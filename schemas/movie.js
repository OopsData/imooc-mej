var mongoose = require('mongoose')

var MovieSchema = new mongoose.Schema({
    name: String,
    playCount: Number,
    duration: Number,
    upCount: Number,
    downCount: Number,
    imageUrl: String,
    meta: {
        
    }
})

MovieSchema.pre('save', function(next) {
    // if (this.isNew) {
    //     this.meta.createAt = this.meta.updateAt = Date.now()
    // } else {
    //     this.meta.updateAt = Date.now()
    // }

    next()
})

MovieSchema.statics = {
    fetch: function(cb) {
        return this
            .find({})
            // .sort('meta.updateAt')
            .exec(cb)
    },

    findById: function(id, cb) {
        return this
            .findOne({
                _id: id
            })
            .exec(cb)
    },

    findByName: function(name, cb) {
        return this
            .findOne({
                name: name
            })
            .exec(cb)
    }
}

module.exports = MovieSchema
