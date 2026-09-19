const db = require('./db');
const bcrypt = require('bcryptjs');

async function updatePassword() {
    try {
        const hash = bcrypt.hashSync('project@2026', 10);
        await db.query('UPDATE admins SET password_hash = ? WHERE username = ?', [hash, 'admin']);
        console.log('Password updated successfully!');
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}
updatePassword();
