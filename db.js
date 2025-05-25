const oracledb = require('oracledb');
const bcrypt = require('bcrypt');

// Oracle DB config (replace with your actual credentials)
const dbConfig = {
  user: 'your_db_user',
  password: 'your_db_password',
  connectString: 'localhost/orclpdb1' // Update based on your Oracle setup
};

// Insert user function with hashed password
async function insertUser(user) {
  const { fullname, email, phone, birthdate, gender, username, password } = user;
  const hashedPassword = await bcrypt.hash(password, 10); // Hash the password

  const query = `
    INSERT INTO users (fullname, email, phone, birthdate, gender, username, password)
    VALUES (:fullname, :email, :phone, TO_DATE(:birthdate, 'YYYY-MM-DD'), :gender, :username, :password)
  `;

  const binds = {
    fullname,
    email,
    phone,
    birthdate,
    gender,
    username,
    password: hashedPassword
  };

  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);
    await connection.execute(query, binds, { autoCommit: true });
  } catch (error) {
    console.error('Insert user error:', error);
    throw error;
  } finally {
    if (connection) await connection.close();
  }
}

// Validate user login
async function validateUser(username, password) {
  const query = `SELECT password FROM users WHERE username = :username`;

  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);
    const result = await connection.execute(query, { username }, { outFormat: oracledb.OUT_FORMAT_OBJECT });

    if (result.rows.length === 0) return false;

    const storedHashedPassword = result.rows[0].PASSWORD;
    const isMatch = await bcrypt.compare(password, storedHashedPassword);
    return isMatch;
  } catch (error) {
    console.error('Validate user error:', error);
    throw error;
  } finally {
    if (connection) await connection.close();
  }
}

module.exports = { insertUser, validateUser };
