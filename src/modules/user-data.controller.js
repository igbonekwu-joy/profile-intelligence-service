const { StatusCodes } = require("http-status-codes");
const { validateName } = require("./user-data.validator");
const { fetchGender, fetchAge, fetchCountryList } = require("./user-data.service");
const { uuidv7 } = require("uuidv7");
const userData = require("./user-data.model");

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
    const fetchCountryListResult = await fetchCountryList(name);
    
    const { gender, probability: gender_probability, count: sample_size } = fetchResult.data;
    const { age } = fetchAgeResult.data;
    const countries = fetchCountryListResult.data.country;
 
    if (gender === null || sample_size === 0) {
        return res.status(StatusCodes.BAD_GATEWAY).json({ status: "error", message: "No prediction available for the provided name." });
    }

    if (age === null) {
        return res.status(StatusCodes.BAD_GATEWAY).json({ status: "error", message: "No age prediction available for the provided name." });
    }

    if (countries.length === 0) {
        return res.status(StatusCodes.BAD_GATEWAY).json({ status: "error", message: "No country prediction available for the provided name." });
    }

    if (age > 0 && age <= 12) 
        age_group = "child";
    else if (age > 12 && age <= 19) 
        age_group = "teenager";
    else if (age > 19 && age <= 59) 
        age_group = "adult";
    else 
        age_group = "senior";

    const topCountry = countries.reduce((highest, current) => 
        current.probability > highest.probability ? current : highest
    );

    const id = uuidv7();

    const data = { id, name, gender, gender_probability, sample_size, age, age_group, country_id: topCountry.country_id, country_probability: topCountry.probability };

    let user = new userData(data);
    user = await user.save();

    return res.status(StatusCodes.CREATED).json({ status: "success", data: user });
}

module.exports = {
    fetchUserData
}