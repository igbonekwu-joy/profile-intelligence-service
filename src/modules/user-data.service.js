const e = require("express");
const { createAxiosInstance } = require("../axios");
const config = require("../config");

const axiosGetInstance = createAxiosInstance(
  '/'
); 

const fetchGender = async (name) => {
  const response = await axiosGetInstance.get(
                    `${config.GENDERIZE_API_URL}`, 
                    { params: 
                      { name } 
                    }
                  );

  return response;
}

const fetchAge = async (name) => {
    const response = await axiosGetInstance.get(
                        `${config.AGIFY_API_URL}`, 
                        { params: 
                          { name } 
                        }
                      );

    return response;
}

module.exports = { fetchGender, fetchAge };