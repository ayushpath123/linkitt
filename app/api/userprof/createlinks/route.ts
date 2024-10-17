import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest) {
    const {reflink,collectionId}=await req.json()
    const res=await prisma.link.create({
        data:{
            reflink,
            collectionId
        },
        select:{
            reflink:true,
            id:true
        }
    })
if(res){
    return NextResponse.json({
        res
    },{
       status:201
    })
}
return NextResponse.json({
    msg:"Some  Error Occured"
},{
    status:403
})
}