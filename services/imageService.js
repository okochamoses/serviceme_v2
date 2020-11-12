const cloudinary = require("cloudinary")
const uuidv4 = require("uuid").v4
const { CLOUD_NAME, CLOUD_API_KEY, CLOUD_API_SECRET, IMAGE_DESTINATION } = require("../config/keys")
const logger = require("../config/logger")

cloudinary.config({
    cloud_name: CLOUD_NAME,
    api_key: CLOUD_API_KEY,
    api_secret: CLOUD_API_SECRET
});

// cloudinary.utils.api_sign_request(params_to_sign, api_secret)

exports.uploadImage = async (base64Image, directory) => {
    if(IMAGE_DESTINATION === "CLOUD") {
        return this.uploadImageToCloud(base64Image, directory)
    } else {
        return this.uploadImageToServer(base64Image, directory)
    }
}

exports.uploadImageToCloud = async (base64Image, directory) => {
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

exports.uploadImageToServer = async (base64Image, directory) => {
    const uniqueFilename = new Date().toISOString();
    const data = base64Image.split(";base64")[1];
    const extension = base64Image.split(";base64")[0].split("/")[1];

    try {
        const randomStr = uuidv4();
        require("fs").writeFile(`public/${directory}/${uniqueFilename}-${randomStr}.${extension}`, data, 'base64', function(err) {
            console.log(err);
          });
        return {secure_url: `${IMAGE_DESTINATION}/${directory}/${uniqueFilename}-${randomStr}.${extension}`}
    } catch (error) {
        logger.error("An Error has occured uploading the image: " + error.message);
        return null;
    }
}

exports.uploadImages = async (base64ImagesArray) => {
    let images = []
    for (const base64Image of base64ImagesArray) {
        await images.push( await this.uploadImage(base64Image, "business"));
    };

    return await images;
}