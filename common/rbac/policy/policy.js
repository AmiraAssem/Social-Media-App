const roles = require("../../enum/roles");
const adminPolicy = require("./adminPolicy");
const userPolicy = require("./userPolicy");
const superAdminPolicy = require("./superAdminPolicy");


const permissions = {
    [roles.ADMIN]: adminPolicy,
    [roles.USER]: userPolicy,
    [roles.SUPER_ADMIN]: superAdminPolicy
}

module.exports = permissions;