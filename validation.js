const Joi = require('@hapi/joi');

    //REGISTER VALIDATION
const registerValidation = validationData => {
    const schema = Joi.object({
        employee_id     : Joi.string()
                        .min(2),
        name            : Joi.string()
                        .min(2)
                        .required(),
        contactNumber   :Joi.number()
                        .min(2),
        email           : Joi.string()
                        .min(7)
                        .required()
                        .email(),
        password        : Joi.string()
                        .min(4)
                        .required()
    });
    return schema.validate(validationData);
}

const loginValidation = validationData => {
    const schema = Joi.object({
        email   : Joi.string()  
                .min(7)
                .required()
                .email(),
        password : Joi.string()
                .min(4)
                .required()
    });
    return schema.validate(validationData);
}


module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;