import { z } from 'zod'
import { SupplierStatus } from '@prisma/client'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth-utils'

const createSupplierSchema = z.object({
  companyName: z.string().min(1, 'Company name is required'),
  contactEmail: z.string().min(1, 'Contact email is required').email('Enter a valid email address'),
  contactPhone: z.string().min(1, 'Contact phone is required'),
  address: z.string().min(1, 'Address is required'),
})

export async function GET(request: Request): Promise<Response> {
  const user = await getCurrentUser()

  if (!user) {
    return new Response(JSON.stringify({ error: 'Unauthorized.' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  if (user.role !== 'ADMIN') {
    return new Response(JSON.stringify({ error: 'Forbidden.' }), {
      status: 403,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const { searchParams } = new URL(request.url)
  const statusParam = searchParams.get('status')

  const validStatuses = Object.values(SupplierStatus)
  const where =
    statusParam && validStatuses.includes(statusParam as SupplierStatus)
      ? { status: statusParam as SupplierStatus }
      : {}

  const suppliers = await prisma.supplier.findMany({
    where,
    include: {
      _count: { select: { users: true } },
    },
    orderBy: { createdAt: 'desc' },
  })

  return new Response(JSON.stringify(suppliers), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  })
}

export async function POST(request: Request): Promise<Response> {
  const user = await getCurrentUser()

  if (!user) {
    return new Response(JSON.stringify({ error: 'Unauthorized.' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  if (user.role !== 'ADMIN') {
    return new Response(JSON.stringify({ error: 'Forbidden.' }), {
      status: 403,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid request body.' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const parsed = createSupplierSchema.safeParse(body)
  if (!parsed.success) {
    const message = parsed.error.issues[0]?.message ?? 'Invalid request.'
    return new Response(JSON.stringify({ error: message }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const { companyName, contactEmail, contactPhone, address } = parsed.data

  const supplier = await prisma.supplier.create({
    data: {
      companyName,
      contactEmail,
      contactPhone,
      address,
      status: SupplierStatus.PENDING,
    },
  })

  return new Response(JSON.stringify(supplier), {
    status: 201,
    headers: { 'Content-Type': 'application/json' },
  })
}
