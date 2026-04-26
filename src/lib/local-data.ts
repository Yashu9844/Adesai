"use client";

import { Capacitor } from "@capacitor/core";

type DbTool = {
  id: string;
  name: string;
  totalQuantity: number;
  availableQuantity: number;
  dailyPrice: number;
  imageUrl: string | null;
  createdAt: string;
  updatedAt: string;
  toolItems?: DbToolItem[];
};

type DbToolItem = {
  id: string;
  toolId: string;
  itemNumber: string;
  status: "AVAILABLE" | "RENTED";
  createdAt: string;
  updatedAt: string;
};

type DbCustomer = {
  id: string;
  name: string;
  mobile: string;
  village: string;
  photoUrl: string | null;
  createdAt: string;
  updatedAt: string;
};

type DbRental = {
  id: string;
  customerId: string;
  startDate: string;
  expectedDays: number;
  status: "ACTIVE" | "RETURNED" | "OVERDUE";
  advanceAmount: number;
  totalAmount: number | null;
  returnedAt: string | null;
  createdAt: string;
  updatedAt: string;
  customer?: DbCustomer;
  rentalItems?: DbRentalItem[];
  payments?: DbPayment[];
};

type DbRentalItem = {
  id: string;
  rentalId: string;
  toolId: string;
  quantity: number;
  dailyPriceSnapshot: number;
  returnedQuantity: number;
  createdAt: string;
  updatedAt: string;
  tool?: DbTool;
  details?: DbRentalItemDetail[];
};

type DbRentalItemDetail = {
  id: string;
  rentalItemId: string;
  toolItemId: string;
  status: "AVAILABLE" | "RENTED";
  createdAt: string;
  updatedAt: string;
  toolItem?: DbToolItem;
};

type DbPayment = {
  id: string;
  rentalId: string;
  amount: number;
  type: "ADVANCE" | "FINAL_SETTLEMENT" | "LATE_FEE";
  paymentMethod: "CASH" | "UPI" | "CARD";
  createdAt: string;
};

type CreateRentalParams = {
  customer: {
    name: string;
    mobile: string;
    village: string;
    photoUrl?: string;
  };
  items: {
    toolId: string;
    quantity: number;
    dailyPriceSnapshot: number;
    itemNumbers?: string[];
  }[];
  expectedDays: number;
  advanceAmount: number;
  startDate?: Date;
};

type LocalSnapshot = {
  tools: DbTool[];
  toolItems: DbToolItem[];
  customers: DbCustomer[];
  rentals: DbRental[];
  rentalItems: DbRentalItem[];
  rentalItemDetails: DbRentalItemDetail[];
  payments: DbPayment[];
  activityLogs: { id: string; action: string; description: string; userId: string | null; createdAt: string }[];
};

type LocalResult<T = any> = Promise<{ success: boolean; data?: T; summary?: any; error?: string }>;

const LOCAL_KEY = "srisaibaba-tool-rental-local-db-v1";
const SQLITE_DB = "srisaibaba_local";
const SQLITE_KEY = "snapshot";

let sqliteDbPromise: Promise<any | null> | null = null;

const emptySnapshot = (): LocalSnapshot => ({
  tools: [],
  toolItems: [],
  customers: [],
  rentals: [],
  rentalItems: [],
  rentalItemDetails: [],
  payments: [],
  activityLogs: [],
});

const now = () => new Date().toISOString();
const id = () => crypto.randomUUID();

async function getNativeDb() {
  if (!Capacitor.isNativePlatform()) return null;

  sqliteDbPromise ??= (async () => {
    const { CapacitorSQLite, SQLiteConnection } = await import("@capacitor-community/sqlite");
    const sqlite = new SQLiteConnection(CapacitorSQLite);
    await sqlite.checkConnectionsConsistency().catch(() => undefined);

    const hasConnection = await sqlite.isConnection(SQLITE_DB, false);
    const db = hasConnection.result
      ? await sqlite.retrieveConnection(SQLITE_DB, false)
      : await sqlite.createConnection(SQLITE_DB, false, "no-encryption", 1, false);

    await db.open();
    await db.execute(`
      CREATE TABLE IF NOT EXISTS app_store (
        key TEXT PRIMARY KEY NOT NULL,
        value TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );
    `);
    return db;
  })();

  return sqliteDbPromise;
}

async function getSnapshot(): Promise<LocalSnapshot> {
  if (typeof window === "undefined") return emptySnapshot();

  const db = await getNativeDb();
  if (db) {
    const result = await db.query("SELECT value FROM app_store WHERE key = ?;", [SQLITE_KEY]);
    const raw = result.values?.[0]?.value;
    if (!raw) {
      const seeded = seedSnapshot();
      await saveSnapshot(seeded);
      return seeded;
    }
    return JSON.parse(raw) as LocalSnapshot;
  }

  const raw = window.localStorage.getItem(LOCAL_KEY);
  if (!raw) {
    const seeded = seedSnapshot();
    await saveSnapshot(seeded);
    return seeded;
  }
  return JSON.parse(raw) as LocalSnapshot;
}

