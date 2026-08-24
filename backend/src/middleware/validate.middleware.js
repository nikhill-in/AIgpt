import { ZodError } from "zod";

export const validate = ({
  body,
  params,
  query,
}) => (req, res, next) => {
  try {
    if (body) req.body = body.parse(req.body);
    if (params) req.params = params.parse(req.params);
    if (query) req.query = query.parse(req.query);

    next();
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: error.issues.map(({ path, message }) => ({
          field: path.join("."),
          message,
        })),
      });
    }

    next(error);
  }
};