const categoryRepository = require("../repositories/categoryRepository")
const imageService = require("../services/imageService")
const ServiceResponse = require("../util/ServiceResponse")
const { ResponseCode, ResponseMessage } = require("../util/Responses")
const logger = require("../config/logger")
const Category = require("../models/Category")

// add Category
exports.addCategory = async (req, res) => {
    try {
        const { name, code, image } = req.body;
        if (await categoryRepository.findByName(name) !== null) {
            return res.json(new ServiceResponse(ResponseCode.SUCCESS, "A category with this name already exists"))
        }
        if (await categoryRepository.findByCode(code)) {
            return res.json(new ServiceResponse(ResponseCode.SUCCESS, "A category with this code already exists"))
        }

        const imageResponse = await imageService.uploadImage(image, "categories");
        if(imageResponse === null) {
            return res.json(new ServiceResponse(ResponseCode.FAILURE, "Image upload failed! Please try again"));
        }

        const category = new Category({ name, code, image: imageResponse.secure_url });

        const savedCategory = await categoryRepository.save(category);

        return res.json(new ServiceResponse(ResponseCode.SUCCESS, ResponseMessage.SUCCESS, savedCategory))
    } catch (error) {
        logger.error("An error occured adding a new category: " + error.message)
        return res.json(new ServiceResponse(ResponseCode.ERROR, ResponseMessage.FAILURE))
    }
}

// enable category
exports.enableCategory = async (req, res) => {
    try {
        const { categoryId } = req.params;
        const category = await categoryRepository.findById(categoryId);
        if (category === null) {
            return res.json(new ServiceResponse(ResponseCode.FAILURE, "The category you entered does not exist"))
        }

        category.active = true;

        const updatedCategory = await categoryRepository.update(category.id, category);

        return res.json(new ServiceResponse(ResponseCode.SUCCESS, ResponseMessage.SUCCESS, updatedCategory))
    } catch (error) {
        logger.error("An error occured adding a enabling category: " + error.message)
        return res.json(new ServiceResponse(ResponseCode.ERROR, ResponseMessage.FAILURE))
    }
}

// disable category
exports.disableCategory = async (req, res) => {
    try {
        const { categoryId } = req.params;
        const category = await categoryRepository.findById(categoryId);
        if (category === null) {
            return res.json(new ServiceResponse(ResponseCode.FAILURE, "The category you entered does not exist"))
        }

        category.active = false;

        const updatedCategory = await categoryRepository.update(category.id, category);

        return res.json(new ServiceResponse(ResponseCode.SUCCESS, ResponseMessage.SUCCESS, updatedCategory))
    } catch (error) {
        logger.error("An error occured adding a enabling category: " + error.message)
        return res.json(new ServiceResponse(ResponseCode.ERROR, ResponseMessage.FAILURE))
    }
}

// edit category
exports.editCategory = async (req, res) => {
    try {
        const { categoryId } = req.params;
        const { name, image } = req.body;
        const category = await categoryRepository.findById(categoryId);
        if (category === null) {
            return res.json(new ServiceResponse(ResponseCode.FAILURE, "The category you entered does not exist"))
        }

        const imageResponse = image !== undefined ? await imageService.uploadImage(image, "categories") : "";
        if(imageResponse === null) {
            return res.json(new ServiceResponse(ResponseCode.FAILURE, "Image upload failed"));
        }


        category.name = name !== undefined ? name : category.name;
        category.image = image !== undefined ? imageResponse.secure_url : category.image;

        const updatedCategory = await categoryRepository.update(category.id, category);

        return res.json(new ServiceResponse(ResponseCode.SUCCESS, ResponseMessage.SUCCESS, updatedCategory))
    } catch (error) {
        logger.error("An error occured adding a enabling category: " + error.message)
        return res.json(new ServiceResponse(ResponseCode.ERROR, ResponseMessage.FAILURE))
    }
}

// view categories
exports.viewCategories = async (req, res) => {
    try {
        const categories = await categoryRepository.findAll();

        return res.json(new ServiceResponse(ResponseCode.SUCCESS, ResponseMessage.SUCCESS, categories))
    } catch (error) {
        logger.error("An error occured adding a enabling category: " + error.message)
        return res.json(new ServiceResponse(ResponseCode.ERROR, ResponseMessage.FAILURE))
    }
}

// rank category
exports.rank = async (req, res) => {
    return res.json({message: "Not implemented"})
}