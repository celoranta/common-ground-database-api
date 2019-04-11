// const config = require('config.json');
// const jwt = require('jsonwebtoken');
// const Role = require('modules/helpers/role.js');
// //const db = require('modules/pool.js');


// // users hardcoded for simplicity, store in a db for production applications
// const users =
// [
//     { id: 1, username: 'chriseloranta@gmail.com', password: 'heyya', firstName: 'Admin', lastName: 'User', role: Role.Admin },
//     { id: 2, username: 'user', password: 'user', firstName: 'Normal', lastName: 'User', role: Role.User }
// ];

// module.exports = {
//     authenticate,
//     getAll,
//     getById
// };

// async function authenticate({ username, password }) {
//     const user = users.find(u => u.username === username && u.password === password);
//     if (user) {
//         const token = jwt.sign({ sub: user.id, role: user.role }, config.secret);
//         const { password, ...userWithoutPassword } = user;
//         return {
//             ...userWithoutPassword,
//             token
//         };
//     }
// }

// async function getAll() {
//     return users.map(u => {
//         const { password, ...userWithoutPassword } = u;
//         return userWithoutPassword;
//     });
// }

// async function getById(id) {
//     const user = users.find(u => u.id === parseInt(id));
//     if (!user) return;
//     const { password, ...userWithoutPassword } = user;
//     return userWithoutPassword;
// }