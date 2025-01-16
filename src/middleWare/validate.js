export const validate = (schema) => {
  return (req, res, next) => {
    let { error } = schema.validate(
      { ...req.body, ...req.params },
      { abortEarly: false }
    );
    let validationError = [];
    if (error?.details) {
      error.details.forEach((element) => {
        validationError.push({
          message: element.message,
          path: element.path[0],
        });
        return res
          .status(400)
          .json({ statsMessage: "fail", Error: validationError });
      });
    } else {
      next();
    }
  };
};
