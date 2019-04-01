let db = require('./pool.js')

db.pool.query(
    `
  CREATE TABLE IF NOT EXISTS PersonNameTypes (
  id Int NOT NULL AUTO_INCREMENT,
  personNameTypeString varchar(255) UNIQUE,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  editedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
  );
  `
), function (error, results, fields) {
    if (error) throw error;
}

db.pool.query(
    `
    CREATE TABLE IF NOT EXISTS PersonNames (
    id Int NOT NULL AUTO_INCREMENT,
    personNameString varchar(255),
    personNameTypeId Int,
    personId Int,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    editedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    FOREIGN KEY (personNameTypeId) REFERENCES PersonNameTypes(id),
    FOREIGN KEY (personId) REFERENCES Persons(id)
    );
    `
), function (error, results, fields) {
    if (error) throw error;
}

db.pool.query(
    `
    CREATE TABLE IF NOT EXISTS Persons (
    id Int NOT NULL AUTO_INCREMENT,
    createAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    editedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
    );
    `
), function (error, results, fields) {
    if (error) throw error;
}

//Spotify

db.pool.query(
    `
    CREATE TABLE IF NOT EXISTS SpotifyTokens (
    id Int NOT NULL AUTO_INCREMENT,
    token varchar(255) NOT NULL,
    expiresAt varchar(255) NOT NULL,
    createAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    editedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
    );
    `
), function (error, results, fields) {
    if (error) throw error;
}


//Music Story

db.pool.query(
    `
    CREATE TABLE IF NOT EXISTS MusicStoryTokens (
    id Int NOT NULL AUTO_INCREMENT,
    token varchar(255) NOT NULL,
    token_secret varchar(255) NOT NULL,
    createAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    editedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
    );
    `
), function (error, results, fields) {
    if (error) throw error;
}



// db.pool.query(
//     `
//     INSERT INTO PersonNameTypes 
//     VALUES (
        
//     )
//     `
// ), (error, results, fields) => {
//     if (error) throw error;
// }

// connection.query(
// `
// CREATE TABLE IF NOT EXISTS Acts (
// ActID Int NOT NULL AUTO_INCREMENT,
// ActName varchar(255),
// CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
// PRIMARY KEY (ActID)
// );
// `
// )  , function (error, results, fields) {
//   if (error) throw error;
// };

// connection.query(
// `
// CREATE TABLE IF NOT EXISTS Clearances (
// ClearanceID Int NOT NULL AUTO_INCREMENT,
// ClearanceName varchar(255),
// CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
// PRIMARY KEY (ClearanceID)
// );
// `
// )  , function (error, results, fields) {
//   if (error) throw error;
// };

// connection.query(
// `
// CREATE TABLE IF NOT EXISTS Memberships (
// MembershipID Int NOT NULL AUTO_INCREMENT,
// PersonID Int NOT NULL,
// ActID Int NOT NULL,
// ClearanceID Int NOT NULL,
// CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
// PRIMARY KEY (MembershipID),
// FOREIGN KEY (PersonID) REFERENCES Persons(PersonID),
// FOREIGN KEY (ActID) REFERENCES Acts(ActID),
// FOREIGN KEY (ClearanceID) REFERENCES Clearances(ClearanceID)
// );
// `
// )  , function (error, results, fields) {
//   if (error) throw error;
// };

// connection.query(
// `
// CREATE TABLE IF NOT EXISTS BandContactInfo (
// ID int NOT NULL AUTO_INCREMENT,
// CityName varchar(255),
// StateOrProvince varChar(255),
// PhoneNumber varChar(255),
// EmailAddress varChar(255),
// PRIMARY KEY (ID)
// );
// `
// )  , function (error, results, fields) {
//   if (error) throw error;
// };
