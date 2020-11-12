const providerRepository = require("../repositories/providerRepository")
const { validateBusiness } = require("../validation/providerValidation")
const businessRepository = require("../repositories/businessRepository")
const categoryRepository = require("../repositories/categoryRepository")
const imageService = require("./imageService")
const ServiceResponse = require("../util/ServiceResponse")
const { ResponseCode, ResponseMessage } = require("../util/Responses")
const logger = require("../config/logger")
const { sendMail } = require("../config/mailer")
const sendSMS = require("../config/sms")
const mailer = require("../config/mailer")

exports.getProfile = async (req, res) => {
    try {
        const provider = await providerRepository.findById(req.user.id);
        return res.json(new ServiceResponse(ResponseCode.SUCCESS, ResponseMessage.SUCCESS, provider))
    } catch (error) {
        logger.error("An Error has occured: " + error.message);
        logger.error(error);
        return res.json(new ServiceResponse(ResponseCode.ERROR, ResponseMessage.ERROR))
    }
}

exports.addBusiness = async (req, res) => {
    try {
        // validate business request body
        const validationError = validateBusiness(req.body);
        const { businessName, streetAddress, state, lga, landmark, providerId, categoryId, email, phone } = req.body;
        if (validationError) {
            return res.json(new ServiceResponse(ResponseCode.FAILURE, validationError))
        }

        // Check if user already has business name on platform
        const provider = await providerRepository.findById(providerId);
        if (provider === null) {
            return res.json(new ServiceResponse(ResponseCode.FAILURE, "User does not exist"));
        }

        provider.businesses.forEach(business => {
            if (business.businessName === businessName) {
                return res.json(new ServiceResponse(ResponseCode.FAILURE, "You already have this business name on your profile"));
            }
        })

        // Add category to business
        const category = await categoryRepository.findById(categoryId)
        if (category === null) {
            return res.json(new ServiceResponse(ResponseCode.FAILURE, "Please enter a valid category"));
        }

        const business = { businessName, streetAddress, state, lga, landmark, category, email, phone };

        const savedBusiness = await businessRepository.save(business);

        // Add business to provider businesses
        provider.businesses.push(savedBusiness);
        const updatedProvider = await providerRepository.update(provider)

        // return messge
        return res.json(new ServiceResponse(ResponseCode.SUCCESS, ResponseMessage.SUCCESS, updatedProvider))
    } catch (error) {
        logger.error("An Error has occured: " + error.message);
        return res.json(new ServiceResponse(ResponseCode.ERROR, ResponseMessage.ERROR))
    }
}

exports.updateBusiness = async (req, res) => {
    try {
        // const validationError = validateBusiness(req.body);
        // const {businessName, streetAddress, state, lga, landmark,providerId, categoryId} = req.body;

        console.log(req.user)
        console.log(req.body)

        const id = req.user ? req.user.id : req.body.providerId
        const { businessId } = req.params;

        const provider = await providerRepository.findById(id);
        console.log(provider, id)
        let isProviderBusiness = false;
        provider.businesses.forEach(business => {
            if (business.id === businessId) {
                isProviderBusiness = true;
            }
        })

        if (!isProviderBusiness) {
            return res.json(new ServiceResponse(ResponseCode.FAILURE, "Oops! This business does not belong to the logged in provider"));
        }

        const business = await businessRepository.findById(businessId);
        if (business === null) {
            return res.json(new ServiceResponse(ResponseCode.FAILURE, "Sorry, the business you're trying to update does not exist"));
        }

        const updatedBusiness = await businessRepository.update(businessId, req.body);

        return res.json(new ServiceResponse(ResponseCode.SUCCESS, ResponseMessage.SUCCESS, updatedBusiness))
    } catch (error) {
        logger.error("An Error has occured: " + error.message);
        logger.error(error);
        return res.json(new ServiceResponse(ResponseCode.ERROR, ResponseMessage.ERROR))
    }
}

exports.updateProfile = async (req, res) => {
    try {
        const provider = await providerRepository.findById(req.user.id);

        const updatedProvider = await providerRepository.update(req.user.id, req.body);

        return res.json(new ServiceResponse(ResponseCode.SUCCESS, ResponseMessage.SUCCESS, updatedProvider))
    } catch (error) {
        logger.error("An Error has occured: " + error.message);
        logger.error(error);
        return res.json(new ServiceResponse(ResponseCode.ERROR, ResponseMessage.ERROR))
    }
}

