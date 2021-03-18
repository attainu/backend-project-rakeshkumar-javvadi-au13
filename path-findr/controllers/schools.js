const Schools = require('../models/school');
const { cloudinary } = require("../cloudinary");


module.exports.index = async (req, res) => {
    const schools = await Schools.find({});
    res.render('schools/index', { schools });
};

module.exports.renderadminForm = (req, res) => {
    res.render('schools/admin');
};


module.exports.renderNewForm = (req, res) => {
    res.render('schools/new');
};

module.exports.createSchool = async (req, res, next) => {
    const school = new Schools(req.body.school);
    school.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    school.admin = req.user._id;
    await school.save();
    console.log(school);
    req.flash('success', 'Successfully made a new school!');
    res.redirect(`/schools/${school._id}`);
};

module.exports.showSchool = async (req, res,) => {
    const school = await Schools.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'admin'
        }
    }).populate('admin');
    if (!school) {
        req.flash('error', 'Cannot find that school!');
        return res.redirect('/schools');
    }
    res.render('schools/show', { school });
};

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const school = await Schools.findById(id);
    if (!school) {
        req.flash('error', 'Cannot find that school!');
        return res.redirect('/schools');
    }
    res.render('schools/edit', { school });
};

module.exports.updateSchool = async (req, res) => {
    const { id } = req.params;
    console.log(req.body);
    const school = await Schools.findByIdAndUpdate(id, { ...req.body.school });
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
    school.images.push(...imgs);
    await school.save();
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await school.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } });
    }
    req.flash('success', 'Successfully updated school!');
    res.redirect(`/schools/${school._id}`);
};

module.exports.deleteSchool = async (req, res) => {
    const { id } = req.params;
    await Schools.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted school');
    res.redirect('/schools');
};