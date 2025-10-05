import {NextRequest, NextResponse} from "next/server"
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma"


const ITEMS_PER_PAGE = 10;

//fetch all tasks 
export async function GET(req: NextRequest){
    try {
        const {userId} = await auth();

        if(!userId){
            return NextResponse.json({error: "Unauthorized user"}, {status: 401})
        }

        const {searchParams} = new URL(req.url);
        const page = parseInt(searchParams.get("page") || "1", 10)
        const search = searchParams.get("search") || "";
        const filter = searchParams.get("filter") || "all";

        const whereCluase: any = {
            userId,
            title: {
                contains: search, 
                mode: "insensitive",
            }
        }

        if(filter === "completed") whereCluase.completed = true;
        else if (filter === "pending") whereCluase.completed = false;

        const tasks = await prisma.task.findMany({
            where: whereCluase,
            orderBy: {createdAt: "desc"},
            take: ITEMS_PER_PAGE,
            skip: (page - 1) * ITEMS_PER_PAGE,
        })

        const totalItems = await prisma.task.count({where: whereCluase})
        const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

        return NextResponse.json(
            {
                tasks,
                currentPage: page,
                totalPages,
            },
            {status: 200}
        )
    } catch (error) {
        console.error("Error fetching tasks: ", error);
        return NextResponse.json(
            {error: "Internal Server Error"},
            {status: 500}
        )
    }
}


export async function POST(req: NextRequest){
    try {
        const {userId} = await auth();

        if(!userId){
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: {id: userId},
            include: {tasks: true}
        });

        if(!user){
            return NextResponse.json({error: "User not found"},{status: 404})
        }

        if(user.plan === "FREE" && user.tasks.length >= 7){
            return NextResponse.json(
                {
                    error: "Free plan users can only create up to 7 tasks. Please for more users."
                },
                {status: 403}
            )
        }

        const { title, description, dueDate } = await req.json();

        if(!title || title.trim() === ""){
            return NextResponse.json(
                {error: "Title is required"},
                {status: 400}
            )
        }

        const task = await prisma.task.create({
            data: {
                title, 
                description: description || null, 
                dueDate: dueDate ? new Date(dueDate) : null, 
                userId
            }
        })

        return NextResponse.json(task, {status: 201})
    
    } catch (error) {
        console.error("Error creating task: ", error);
        return NextResponse.json(
            {error: "Internal Server Error"},
            {status: 500}
        )
    }
}