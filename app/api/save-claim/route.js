import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import FRAClaim from '@/models/FRAClaim';

export async function POST(request) {
  try {
    await connectDB();
    
    const claimData = await request.json();
    
    // Create new FRA claim document
    const newClaim = new FRAClaim({
      ...claimData,
      processing_date: new Date(),
      processed_by: 'District Officer'
    });
    
    // Save to MongoDB
    const savedClaim = await newClaim.save();
    
    // Return success response with the saved claim data
    return NextResponse.json(
      { 
        success: true, 
        message: 'FRA claimant data added in database and plotted successfully',
        claimId: savedClaim._id,
        data: savedClaim
      },
      { status: 201 }
    );
    
  } catch (error) {
    console.error('Error saving FRA claim:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to save FRA claim data',
        error: error.message 
      },
      { status: 500 }
    );
  }
}

// GET method to retrieve claims (optional for future use)
export async function GET(request) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit')) || 10000; // Increased default limit to show all data
    const offset = parseInt(searchParams.get('offset')) || 0;
    
    const claims = await FRAClaim.find({})
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(offset);
    
    const total = await FRAClaim.countDocuments();
    
    return NextResponse.json({
      success: true,
      data: claims,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total
      }
    });
    
  } catch (error) {
    console.error('Error fetching FRA claims:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to fetch FRA claims',
        error: error.message 
      },
      { status: 500 }
    );
  }
}