// Wraps async controller functions to automatically pass errors to your global error handler (in app.js)
const catchAsync = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};

export default catchAsync;