'use strict';
module.exports = (sequelize, DataTypes) => {
  const PersonName = sequelize.define('PersonName', {
    personName: DataTypes.STRING
  }, {});
  PersonName.associate = function(models) {
    // associations can be defined here
  //   PersonName.hasMany(models.PersonNameType, {
  //     foreignKey : 'id',
  //     sourceKey: 'personNameTypeId'
  // });
  };
  return PersonName;
};