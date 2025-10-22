
import { NextResponse } from 'next/server';
import pool from '../../../../lib/db';

export async function PUT(request: Request, context: any) {
  try {
    const { level } = await request.json();
    const params = await context.params;
    const id = params.id;
    const client = await pool.connect();
    const result = await client.query('UPDATE skills SET level = $1 WHERE id = $2 RETURNING *', [level, id]);
    client.release();
    return NextResponse.json(result.rows[0]);
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(request: Request, context: any) {
  try {
    const params = await context.params;
    const id = params.id;
    const client = await pool.connect();
    await client.query('DELETE FROM skills WHERE id = $1', [id]);
    client.release();
    return new Response(null, { status: 204 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
