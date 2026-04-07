import type {
  Supplier,
  Order,
  OrderItem,
  Invoice,
  Document,
  User,
  SupplierStatus,
  OrderStatus,
  InvoiceStatus,
  DocumentType,
  Role,
} from "@prisma/client";

export type { SupplierStatus, OrderStatus, InvoiceStatus, DocumentType, Role };

export type SupplierWithRelations = Supplier & {
  users: User[];
  orders: Order[];
  invoices: Invoice[];
  documents: Document[];
};

export type OrderWithItems = Order & {
  items: OrderItem[];
  supplier: Supplier;
  invoices: Invoice[];
};

export type InvoiceWithOrder = Invoice & {
  order: OrderWithItems;
  supplier: Supplier;
};

export type DocumentWithSupplier = Document & {
  supplier: Supplier;
};
