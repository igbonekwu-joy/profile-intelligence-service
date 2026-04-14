const { StatusCodes } = require("http-status-codes");
const { validateName } = require("./user-data.validator");
const { fetchGender, fetchAge } = require("./user-data.service");

const fetchUserData = async (req, res) => {
    let age_group;
    const name = req.query.name;

    // Validate with Joi
    const { error } = validateName.validate({ name });
    if (error) {
        const isRequired = error.details[0].type === 'string.empty' || error.details[0].type === 'any.required';
        const statusCode = isRequired ? StatusCodes.BAD_REQUEST : StatusCodes.UNPROCESSABLE_ENTITY;
        
        return res.status(statusCode).json({ status: "error", message: error.details[0].message });
    }

    const fetchResult = await fetchGender(name);
    const fetchAgeResult = await fetchAge(name);
    
    const { gender, probability: gender_probability, count: sample_size } = fetchResult.data;
    const { age } = fetchAgeResult.data;

    if (gender === null || sample_size === 0) {
        return res.status(StatusCodes.NOT_FOUND).json({ status: "error", message: "No prediction available for the provided name." });
    }

    if (age === null) {
        return res.status(StatusCodes.NOT_FOUND).json({ status: "error", message: "No age prediction available for the provided name." });
    }

    if (age > 0 && age <= 12) {
        age_group = "child";
    }
    else if (age > 12 && age <= 19) {
        age_group = "teenager";
    }
    else if (age > 19 && age <= 59) {
        age_group = "adult";
    }
    else {
        age_group = "senior";
    }

    return res.status(StatusCodes.OK).json({ 
        status: "success", 
        data: { name, gender, gender_probability, sample_size, age, age_group } 
    });
}

module.exports = {
    fetchUserData
}