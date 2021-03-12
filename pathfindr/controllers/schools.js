const School = require('../models/school');

module.exports.index = async (req, res) => {
    const schools = await School.find({});
    res.render('schools/index', { schools })
}

module.exports.renderadminForm = (req, res) => {
    res.render('schools/admin');
}


module.exports.renderNewForm = (req, res) => {
    res.render('schools/new');
}

module.exports.createSchool = async (req, res, next) => {
    const school = new School(req.body.school);
    school.admin = req.user._id;
    await school.save();
    req.flash('success', 'Successfully made a new school!');
    res.redirect(`/schools/${school._id}`)
}

module.exports.showSchool = async (req, res,) => {
    const school = await School.findById(req.params.id).populate({
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
}

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const school = await School.findById(id)
    if (!school) {
        req.flash('error', 'Cannot find that school!');
        return res.redirect('/schools');
    }
    res.render('schools/edit', { school });
}

module.exports.updateSchool = async (req, res) => {
    const { id } = req.params;
    const school = await School.findByIdAndUpdate(id, { ...req.body.school });
    req.flash('success', 'Successfully updated school!');
    res.redirect(`/schools/${school._id}`)
}

module.exports.deleteSchool = async (req, res) => {
    const { id } = req.params;
    await School.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted school')
    res.redirect('/schools');
}