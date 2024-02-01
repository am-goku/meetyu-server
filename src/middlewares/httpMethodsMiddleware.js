const httpMethodsMiddleware = (req, res, next) => {
  try {
    if (req.method === "OPTIONS") {
      res.set(
        "Access-Control-Allow-Methods",
        "GET, POST, PUT, PATCH, DELETE, HEAD"
      );
      res.set("Access-Control-Allow-Headers", "Content-Type");
      res.status(200).end();
    }

    if (req.method === "TRACE") {
      //headers for TRACE response
      res.setHeader("Content-Type", "message/http");
      res.setHeader("Cache-Control", "no-cache");

      // Respond with the details of the received request
      const responseData = `
    TRACE request received:
    Request URL: ${req.url}
    Request Method: ${req.method}
    Request Headers: ${JSON.stringify(req.headers)}
    Request Body: ${JSON.stringify(req.body)}
  `;

      res.status(200).send(responseData).end();
    }

    next();

  } catch (error) {
    res.status(500).send({error_code:"INTERNAL_SERVER_ERROR", message:"Something went wrong", error})
  }
}


export default httpMethodsMiddleware;