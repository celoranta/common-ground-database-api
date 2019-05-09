const B2 = require('backblaze-b2');
require('dotenv');
var fs = require('fs');


//var FileSaver = require('file-saver');
//var Blob = require('blob');

var authToken = null;
var downloadUrl = null;
var apiUrl = null;
var auth = null;

const b2 = new B2({
    accountId: process.env.B2_ACCOUNT_ID, // applicationKeyID or accountId
    applicationKey: process.env.B2_APPLICATION_KEY // or applicationKey or masterApplicationKey
  });
  
  authorize()
  .then(
   downloadFileByName('commonGroundImages','band1.jpg' )
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
fs.writeFile('mynewfile3.jpg', data.data, function (err) {
  if (err) throw err;
  console.log('Saved!');
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