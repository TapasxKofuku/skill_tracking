
import { NextResponse } from 'next/server';
import pool from '../../../lib/db';

export async function GET() {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT * FROM skills');
    client.release();
    return NextResponse.json(result.rows);
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { name, level } = await request.json();
    const client = await pool.connect();
    const result = await client.query('INSERT INTO skills (name, level) VALUES ($1, $2) RETURNING *', [name, level]);
    client.release();
    console.log('POST result.rows[0]:', result.rows[0]); // Add this log
    return NextResponse.json(result.rows[0]);
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
