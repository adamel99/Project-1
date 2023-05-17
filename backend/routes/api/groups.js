// const router = require("express").Router();
// const express = require('express');



// const authorizationMiddleware = (requiredRoles, requiredPermissions) => {
//     return (req, res, next) => {
//       const userRoles = req.user.roles;
//       const userPermissions = req.user.permissions;
//       const hasRequiredRole = requiredRoles.some((role) => userRoles.includes(role));
//       const hasRequiredPermission = requiredPermissions.some((permission) =>
//         userPermissions.includes(permission)
//       );
//       if (!hasRequiredRole && !hasRequiredPermission) {
//         return res.status(403).json({ message: 'Forbidden' });
//       }
//       next();
//     };
//   };

// router.get('/protected', authenticationMiddleware, authorizationMiddleware(['admin'], ['manageEvents']), (req, res) => {
//   res.json({ message: 'Protected endpoint' });
// });

// module.exports = router;
