const { StatusCodes } = require("http-status-codes");
const { validateName } = require("./user-data.validator");
const { fetchGender } = require("./user-data.service");

const fetchUserData = async (req, res) => {
    const name = req.query.name;

    // Validate with Joi
    const { error } = validateName.validate({ name });
    if (error) {
        const isRequired = error.details[0].type === 'string.empty' || error.details[0].type === 'any.required';
        const statusCode = isRequired ? StatusCodes.BAD_REQUEST : StatusCodes.UNPROCESSABLE_ENTITY;
        
        return res.status(statusCode).json({ status: "error", message: error.details[0].message });
    }

    const fetchResult = await fetchGender(name);
    // console.log(fetchResult.data);
    // const fetchAgeResult = await fetchAge(name);
    const { gender, probability, count: sample_size, ...others } = fetchResult.data;

    if (gender === null || sample_size === 0) {
        return res.status(StatusCodes.NOT_FOUND).json({ status: "error", message: "No prediction available for the provided name." });
    }

    let processed_at = new Date().toISOString();
    let is_confident = probability >= 0.7 && sample_size >= 100;

    return res.status(StatusCodes.OK).json({ 
        status: "success", 
        data: { ...others, gender, probability, sample_size, is_confident, processed_at } 
    });
}

module.exports = {
    fetchUserData
}