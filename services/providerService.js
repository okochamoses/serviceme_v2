const providerRepository = require("../repositories/providerRepository")
const {validateBusiness} = require("../validation/providerValidation")
const businessRepository = require("../repositories/businessRepository")
const categoryRepository = require("../repositories/categoryRepository")
const ServiceResponse = require("../util/ServiceResponse")
const { ResponseCode, ResponseMessage } = require("../util/Responses")
const logger = require("../config/logger")

exports.addBusiness = async (req, res) => {
    try {
        // validate business request body
        const validationError = validateBusiness(req.body);
        const {businessName, streetAddress, state, lga, landmark,providerId, categoryId} = req.body;
        if(validationError) {
            return res.json(new ServiceResponse(ResponseCode.FAILURE, validationError))
        }
        // Check if user already has business name on platform
        const provider = await providerRepository.findById(providerId);
        if(provider === null) {
            return res.json(new ServiceResponse(ResponseCode.FAILURE, "Provider does not exist"));
        }

        provider.businesses.forEach(business => {
            if(business.businessName === businessName) {
                return res.json(new ServiceResponse(ResponseCode.FAILURE, "You already have this business name on your profile"));
            }
        })

        // Add category to business
        const category = await categoryRepository.findById(categoryId)
        if(category === null) {
            return res.json(new ServiceResponse(ResponseCode.FAILURE, "Please enater a valid category"));
        }
        
        const business = {businessName, streetAddress, state, lga, landmark, category};

        const savedBusiness = await businessRepository.save(business);

        // Add business to provider businesses
        provider.businesses.push(savedBusiness);
        const updatedProvider = await providerRepository.update(provider)

        // return messge
        return res.json(new ServiceResponse(ResponseCode.SUCCESS, ResponseMessage.SUCCESS, updatedProvider))
    } catch (error) {
        logger.error(error.message);
    }
}
