const B2 = require('backblaze-b2');
require('dotenv');
var fs = require('fs');
var path = require('path');
const Jimp = require('jimp');


var authToken = null;
var downloadUrl = null;
var apiUrl = null;
var auth = null;

const bucket = 'commonGroundImages';
const b2_fileName = 'bradchris3.jpg'; 

const b2 = new B2({
    accountId: process.env.B2_ACCOUNT_ID, // applicationKeyID or accountId
    applicationKey: process.env.B2_APPLICATION_KEY // or applicationKey or masterApplicationKey
  });
  
  authorize()
  .then(
   downloadFileByName(bucket, b2_fileName)
  );


//  var b = new Blob(['hi', 'constructing', 'a', 'blob']);
  //var blob = new Blob(["Hello, world!"], {type: "text/plain;charset=utf-8"});
//FileSaver.saveAs(blob, "hello world.txt");

  async function GetBucket() {
    try {
      let auth = await authorize(); // must authorize first
       let response = await b2.getBucket({ bucketName: process.env.B2_CG_AUDIO_BUCKET_NAME})
       console.log(response.data)
    } catch (err) {
      console.log('Error getting bucket:', err);
    }
  }

//   // get file info
// b2.getFileInfo({
//   fileId: 'fileId'
//   // ...common arguments (optional)
// });  // returns promise

// // get download authorization
// b2.getDownloadAuthorization({
//   bucketId: 'bucketId',
//   fileNamePrefix: 'fileNamePrefix',
//   validDurationInSeconds: 'validDurationInSeconds', // a number from 0 to 604800
//   b2ContentDisposition: 'b2ContentDisposition'
//   // ...common arguments (optional)
// });  // returns promise

// download file by name
async function downloadFileByName(bucketName, fileName){
  let auth = await authorize(); // must authorize first
let data = await b2.downloadFileByName({
  bucketName: bucketName,
  fileName: fileName,
  responseType: 'arraybuffer', // options are as in axios: 'arraybuffer', 'blob', 'document', 'json', 'text', 'stream'
  onDownloadProgress: (event) => {console.log("Download progress: " + event)} 
})
//console.log(data.data)
//FileSaver.saveAs(data.data, "./test.jpg");
let b2_filename = path.basename(data.config.url)
fs.writeFile(b2_filename, data.data, function (err) {
  if (err) throw err;


  Jimp.read(b2_filename)
  .then(image=> {
    return image
      // .resize(256, 256) // resize
      // .quality(60) // set JPEG quality
      // .greyscale() // set greyscale
      .crop(100, 190, 500, 400)
      .write(b2_filename +'_edit.jpg'); // save
  })
  .catch(err => {
    console.error(err);
  });
  const stats = fs.statSync("" + b2_filename + "_edit.jpg");
  const fileSizeInBytes = stats.size;
  //Convert the file size to megabytes (optional)
  const fileSizeInMegabytes = fileSizeInBytes / 1000000.0;
  console.log('Saved!');
  console.log('File size: ', fileSizeInMegabytes, "MB")
});

};

  async function authorize() {
    try {
      auth = await b2.authorize(); // must authorize first
      authToken = JSON.stringify(auth.data.authorizationToken);
      downloadUrl = JSON.stringify(auth.data.downloadUrl);
      apiUrl = JSON.stringify(auth.data.apiUrl)
      console.log("Backblaze Auth Token: " + authToken);
      console.log("Backblaze Download URL: " + downloadUrl);
      console.log("Backblaze API URL: " + apiUrl); 
    } catch (err) {
      console.log('Error getting bucket:', err);
    }
  }

//   // get download authorization
// b2.getDownloadAuthorization({
//   bucketId: 'bucketId',
//   fileNamePrefix: 'fileNamePrefix',
//   validDurationInSeconds: 'validDurationInSeconds', // a number from 0 to 604800
//   b2ContentDisposition: 'b2ContentDisposition'
//   // ...common arguments (optional)
// });  // returns promise


// // download file by name
// b2.downloadFileByName({
//   bucketName: 'bucketName',
//   fileName: 'fileName',
//   responseType: 'arraybuffer', // options are as in axios: 'arraybuffer', 'blob', 'document', 'json', 'text', 'stream'
//   onDownloadProgress: (event) => {} || null // progress monitoring
//   // ...common arguments (optional)
// });  // returns promise

// // download file by fileId
// b2.downloadFileById({
//   fileId: 'fileId',
//   responseType: 'arraybuffer', // options are as in axios: 'arraybuffer', 'blob', 'document', 'json', 'text', 'stream'
//   onDownloadProgress: (event) => {} || null // progress monitoring
//   // ...common arguments (optional)
// });  // returns promise