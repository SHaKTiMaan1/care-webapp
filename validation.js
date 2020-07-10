const Joi = require('@hapi/joi');

    //REGISTER VALIDATION
const registerValidationEmployee = validationData => {
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

    //LOGIN VALIDATION
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

    //CHILD REGISTRATION VALIDATION
const childRegistrationValidation = validationData => {
    const schema = Joi.object({
        name    : Joi.string()
                    .min(3)
                    .required(),
        age    : Joi.number()
                    .integer()
                    .required(),
        cci_name: Joi.string()
                    .min(3)
                    .max(120)
                    .required(),
        cci_id  : Joi.string()
                    .min(4)
                    .max(30)
                    .required(),
        address : Joi.string(),
        
    });

    return schema.validate(validationData);
}

module.exports.registerValidationEmployee = registerValidationEmployee;
module.exports.loginValidation = loginValidation;
module.exports.childRegistrationValidation = childRegistrationValidation;