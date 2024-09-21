const client = require('../config/db');

const { v4: uuidv4 } = require('uuid'); // Make sure this is included

const express = require('express');
const Property = require('./models/property'); // Adjust the path as needed
const app = express();
const port = 3000;

app.use(express.json());

// Route to get all properties
app.get('/properties', async (req, res) => {
  try {
    const properties = await Property.getAll();
    res.status(200).json(properties);
  } catch (error) {
    console.error('Error fetching properties:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});


class Property {
  static async create({ Title, City, Price, Type, Description, Image, Zipcode, Longitude, Latitude, User_Id }) {
    const parsedLongitude = parseFloat(Longitude);
    const parsedLatitude = parseFloat(Latitude);
    const PropertyId = uuidv4(); // Generate a new UUID for the property

    const result = await client.query(
      `INSERT INTO "Property" (
        "PropertyId", "Title", "City", "Price", "Type", "Description", "Image", "ZipCode", "Geometry", "UserId"
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, point($9, $10), $11)
      RETURNING *`,
      [PropertyId, Title, City, Price, Type, Description, Image, Zipcode, parsedLongitude, parsedLatitude, User_Id]
    );

    return result.rows[0];
  }

  static async getAll() {
    const result = await client.query('SELECT * FROM "Property"');
    return result.rows;
  }
}

module.exports = Property;

const properties = [
  {
      Title: "Luxury Apartment",
      City: "Dubai",
      Price: "150000 AED",
      Type: "Luxury",
      Description: "A luxury apartment in the heart of Dubai.",
      Image: "luxury-apartment.jpg",
      Zipcode: "12345",
      Longitude: "74.3436",
      Latitude: "31.4875",
      User_Id: uuidv4() // Dummy user ID
  },
  {
      Title: "Affordable Studio",
      City: "Dubai",
      Price: "50000 AED",
      Type: "Affordable",
      Description: "A small studio apartment suitable for singles.",
      Image: "affordable-studio.jpg",
      Zipcode: "12346",
      Longitude: "55.2808",
      Latitude: "25.2148",
      User_Id: uuidv4() // Dummy user ID
  },
  {
      Title: "Family Home",
      City: "Dubai",
      Price: "250000 AED",
      Type: "Family",
      Description: "A spacious home perfect for families.",
      Image: "family-home.jpg",
      Zipcode: "12347",
      Longitude: "55.2908",
      Latitude: "25.2248",
      User_Id: uuidv4() // Dummy user ID
  }
];

// Insert dummy data
try {
  for (const property of properties) {
      await Property.create(property);
  }
  console.log("Dummy data added successfully!");
} catch (error) {
  console.error("Error adding dummy data:", error);
} finally {
  // Close the database connection
  await client.end();
}

// Run the seed script
seedData();