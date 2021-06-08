import { createTable } from 'expo-sqlite-query-helper';

export const createBookingsTable = () => {
  createTable('bookings', {
    id: 'INTEGER PRIMARY KEY AUTOINCREMENT',
    origin: 'TEXT',
    type: 'TEXT',
    timestamp: 'TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP',
    data: 'TEXT',
    encrypted: 'TEXT DEFAULT "false" NOT NULL',
    synced: 'TEXT DEFAULT "false" NOT NULL',
  }).then(({ row, rowAffected, insertID, lastQuery }) =>
    console.log('success', row, rowAffected, insertID, lastQuery)
  );
};
