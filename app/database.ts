import { createTable } from 'expo-sqlite-query-helper';

export const createBookingsTable = () => {
  createTable('bookings', {
    id: 'INTEGER PRIMARY KEY AUTOINCREMENT',
    origin: 'TEXT',
    type: 'TEXT',
    timestamp: 'TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP',
    address: 'TEXT',
    data: 'TEXT',
    encrypted: 'TEXT DEFAULT "false" NOT NULL',
    synced: 'TEXT DEFAULT "false" NOT NULL',
  }).then(({ rowAffected, lastQuery }) =>
    console.log('createBookingsTable success', rowAffected, lastQuery)
  );
};
