// Select the database
use('firstflight');

// Clear existing collections to start fresh
db.users.drop();
db.locations.drop();
db.bookings.drop();

// Create Users Collection with validation
db.createCollection('users', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['fullname', 'email', 'password'],
      properties: {
        fullname: { bsonType: 'string' },
        email: { bsonType: 'string' },
        password: { bsonType: 'string' },
        createdAt: { bsonType: 'date' }
      }
    }
  }
});

// Create Locations Collection
db.createCollection('locations');
db.locations.insertMany([
  {
    name: 'Bali',
    description: 'Beautiful beaches and cultural heritage',
    price: 1200,
    image: '/files/bali.jpg',
    available: true
  },
  {
    name: 'Paris',
    description: 'City of lights and romance',
    price: 1500,
    image: '/files/paris.jpg',
    available: true
  },
  {
    name: 'Dubai',
    description: 'Modern city with luxury shopping',
    price: 1800,
    image: '/files/dubai.jpg',
    available: true
  }
]);

// Create indexes
db.users.createIndex({ "email": 1 }, { unique: true });
db.locations.createIndex({ "name": 1 });
db.bookings.createIndex({ "userId": 1 });

// Verify data
print('Available Locations:');
printjson(db.locations.find().toArray());
print('\nCollection Stats:');
printjson(db.stats());