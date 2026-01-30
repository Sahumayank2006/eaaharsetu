import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase/firebase';
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const managerId = searchParams.get('managerId') || 'warehouse-manager-001';
    
    const docRef = doc(db, 'warehouse-manager-settings', managerId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      return NextResponse.json({
        success: true,
        data: {
          ...data,
          id: docSnap.id,
        }
      });
    } else {
      // Return default settings if none exist
      const defaultSettings = {
        emailNotifications: true,
        smsNotifications: true,
        slotAlerts: true,
        temperatureAlerts: true,
        humidityAlerts: true,
        inventoryAlerts: true,
      };
      
      return NextResponse.json({
        success: true,
        data: defaultSettings
      });
    }
  } catch (error) {
    console.error('Error fetching notification settings:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch notification settings'
    }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { managerId, settings } = data;
    
    if (!managerId) {
      return NextResponse.json({
        success: false,
        error: 'Manager ID is required'
      }, { status: 400 });
    }

    const docRef = doc(db, 'warehouse-manager-settings', managerId);
    const settingsWithTimestamp = {
      ...settings,
      updatedAt: serverTimestamp(),
    };

    await setDoc(docRef, settingsWithTimestamp, { merge: true });

    return NextResponse.json({
      success: true,
      message: 'Notification settings updated successfully',
      data: settings
    });
  } catch (error) {
    console.error('Error updating notification settings:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to update notification settings'
    }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const data = await request.json();
    const { managerId, setting, value } = data;
    
    if (!managerId || !setting) {
      return NextResponse.json({
        success: false,
        error: 'Manager ID and setting name are required'
      }, { status: 400 });
    }

    const docRef = doc(db, 'warehouse-manager-settings', managerId);
    
    const updateData = {
      [setting]: value,
      updatedAt: serverTimestamp(),
    };

    await updateDoc(docRef, updateData);

    return NextResponse.json({
      success: true,
      message: `${setting} updated successfully`,
      data: { [setting]: value }
    });
  } catch (error) {
    console.error('Error updating individual setting:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to update setting'
    }, { status: 500 });
  }
}