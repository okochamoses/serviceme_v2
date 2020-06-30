const cloudinary = require("cloudinary")
const { CLOUD_NAME, CLOUD_API_KEY, CLOUD_API_SECRET } = require("../config/keys")
const logger = require("../config/logger")

cloudinary.config({
    cloud_name: CLOUD_NAME,
    api_key: CLOUD_API_KEY,
    api_secret: CLOUD_API_SECRET
});

// cloudinary.utils.api_sign_request(params_to_sign, api_secret)

exports.uploadImage = async (base64Image, directory) => {
    const uniqueFilename = new Date().toISOString();
    try {
        return await cloudinary.v2.uploader.upload(base64Image,
            { public_id: `${directory}/${uniqueFilename}`, tags: directory }, // directory and tags are optional
            async (err, image) => {
                if (err) {
                    console.log(err)
                }
                return image;
            }
        )
    } catch (error) {
        logger.error("An Error has occured uploading the image: " + error.message);
        return null;
    }

}

exports.uploadImages = async (base64ImagesArray) => {
    let images = []
    base64ImagesArray.forEach(async base64Image => {
        await images.push(this.uploadImage(base64Image));
    });

    return images;
}