async function saveSnapshot(snapshot: LocalSnapshot) {
  const db = await getNativeDb();
  if (db) {
    await db.run(
      "INSERT OR REPLACE INTO app_store (key, value, updated_at) VALUES (?, ?, ?);",
      [SQLITE_KEY, JSON.stringify(snapshot), now()]
    );
    return;
  }

  window.localStorage.setItem(LOCAL_KEY, JSON.stringify(snapshot));
}

function seedSnapshot(): LocalSnapshot {
  const snapshot = emptySnapshot();
  const createdAt = now();
  const tools = [
    { name: "Iron Mesh (Jali - Heavy)", totalQuantity: 6, dailyPrice: 20, imageUrl: "/images/jali-mesh.png" },
    { name: "Support Stand (Adjustable)", totalQuantity: 6, dailyPrice: 15, imageUrl: "/images/metal-stand.png" },
    { name: "Compactor (Dimsa 5HP)", totalQuantity: 6, dailyPrice: 150, imageUrl: "/images/dimsa.jpg" },
    { name: "Concrete Mixer (1/2 Bag)", totalQuantity: 6, dailyPrice: 500, imageUrl: "/images/concrete-mixer.jpg" },
  ];

  for (const toolData of tools) {
    const toolId = id();
    snapshot.tools.push({
      id: toolId,
      name: toolData.name,
      totalQuantity: toolData.totalQuantity,
      availableQuantity: toolData.totalQuantity,
      dailyPrice: toolData.dailyPrice,
      imageUrl: toolData.imageUrl,
      createdAt,
      updatedAt: createdAt,
    });
    for (let i = 1; i <= toolData.totalQuantity; i += 1) {
      snapshot.toolItems.push({
        id: id(),
        toolId,
        itemNumber: `#${i}`,
        status: "AVAILABLE",
        createdAt,
        updatedAt: createdAt,
      });
    }
  }

  return snapshot;
}

function hydrateTool(snapshot: LocalSnapshot, tool: DbTool): DbTool {
  return {
    ...tool,
    toolItems: snapshot.toolItems
      .filter((item) => item.toolId === tool.id)
      .sort((a, b) => a.itemNumber.localeCompare(b.itemNumber, undefined, { numeric: true })),
  };
}

function hydrateRental(snapshot: LocalSnapshot, rental: DbRental): DbRental {
  const customer = snapshot.customers.find((item) => item.id === rental.customerId);
  const rentalItems = snapshot.rentalItems
    .filter((item) => item.rentalId === rental.id)
    .map((item) => ({
      ...item,
      tool: snapshot.tools.find((tool) => tool.id === item.toolId),
      details: snapshot.rentalItemDetails
        .filter((detail) => detail.rentalItemId === item.id)
        .map((detail) => ({
          ...detail,
          toolItem: snapshot.toolItems.find((toolItem) => toolItem.id === detail.toolItemId),
        })),
    }));

  return {
    ...rental,
    customer,
    rentalItems,
    payments: snapshot.payments.filter((payment) => payment.rentalId === rental.id),
  };
}

