import mongoose from 'mongoose';
import FRAClaim from '../../../models/FRAClaim'; // Adjust path to your model

export async function GET(request) {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    
    const { searchParams } = new URL(request.url);
    const state = searchParams.get('state') || 'Show_All';
    const limit = parseInt(searchParams.get('limit')) || 500;
    
    const query = state === 'Show_All' 
      ? {} 
      : { state: state };
    
    const claims = await FRAClaim.find(query)
      .select('claimant_name village district state claim_status total_land_claimed latitude longitude application_date family_members.length')
      .limit(limit)
      .lean();
    
    return Response.json(claims);
  } catch (error) {
    console.error('Error fetching FRA claims:', error);
    return Response.json({ error: 'Failed to fetch claims' }, { status: 500 });
  }
}
