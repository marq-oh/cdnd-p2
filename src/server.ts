import express from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // @TODO:1 IMPLEMENT A RESTFUL ENDPOINT
  // GET /filteredimage?image_url={{URL}}
  // endpoint to filter an image from a public url.
  // IT SHOULD
  //    1. validate the image_url query
  //    2. call filterImageFromURL(image_url) to filter the image
  //    3. send the resulting file in the response
  //    4. deletes any files on the server on finish of the response
  // QUERY PARAMATERS
  //    image_url: URL of a publicly accessible image
  // RETURNS
  //   the filtered image file [!!TIP res.sendFile(filteredpath); might be useful]

  /**************************************************************************** */

  //! END @TODO1
  
  // MSJ: Endpoint to filter an image from a public url
  app.get( "/filteredimage", async ( req, res ) => {
    // Get image_url using Express
    let image_url = req.query.image_url;
    console.log(image_url);
    
    // Validate the image_url query
    if (image_url == '' || !image_url) {
      res.status(400).send({
        message: "Invalid image_url"
      });
    }
    else{
      // Call filterImageFromURL(image_url) to filter the image
      let filtered_img = await filterImageFromURL(image_url);

      // Send the resulting file in the response
      res.status(200).sendFile(filtered_img, function (err) {
        if (err) {
          res.status(400).send({
            message: "Invalid image_url"
          });      
        } 
        else {
          // Delete any files on the server on finish of the response
          deleteLocalFiles([filtered_img]);
        }
      })
    }
  });

  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async ( req, res ) => {
    res.status(200).send("try GET /filteredimage?image_url={{}}")
  } );
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();