exports.addImages = async (req, res) => {
    try {
        const { images } = req.body;
        const { businessId } = req.params;

        // Validate business
        const business = await businessRepository.findById(businessId);
        if (business === null) {
            return res.json(new ServiceResponse(ResponseCode.FAILURE, "Business does not exist"))
        }

        const allImageDetails = await imageService.uploadImages(images); // Store image to online db

        // if (imageDetails.secure_url === undefined) {
        //     return res.json(new ServiceResponse(ResponseCode.FAILURE, "Oops! There was an error saving your image. Please try again"))
        // }

        const allImages = allImageDetails.map(i => i.secure_url)
        // console.log(allImages)
        // console.log(allImageDetails)

        business.images = [...business.images, ...allImages];
        console.log(business.images)
        const updatedBusiness = await businessRepository.save(business);

        return res.json(new ServiceResponse(ResponseCode.SUCCESS, ResponseMessage.SUCCESS, updatedBusiness))
    } catch (error) {
        logger.error("An Error has occured: " + error.message);
        logger.error(error);
        console.log(error)
        return res.json(new ServiceResponse(ResponseCode.ERROR, ResponseMessage.ERROR))
    }
}

exports.deleteImage = async (req, res) => {
    try {
        const { image } = req.body;
        console.log("MIMIMIMIMIMIMIMI", req.body)
        const { businessId } = req.params;

        // Validate business
        const business = await businessRepository.findById(businessId);
        if (business === null) {
            return res.json(new ServiceResponse(ResponseCode.FAILURE, "Business does not exist"))
        }

        console.log(business.images.length)
        console.log(image)
        let x = business.images.filter(img => image !== img);
        console.log(business.images.length)
        const updatedBusiness = await businessRepository.update(business.id, {images: x});

        return res.json(new ServiceResponse(ResponseCode.SUCCESS, ResponseMessage.SUCCESS, updatedBusiness))
    } catch (error) {
        logger.error("An Error has occured: " + error.message);
        logger.error(error);
        // console.log(error)
        return res.json(new ServiceResponse(ResponseCode.ERROR, ResponseMessage.ERROR))
    }
}

exports.requestHomeService = async (req, res) => {
    try {
        const {name, phone, address, businessId, request} = req.body;
        console.log(name, phone, address, businessId)

        
        // Search for provider
        const provider = await providerRepository.findByBusinessId(businessId);
        
        // Send push notification to provider device using firebase and email
        sendMail(provider.email, "Home Service Request", 
        `<p>Hi ${provider.firstName},</p>
        <p>A request has been made for your service on the serviceme.ng platform. Please find the details of the request below.</p>
        
        <p>Customer Name: ${name}<br>
        Phone Number: ${phone}<br>
        Request Brief: ${request}<br>
        Address: ${address}</p>
        
        Endeavour to reach out to the customer to schedule a date/time to render your service and to get more information`
        );

        // Send SMS
        const smsMessage = `You have a new request: \n
        Name: ${name}\n
        Phone: ${phone}\n
        Request brief: ${request}\n
        Address: ${address}`;
        sendSMS(provider.phone, smsMessage);
        console.log(provider.phone, smsMessage);

        // TODO: firebase push notification here


        return res.json(new ServiceResponse(ResponseCode.SUCCESS, ResponseMessage.SUCCESS))
    } catch (error) {
        logger.error("An Error has occured: " + error.message);
        return res.json(new ServiceResponse(ResponseCode.ERROR, ResponseMessage.ERROR))
    }
}

exports.requestOnPremiseService = async (req, res) => {
    try {
        const {name, phone, businessId, request} = req.body;
        
        // Search for provider
        const provider = await providerRepository.findByBusinessId(businessId);
        
        // Send push notification to provider device using firebase and email
        sendMail(provider.email, "On Premise Service Request", 
        `<p>Hi ${provider.firstName},</p>
        <p>A request has been made for your service on the serviceme.ng platform. Please find the details of the request below.</p>
        
        <p>Customer Name: ${name}<br>
        Phone Number: ${phone}<br>
        Request Brief: ${request}<br>
        
        Endeavour to reach out to the customer to schedule a date/time to render your service and to get more information`
        );
        // Email send

        // Send SMS
        const smsMessage = `You have a new on-premise request: \n
        Name: ${name}\n
        Phone: ${phone}\n
        Request brief: ${request}`;
        sendSMS(provider.phone, smsMessage);
        console.log(provider.phone, smsMessage);

        // TODO: firebase push notification here


        return res.json(new ServiceResponse(ResponseCode.SUCCESS, ResponseMessage.SUCCESS))
    } catch (error) {
        logger.error("An Error has occured: " + error.message);
        return res.json(new ServiceResponse(ResponseCode.ERROR, ResponseMessage.ERROR))
    }
}
