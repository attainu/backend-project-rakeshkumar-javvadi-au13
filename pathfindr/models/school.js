const mongoose = require('mongoose');
const Review = require('./review')
const Schema = mongoose.Schema;

const SchoolSchema = new Schema({
    schoolName: String,
    image: String,
    fees: Number,
    description: String,
    location: String,
    admin: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
});

SchoolSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
})

module.exports = mongoose.model('School', SchoolSchema);