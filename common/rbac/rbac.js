const RBAC = require('easy-rbac');
const permissions = require('./policy/policy');

const rbac = RBAC.create(permissions)

module.exports = rbac;