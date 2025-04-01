import fs from 'node:fs';
import path from 'node:path';

const dbPath = path.resolve('db.json');

export const readDB = async () => {
    try {
        const data = await fs.promises.readFile(dbPath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading database:', error);
        throw error;
    }
};


export const writeDB = async (data) => {
    try {
        await fs.promises.writeFile(dbPath, JSON.stringify(data, null, 2), 'utf8');
    } catch (error) {
        console.error('Error writing database:', error);
        throw error;
    }
};

