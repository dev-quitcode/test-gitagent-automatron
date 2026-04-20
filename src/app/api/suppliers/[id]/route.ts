import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth-utils'

const updateSupplierSchema = z.object({
  companyName: z.string().min(1, 'Company name is required').optional(),
  contactEmail: z.string().email('Enter a valid email address').optional(),
  contactPhone: z.string().min(1, 'Contact phone is required').optional(),
  address: z.string().min(1, 'Address is required').optional(),
})

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
): Promise<Response> {
  const user = await getCurrentUser()

  if (!user) {
    return new Response(JSON.stringify({ error: 'Unauthorized.' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const { id } = await params

  if (user.role !== 'ADMIN' && user.supplierId !== id) {
    return new Response(JSON.stringify({ error: 'Forbidden.' }), {
      status: 403,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const supplier = await prisma.supplier.findUnique({
    where: { id },
    include: {
      users: true,
      orders: true,
      invoices: true,
      documents: true,
    },
  })

  if (!supplier) {
    return new Response(JSON.stringify({ error: 'Supplier not found.' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  return new Response(JSON.stringify(supplier), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  })
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
): Promise<Response> {
  const user = await getCurrentUser()

  if (!user) {
    return new Response(JSON.stringify({ error: 'Unauthorized.' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const { id } = await params

  if (user.role !== 'ADMIN' && user.supplierId !== id) {
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

  const parsed = updateSupplierSchema.safeParse(body)
  if (!parsed.success) {
    const message = parsed.error.issues[0]?.message ?? 'Invalid request.'
    return new Response(JSON.stringify({ error: message }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const existing = await prisma.supplier.findUnique({ where: { id } })
  if (!existing) {
    return new Response(JSON.stringify({ error: 'Supplier not found.' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const supplier = await prisma.supplier.update({
    where: { id },
    data: parsed.data,
  })

  return new Response(JSON.stringify(supplier), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  })
}
