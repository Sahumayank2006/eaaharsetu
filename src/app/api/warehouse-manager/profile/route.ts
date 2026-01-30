import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase/firebase';
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const managerId = searchParams.get('managerId') || 'warehouse-manager-001';
    
    const docRef = doc(db, 'warehouse-managers', managerId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      return NextResponse.json({
        success: true,
        data: {
          ...data,
          id: docSnap.id,
          lastUpdated: data.updatedAt?.toDate()?.toISOString() || null,
        }
      });
    } else {
      return NextResponse.json({
        success: true,
        data: null,
        message: 'Profile not found'
      });
    }
  } catch (error) {
    console.error('Error fetching warehouse manager profile:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch profile data'
    }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { managerId, ...profileData } = data;
    
    if (!managerId) {
      return NextResponse.json({
        success: false,
        error: 'Manager ID is required'
      }, { status: 400 });
    }

    // Validate required fields
    const requiredFields = ['fullName', 'email', 'mobileNumber', 'employeeId', 'warehouseId'];
    const missingFields = requiredFields.filter(field => !profileData[field]);
    
    if (missingFields.length > 0) {
      return NextResponse.json({
        success: false,
        error: `Missing required fields: ${missingFields.join(', ')}`
      }, { status: 400 });
    }

    const docRef = doc(db, 'warehouse-managers', managerId);
    const profileWithTimestamp = {
      ...profileData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      lastLogin: serverTimestamp(),
    };

    await setDoc(docRef, profileWithTimestamp, { merge: true });

    return NextResponse.json({
      success: true,
      message: 'Profile created/updated successfully',
      data: {
        id: managerId,
        ...profileData
      }
    });
  } catch (error) {
    console.error('Error saving warehouse manager profile:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to save profile data'
    }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const data = await request.json();
    const { managerId, ...updates } = data;
    
    if (!managerId) {
      return NextResponse.json({
        success: false,
        error: 'Manager ID is required'
      }, { status: 400 });
    }

    const docRef = doc(db, 'warehouse-managers', managerId);
    
    // Check if document exists
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
      return NextResponse.json({
        success: false,
        error: 'Profile not found'
      }, { status: 404 });
    }

    const updatesWithTimestamp = {
      ...updates,
      updatedAt: serverTimestamp(),
    };

    await updateDoc(docRef, updatesWithTimestamp);

    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        id: managerId,
        ...updates
      }
    });
  } catch (error) {
    console.error('Error updating warehouse manager profile:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to update profile data'
    }, { status: 500 });
  }
}