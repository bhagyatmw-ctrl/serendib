import { NextResponse } from "next/server";
export async function GET(){
 try{
  const response=await fetch("https://open.er-api.com/v6/latest/USD",{next:{revalidate:3600}});
  if(!response.ok)throw new Error();
  const data=await response.json();
  return NextResponse.json({updated:data.time_last_update_utc,rates:data.rates},{headers:{"Cache-Control":"public, s-maxage=3600, stale-while-revalidate=7200"}});
 }catch{return NextResponse.json({error:"Rates temporarily unavailable"},{status:503})}
}
