import AWS from 'aws-sdk';
import crypto from 'crypto';

const {
  VUE_APP_AWS_ACCESS_KEY_ID: accessKeyId,
  VUE_APP_AWS_SECRET_ACCESS_KEY: secretAccessKey,
  VUE_APP_AWS_BUCKET: bucketName,
  VUE_APP_AWS_REGION: region,
} = process.env;

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Credentials.html
AWS.config.credentials = new AWS.Credentials(accessKeyId, secretAccessKey);

// Create a new service object
const s3 = new AWS.S3({
  apiVersion: '2006-03-01',
  region,
});

/**
 * Get an object from a s3 bucket
 *
 * @param  {string} body - JSON string
 * @return {object}      - A promise containing the json parsed response
 */
const putObject = (body) => {
  // From AWS docs:
  // To ensure that data is not corrupted traversing the network, use the Content-MD5 header.
  // When you use this header, Amazon S3 checks the object against the provided MD5 value and,
  // if they do not match, returns an error.
  const contentMD5 = crypto.createHash('md5').update(body).digest('base64');

  // We use the md5 checksum for the filename
  const folder = process.env.NODE_ENV === 'production' ? 'data' : 'devData';
  // Remove forward slash from checksum to avoid folder nesting
  const filename = contentMD5.replace('/', '');
  const key = `${folder}/${filename}.json`;

  const params = {
    Bucket: bucketName,
    Key: key,
    Body: body,
    ContentMD5: contentMD5,
    ContentType: 'application/json',
  };

  return new Promise((resolve, reject) => {
    // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#putObject-property
    s3.putObject(
      params,
      (err, data) => {
        if (err) {
          console.error(err);
          reject(err);
        } else {
          resolve(data);
        }
      },
    );
  });
};

export default putObject;
