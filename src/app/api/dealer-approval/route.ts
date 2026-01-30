
import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase/firebase';
import { collection, getDocs, doc, updateDoc, query, orderBy, where } from 'firebase/firestore';

// GET all dealer registrations
export async function GET() {
  try {
    const q = query(collection(db, 'dealer-registrations'), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    const dealers = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    return NextResponse.json({ success: true, dealers });
  } catch (error) {
    console.error('Error fetching dealer registrations:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch dealer registrations' }, { status: 500 });
  }
}

// PUT to update a dealer's status
export async function PUT(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const { status } = await request.json();

    if (!id) {
      return NextResponse.json({ success: false, error: 'Dealer ID is required' }, { status: 400 });
    }
    if (!['approved', 'rejected'].includes(status)) {
      return NextResponse.json({ success: false, error: 'Invalid status' }, { status: 400 });
    }

    const dealerRef = doc(db, 'dealer-registrations', id);
    await updateDoc(dealerRef, { status: status });

    return NextResponse.json({ success: true, message: `Dealer status updated to ${status}` });
  } catch (error) {
    console.error('Error updating dealer status:', error);
    return NextResponse.json({ success: false, error: 'Failed to update dealer status' }, { status: 500 });
  }
}