function calculateRentalCost(startDate: string, endDate: Date, dailyPrice: number, quantity: number) {
  const diffTime = Math.abs(endDate.getTime() - new Date(startDate).getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(1, diffDays) * dailyPrice * quantity;
}

export const localData = {
  async isNativeSqliteAvailable() {
    return Capacitor.isNativePlatform();
  },

  async getTools(): LocalResult<DbTool[]> {
    const snapshot = await getSnapshot();
    const tools = snapshot.tools
      .map((tool) => hydrateTool(snapshot, tool))
      .sort((a, b) => a.name.localeCompare(b.name));
    return { success: true, data: tools };
  },

  async addTool(
    data: { name: string; totalQuantity: number; dailyPrice: number },
    photoBase64?: string
  ): LocalResult<DbTool> {
    const snapshot = await getSnapshot();
    const createdAt = now();
    const toolId = id();
    const imageUrl = photoBase64 || null;

    const tool: DbTool = {
      id: toolId,
      name: data.name,
      totalQuantity: data.totalQuantity,
      availableQuantity: data.totalQuantity,
      dailyPrice: data.dailyPrice,
      imageUrl,
      createdAt,
      updatedAt: createdAt,
    };

    snapshot.tools.push(tool);
    for (let i = 1; i <= data.totalQuantity; i += 1) {
      snapshot.toolItems.push({
        id: id(),
        toolId,
        itemNumber: `#${i}`,
        status: "AVAILABLE",
        createdAt,
        updatedAt: createdAt,
      });
    }
    await saveSnapshot(snapshot);

    return { success: true, data: hydrateTool(snapshot, tool) };
  },

  async getDashboardStats(): LocalResult<{
    totalTools: number;
    availableTools: number;
    rentedTools: number;
    todayReturns: number;
  }> {
    const snapshot = await getSnapshot();
    const totalTools = snapshot.tools.reduce((sum, tool) => sum + tool.totalQuantity, 0);
    const availableTools = snapshot.tools.reduce((sum, tool) => sum + tool.availableQuantity, 0);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayReturns = snapshot.rentals.filter(
      (rental) => rental.status === "RETURNED" && rental.returnedAt && new Date(rental.returnedAt) >= today
    ).length;

    return {
      success: true,
      data: {
        totalTools,
        availableTools,
        rentedTools: totalTools - availableTools,
        todayReturns,
      },
    };
  },

  async createRental(params: CreateRentalParams, photoBase64?: string): LocalResult<DbRental> {
    const snapshot = await getSnapshot();
    const timestamp = now();

    for (const item of params.items) {
      const tool = snapshot.tools.find((candidate) => candidate.id === item.toolId);
      if (!tool) throw new Error("Tool not found");
      if (tool.availableQuantity < item.quantity) {
        throw new Error(`Not enough stock available for ${tool.name}`);
      }
    }

    let customer = snapshot.customers.find((candidate) => candidate.mobile === params.customer.mobile);
    if (customer) {
      customer.name = params.customer.name;
      customer.village = params.customer.village;
      customer.photoUrl = photoBase64 || params.customer.photoUrl || customer.photoUrl;
      customer.updatedAt = timestamp;
    } else {
      customer = {
        id: id(),
        name: params.customer.name,
        mobile: params.customer.mobile,
        village: params.customer.village,
        photoUrl: photoBase64 || params.customer.photoUrl || null,
        createdAt: timestamp,
        updatedAt: timestamp,
      };
      snapshot.customers.push(customer);
    }

    const rental: DbRental = {
      id: id(),
      customerId: customer.id,
      startDate: (params.startDate || new Date()).toISOString(),
      expectedDays: params.expectedDays,
      status: "ACTIVE",
      advanceAmount: params.advanceAmount,
      totalAmount: null,
      returnedAt: null,
      createdAt: timestamp,
      updatedAt: timestamp,
    };
    snapshot.rentals.push(rental);

    for (const item of params.items) {
      const rentalItem: DbRentalItem = {
        id: id(),
        rentalId: rental.id,
        toolId: item.toolId,
        quantity: item.quantity,
        dailyPriceSnapshot: item.dailyPriceSnapshot,
        returnedQuantity: 0,
        createdAt: timestamp,
        updatedAt: timestamp,
      };
      snapshot.rentalItems.push(rentalItem);

      const availableItems = snapshot.toolItems
        .filter((toolItem) => toolItem.toolId === item.toolId && toolItem.status === "AVAILABLE")
        .sort((a, b) => a.itemNumber.localeCompare(b.itemNumber, undefined, { numeric: true }));

      const selectedItems = item.itemNumbers?.length
        ? availableItems.filter((toolItem) => item.itemNumbers?.includes(toolItem.itemNumber))
        : availableItems.slice(0, item.quantity);

      if (selectedItems.length !== item.quantity) {
        throw new Error("Selected items are no longer available");
      }

      for (const toolItem of selectedItems) {
        toolItem.status = "RENTED";
        toolItem.updatedAt = timestamp;
        snapshot.rentalItemDetails.push({
          id: id(),
          rentalItemId: rentalItem.id,
          toolItemId: toolItem.id,
          status: "RENTED",
          createdAt: timestamp,
          updatedAt: timestamp,
        });
      }

      const tool = snapshot.tools.find((candidate) => candidate.id === item.toolId);
      if (tool) {
        tool.availableQuantity -= item.quantity;
        tool.updatedAt = timestamp;
      }
    }

    if (params.advanceAmount > 0) {
      snapshot.payments.push({
        id: id(),
        rentalId: rental.id,
        amount: params.advanceAmount,
        type: "ADVANCE",
        paymentMethod: "CASH",
        createdAt: timestamp,
      });
    }

    snapshot.activityLogs.push({
      id: id(),
      action: "RENTAL_CREATED",
      description: `Created rental for ${customer.name}`,
      userId: null,
      createdAt: timestamp,
    });

    await saveSnapshot(snapshot);
    return { success: true, data: hydrateRental(snapshot, rental) };
  },

  async getActiveRentals(): LocalResult<DbRental[]> {
    const snapshot = await getSnapshot();
    const rentals = snapshot.rentals
      .filter((rental) => rental.status === "ACTIVE")
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .map((rental) => hydrateRental(snapshot, rental));
    return { success: true, data: rentals };
  },

  async getRentalById(rentalId: string): LocalResult<DbRental | null> {
    const snapshot = await getSnapshot();
    const rental = snapshot.rentals.find((candidate) => candidate.id === rentalId);
    return { success: true, data: rental ? hydrateRental(snapshot, rental) : null };
  },

  async completeRental(rentalId: string): LocalResult<{
    rental: DbRental;
    totalCost: number;
    advancePaid: number;
    balancePaid: number;
  }> {
    const snapshot = await getSnapshot();
    const rental = snapshot.rentals.find((candidate) => candidate.id === rentalId);
    if (!rental) throw new Error("Rental not found");
    if (rental.status === "RETURNED") throw new Error("Rental already returned");

    const returnDate = new Date();
    const timestamp = returnDate.toISOString();
    const rentalItems = snapshot.rentalItems.filter((item) => item.rentalId === rentalId);
    const totalCost = rentalItems.reduce(
      (sum, item) => sum + calculateRentalCost(rental.startDate, returnDate, item.dailyPriceSnapshot, item.quantity),
      0
    );
    const advancePaid = snapshot.payments
      .filter((payment) => payment.rentalId === rentalId && payment.type === "ADVANCE")
      .reduce((sum, payment) => sum + payment.amount, 0);
    const balancePaid = Math.max(0, totalCost - advancePaid);

    rental.status = "RETURNED";
    rental.returnedAt = timestamp;
    rental.totalAmount = totalCost;
    rental.updatedAt = timestamp;

    if (balancePaid > 0) {
      snapshot.payments.push({
        id: id(),
        rentalId,
        amount: balancePaid,
        type: "FINAL_SETTLEMENT",
        paymentMethod: "CASH",
        createdAt: timestamp,
      });
    }

    for (const item of rentalItems) {
      item.returnedQuantity = item.quantity;
      item.updatedAt = timestamp;

      const details = snapshot.rentalItemDetails.filter((detail) => detail.rentalItemId === item.id);
      for (const detail of details) {
        detail.status = "AVAILABLE";
        detail.updatedAt = timestamp;
        const toolItem = snapshot.toolItems.find((candidate) => candidate.id === detail.toolItemId);
        if (toolItem) {
          toolItem.status = "AVAILABLE";
          toolItem.updatedAt = timestamp;
        }
      }

      const tool = snapshot.tools.find((candidate) => candidate.id === item.toolId);
      if (tool) {
        tool.availableQuantity += item.quantity;
        tool.updatedAt = timestamp;
      }
    }

    snapshot.activityLogs.push({
      id: id(),
      action: "RENTAL_RETURNED",
      description: `Rental ${rental.id} returned. Final balance paid: Rs ${balancePaid}`,
      userId: null,
      createdAt: timestamp,
    });

    await saveSnapshot(snapshot);
    return { success: true, data: { rental, totalCost, advancePaid, balancePaid } };
  },

  async getRentalHistory(timeFilter = "All Time", searchQuery = ""): LocalResult<DbRental[]> {
    const snapshot = await getSnapshot();
    const lowerSearch = searchQuery.toLowerCase();
    const nowDate = new Date();

    const rentals = snapshot.rentals
      .filter((rental) => rental.status === "RETURNED")
      .filter((rental) => {
        if (timeFilter === "All Time" || !rental.returnedAt) return true;
        const returnedAt = new Date(rental.returnedAt);
        const start = new Date(nowDate);
        if (timeFilter === "Today") start.setHours(0, 0, 0, 0);
        if (timeFilter === "This Week") {
          start.setDate(start.getDate() - start.getDay());
          start.setHours(0, 0, 0, 0);
        }
        if (timeFilter === "This Month") {
          start.setDate(1);
          start.setHours(0, 0, 0, 0);
        }
        return returnedAt >= start;
      })
      .map((rental) => hydrateRental(snapshot, rental))
      .filter((rental) => {
        if (!lowerSearch) return true;
        return rental.customer?.name.toLowerCase().includes(lowerSearch) || rental.customer?.mobile.includes(searchQuery);
      })
      .sort((a, b) => new Date(b.returnedAt || 0).getTime() - new Date(a.returnedAt || 0).getTime());

    const summary = rentals.reduce(
      (acc, rental) => ({
        transactions: acc.transactions + 1,
        totalEarned: acc.totalEarned + (rental.totalAmount || 0),
      }),
      { transactions: 0, totalEarned: 0 }
    );

    return { success: true, data: rentals, summary };
  },
};
