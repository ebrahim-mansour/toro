const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const operatorsAliases = {
  $eq: Op.eq,
  $ne: Op.ne,
  $gte: Op.gte,
  $gt: Op.gt,
  $lte: Op.lte,
  $lt: Op.lt,
  $not: Op.not,
  $in: Op.in,
  $notIn: Op.notIn,
  $is: Op.is,
  $like: Op.like,
  $notLike: Op.notLike,
  $iLike: Op.iLike,
  $notILike: Op.notILike,
  $regexp: Op.regexp,
  $notRegexp: Op.notRegexp,
  $iRegexp: Op.iRegexp,
  $notIRegexp: Op.notIRegexp,
  $between: Op.between,
  $notBetween: Op.notBetween,
  $overlap: Op.overlap,
  $contains: Op.contains,
  $contained: Op.contained,
  $adjacent: Op.adjacent,
  $strictLeft: Op.strictLeft,
  $strictRight: Op.strictRight,
  $noExtendRight: Op.noExtendRight,
  $noExtendLeft: Op.noExtendLeft,
  $and: Op.and,
  $or: Op.or,
  $any: Op.any,
  $all: Op.all,
  $values: Op.values,
  $col: Op.col
};

let config = module.exports;

config.db = {
  user: 'root', 
  password: '',
  name: 'rats_gym'
};
config.db.details = {
  host: 'localhost',
  dialect: 'mysql',
  define: {
    timestamps: false
  },
  operatorsAliases
};

// config.db = {
//   user: 'toro',
//   password: 'torotoro',
//   name: 'toro'
// };
// config.db.details = {
//   host: 'tor.cnhabkvxjgoz.us-east-2.rds.amazonaws.com',
//   port: 3306,
//   dialect: 'mysql',
//   define: {
//     timestamps: false
//   },
//   operatorsAliases
// };
