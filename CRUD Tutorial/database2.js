import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

// Setup the database and seed initial data if it doesn't already exist
export const setupDatabase = async () => {
    const db = await open({
        filename: './public/database/meetings.db',
        driver: sqlite3.Database
    });


    await db.exec(`
        CREATE TABLE IF NOT EXISTS meetings (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            topic TEXT,
            mandatory BOOLEAN,
            dateTime TEXT,
            location TEXT,
            parking TEXT
        )
    `);

    // Check if data already exists before inserting
    const result = await db.get(`SELECT COUNT(*) AS count FROM meetings`);
    if (result.count === 0) {
        await db.run(`
            INSERT INTO meetings (topic, mandatory, dateTime, location, parking)
            VALUES
            ('CIT Monthly Meeting', 1, 'September 24th 2024, 1pm-5pm', 'KNOY Hall West Lafayette', 'Park in Street Garage, 3rd floor. Venue opposite front entrance.'),
            ('Research in Higher Level Ed', 0, 'October 5th 2024, 10am-12pm', 'Beresford Hall West Lafayette', 'Park in surface lot 300. Venue beside lot.'),
            ('Curriculum Planning', 1, 'October 19th 2024, 4pm-6pm', 'IO240, Indianapolis', 'Park in North Street Garage, Michigan St. Venue opposite side of street, 300km North.')
        `);
        console.log('Database populated with initial data.');
    } else {
        console.log('Data already exists, skipping seeding.');
    }

    console.log('Database setup complete.');
};

// Populate the database (additional function if needed to reseed)
export const populateDB = async () => {
    const db = await open({
        filename: './public/database/meetings.db',
        driver: sqlite3.Database
    });

    // Add logic to prevent duplicate data if necessary
    await db.run(`
        INSERT INTO meetings (topic, mandatory, dateTime, location, parking)
        VALUES
        ('CIT Monthly Meeting', 1, 'September 24th 2024, 1pm-5pm', 'KNOY Hall West Lafayette', 'Park in Street Garage, 3rd floor. Venue opposite front entrance.'),
        ('Research in Higher Level Ed', 0, 'October 5th 2024, 10am-12pm', 'Beresford Hall West Lafayette', 'Park in surface lot 300. Venue beside lot.'),
        ('Curriculum Planning', 1, 'October 19th 2024, 4pm-6pm', 'IO240, Indianapolis', 'Park in North Street Garage, Michigan St. Venue opposite side of street, 300km North.')
    `);

    console.log('Database populated with seed data.');
};

// Reusable function to get the database connection
export const getDBConnection = () => {
    return open({
        filename: './public/database/meetings.db',
        driver: sqlite3.Database
    });
};