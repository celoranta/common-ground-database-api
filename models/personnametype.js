'use strict';
module.exports = (sequelize, DataTypes) => {
  const PersonNameType = sequelize.define('PersonNameType', {
    nameType: DataTypes.STRING
  }, {});
  PersonNameType.associate = function(models) {
    // associations can be defined here
    PersonNameType.belongsTo(models.PersonName, {
      foreignKey : 'id',
      sourceKey: 'personNameId'
  });
  };
  return PersonNameType;
};