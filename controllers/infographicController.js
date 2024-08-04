const Infographic = require('../models/Infographic');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const { addFooterToImage } = require('../util/imageCreateUtil');

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
        cb(null, uniqueName);
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 30 * 1024 * 1024 },
    fileFilter(req, file, cb) {
        // console.log("hi")
        console.log(req.body)
        // console.log(file) 
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('Please upload an image'));
        }
        cb(null, true);
    }
});
exports.allAvailbleTags = async (req, res) => {
    try {
        const tags = await Infographic.distinct('tags');
        res.send(tags);
    } catch (err) {
        res.status(500).send(err);
    }
};

exports.uploadMiddleware = upload.single('image');

exports.uploadInfographic = async (req, res) => {
    try {

        const infographic = new Infographic({
            ...req.body,
            image: req.file.filename,
        });

        await infographic.save();

        const originalFilePath = path.join('uploads', req.file.filename);
        const originalImageBuffer = fs.readFileSync(originalFilePath);

        // Create footer image
        const footerImageBuffer = await addFooterToImage(originalImageBuffer,{website:"yourwebsite.com",email:"your@email.com",phone:"1234567890",name:"yourname",isLogo:true}, '#60a5fa');
        const footerImagePath = path.join('uploads', `footer-${req.file.filename}`);
        fs.writeFileSync(footerImagePath, footerImageBuffer);

        console.log("success")
        res.status(201).send(infographic);
    } catch (err) {
        console.log(err)
        res.status(400).send(err);
    }
};

exports.getAllInfographics = async (req, res) => {
    try {
        const { page = 1, limit = 8 } = req.query;
        const infographics = await Infographic.find().limit(limit * 1).skip((page - 1) * limit).exec();
        const count = await Infographic.countDocuments();
        res.json({
            infographics,
            totalPages: Math.ceil(count / limit),
            currentPage: page
        });
    } catch (err) {
        res.status(500).send(err);
    }
};
exports.getAllInfographics1 = async (req, res) => {
    try {

        const infographics = await Infographic.find();

        res.send(infographics);
    } catch (err) {
        res.status(500).send(err);
    }
};

exports.getInfographic = async (req, res) => {
    try {
        const infographic = await Infographic.findById(req.params.id);
        if (!infographic) return res.status(404).send();
        res.send(infographic);
    } catch (err) {
        res.status(500).send(err);
    }
};

exports.updateInfographic = async (req, res) => {
    try {
        const infographic = await Infographic.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!infographic) return res.status(404).send();
        res.send(infographic);
    } catch (err) {
        res.status(400).send(err);
    }
};

exports.deleteInfographic = async (req, res) => {
    try {
        const infographic = await Infographic.findByIdAndDelete(req.params.id);
        if (!infographic) return res.status(404).send();

        // Delete the image file
        const imagePath = path.join(__dirname, '../uploads/', infographic.image);
        fs.unlink(imagePath, (err) => {
            if (err) {
                console.error(err);
            }
        });
        const imagePath2 = path.join(__dirname, '../uploads/', `footer-${infographic.image}`);
        fs.unlink(imagePath2, (err) => {
            if (err) {
                console.error(err);
            }
        });

        res.send(infographic);
    } catch (err) {
        res.status(500).send(err);
    }
};

exports.searchInfographics = async (req, res) => {
    try {
        const { description, tag, page = 1, limit = 10 } = req.query;
        const filter = {};

        if (description) {
            const regex = new RegExp(description, 'i'); // Case-insensitive search
            filter.$or = [
                { title: regex },
                { description: regex },
                { tags: { $elemMatch: { $regex: regex } } }
            ];
        }

        if (tag) {
            filter.tags = { $in: [tag] }; // Search for infographics containing the tag in the tags array
        }

        const skip = (parseInt(page) - 1) * parseInt(limit);

        const infographics = await Infographic.find(filter)
            .skip(skip)
            .limit(parseInt(limit));

        const total = await Infographic.countDocuments(filter);

        res.json({
            total,
            page: parseInt(page),
            limit: parseInt(limit),
            totalPages: Math.ceil(total / parseInt(limit)),
            infographics
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};



exports.downloadInfographic = async (req, res) => {
    try {
        console.log(req.body)
        if (!req.params.id) return res.status(400).send();

        const infographic = await Infographic.findById(req.params.id);
        if (!infographic) return res.status(404).send();

        const imagePath = path.join(__dirname, '../uploads/', infographic.image);
        const imageBuffer = fs.readFileSync(imagePath);

        // Add footer to the image
        // const footerInfo = {
        //     logoBase64: 'base64-encoded-image',
        //     name: 'Company Name',
        //     website: 'Company Address',
        //     phone: 'Company Phone',
        //     email: 'Company Email'
        // };

        const outBuffer = await addFooterToImage(imageBuffer, req.body.info, req.body.bgColor,infographic.image);
        res.set('Content-Disposition', `attachment; filename=${infographic.image}`);
        res.set('Content-Type', 'image/png');
        res.send(outBuffer);
    } catch (err) {
        res.status(500).send(err.message);
    }
}

exports.categoryInfographics = async (req, res) => {
    try {
        // Aggregate to get all unique tags at index 0
        const tagsAggregation = await Infographic.aggregate([
            { $project: { firstTag: { $arrayElemAt: ["$tags", 0] } } },
            { $group: { _id: "$firstTag" } }
        ]);

        const uniqueTags = tagsAggregation.map(tag => tag._id);

        // Fetch one infographic for each unique tag
        const infographics = await Promise.all(uniqueTags.map(async (tag) => {
            return Infographic.findOne({ tags: tag }).exec();
        }));

        // Filter out null results if no infographic was found for a tag
        const filteredInfographics = infographics.filter(infographic => infographic !== null);

        res.status(200).json(filteredInfographics);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching infographics', error });
    }
}
