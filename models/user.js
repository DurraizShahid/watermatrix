const { v4: uuidv4 } = require('uuid');
const client = require('../config/db');
const bcrypt = require('bcrypt');

class User {
  static async create({ FullName, PhoneNo, City, Password, Email, Country }) {
    const hashedPassword = await bcrypt.hash(Password, 10);
    const userId = uuidv4(); // Generate a new UUID
    const result = await client.query(
      'INSERT INTO "User" ("UserId", "FullName", "PhoneNo", "City", "Password", "Email", "Country") VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [userId, FullName, PhoneNo, City, hashedPassword, Email, Country]
    );
    return result.rows[0];
  }

  static async findByPhoneNo(PhoneNo) {
    const result = await client.query(
      'SELECT * FROM "User" WHERE "PhoneNo" = $1',
      [PhoneNo]
    );
    return result.rows[0];
  }

  static async delete(id) {
    await client.query('DELETE FROM "User" WHERE "UserId" = $1', [id]);
    return { message: 'User deleted successfully' };
  }
}

module.exports = User;
