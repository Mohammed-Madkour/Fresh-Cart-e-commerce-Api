import Joi from "joi";

const addAuthValidation = Joi.object({
  name: Joi.string().min(3).max(20).required(),
  password: Joi.string().min(6).required(),
  rePassword: Joi.ref("password"),
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net"] },
    })
    .required(),
  phone: Joi.string().regex(/^01[0-2,5]{1}[0-9]{8}$/),
});
const updateAuthValidation = Joi.object({
  name: Joi.string().min(3).max(20).required(),
  email: Joi.string().email({
    minDomainSegments: 2,
    tlds: { allow: ["com", "net"] },
  }),
});
const updatePasswordAuthValidation = Joi.object({
  currentPassword: Joi.string().min(6).required(),
  password: Joi.string().min(6).required(),
  rePassword: Joi.ref("password"),
});


export {
  updateAuthValidation,
  addAuthValidation,
  updatePasswordAuthValidation,
};
