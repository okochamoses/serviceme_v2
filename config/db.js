const mongoose = require("mongoose");
const logger = require("./logger");
const { DB_HOST, DB_NAME, DB_PASS, DB_USER } = require("./keys");

let url;
if(!DB_USER || DB_USER === "" ) {
  url=`mongodb://${DB_HOST}/${DB_NAME}&authSource=admin`;
} else {
  url=`mongodb://${DB_USER}:${DB_PASS}@${DB_HOST}/${DB_NAME}`;
}

console.log(url)

mongoose
  .connect(url, { useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false, useUnifiedTopology: true })
  .then(() => {
    logger.info("Database connection established");
  })
  .catch(err => {
    logger.info(err);
  });

module.exports = mongoose;


// const x = [
//   {
//     "name" : "Barber",
//     "code" : "BA",
//     "image" : "http://45.63.100.80:5000/categories/serviceme.png",
//     "__v" : 0
//   }
//   {
//     "name" : "Bricklayer",
//     "code" : "BR",
//     "image" : "http://45.63.100.80:5000/categories/serviceme.png",
//     "__v" : 0
//   }
//   {
//     "name" : "Cab drivers",
//     "code" : "CD",
//     "image" : "http://45.63.100.80:5000/categories/serviceme.png",
//     "__v" : 0
//   }
//   {
//     "name" : "Car wash",
//     "code" : "CW",
//     "image" : "http://45.63.100.80:5000/categories/serviceme.png",
//     "__v" : 0
//   }
//   {
//     "name" : "Carpenter",
//     "code" : "CO",
//     "image" : "http://45.63.100.80:5000/categories/serviceme.png",
//     "__v" : 0
//   }
//   {
//     "name" : "Caterer | cake baker | chef | food vendor",
//     "code" : "CHEF",
//     "image" : "http://45.63.100.80:5000/categories/serviceme.png",
//     "__v" : 0
//   }
//   {
//     "name" : "Cleaner | fumigators",
//     "code" : "CLEANER",
//     "image" : "http://45.63.100.80:5000/categories/serviceme.png",
//     "__v" : 0
//   }
//   {
//     "name" : "Dstv/gotv Installation",
//     "code" : "SATELLITE",
//     "image" : "http://45.63.100.80:5000/categories/serviceme.png",
//     "__v" : 0
//   }
//   {
//     "name" : "Electronics repairers",
//     "code" : "ELECTRONICS",
//     "image" : "http://45.63.100.80:5000/categories/serviceme.png",
//     "__v" : 0
//   }
//   {
//     "name" : "Florist",
//     "code" : "FLORIST",
//     "image" : "http://45.63.100.80:5000/categories/serviceme.png",
//     "__v" : 0
//   }
//   {
//     "name" : "Graphics Designers",
//     "code" : "GRAPHICS",
//     "image" : "http://45.63.100.80:5000/categories/serviceme.png",
//     "__v" : 0
//   }
//   {
//     "name" : "Hair Stylist",
//     "code" : "HAIR_STYLIST",
//     "image" : "http://45.63.100.80:5000/categories/serviceme.png",
//     "__v" : 0
//   }
//   {
//     "name" : "Real Estate",
//     "code" : "RE",
//     "image" : "http://45.63.100.80:5000/categories/serviceme.png",
//     "__v" : 0
//   }
//   {
//     "name" : "Interior / Exterior Decoration",
//     "code" : "BA",
//     "image" : "http://45.63.100.80:5000/categories/serviceme.png",
//     "__v" : 0
//   }
//   {
//     "name" : "Laundry",
//     "code" : "LAUNDRY",
//     "image" : "http://45.63.100.80:5000/categories/serviceme.png",
//     "__v" : 0
//   }
//   {
//     "name" : "Medical Services",
//     "code" : "MEDICAL",
//     "image" : "http://45.63.100.80:5000/categories/serviceme.png",
//     "__v" : 0
//   }
//   {
//     "name" : "Painter",
//     "code" : "PAINTER",
//     "image" : "http://45.63.100.80:5000/categories/serviceme.png",
//     "__v" : 0
//   }
//   {
//     "name" : "Phone/Computer Engineer",
//     "code" : "PC",
//     "image" : "http://45.63.100.80:5000/categories/serviceme.png",
//     "__v" : 0
//   }
//   {
//     "name" : "Plumber",
//     "code" : "PLUMBER",
//     "image" : "http://45.63.100.80:5000/categories/serviceme.png",
//     "__v" : 0
//   }
//   {
//     "name" : "Security",
//     "code" : "SECURITY",
//     "image" : "http://45.63.100.80:5000/categories/serviceme.png",
//     "__v" : 0
//   }
//   {
//     "name" : "Shoe maker",
//     "code" : "SHOE",
//     "image" : "http://45.63.100.80:5000/categories/serviceme.png",
//     "__v" : 0
//   }
//   {
//     "name" : "Spa and Massage",
//     "code" : "SPA",
//     "image" : "http://45.63.100.80:5000/categories/serviceme.png",
//     "__v" : 0
//   }
//   {
//     "name" : "Trader / Shopper / Retailer",
//     "code" : "BA",
//     "image" : "http://45.63.100.80:5000/categories/serviceme.png",
//     "__v" : 0
//   }
//   {
//     "name" : "Veterinary doctor",
//     "code" : "VET",
//     "image" : "http://45.63.100.80:5000/categories/serviceme.png",
//     "__v" : 0
//   }


// ]