import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";

async function startServer() {
  const app = express();
  app.set("trust proxy", 1);
  const PORT = 3000;

  // Security Middleware
  app.use(helmet({
    contentSecurityPolicy: false, // Disabled for development with Vite
  }));
  app.use(cors());
  app.use(express.json());

  // Rate Limiting
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 100,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    // Explicitly handle proxy headers to satisfy validation
    keyGenerator: (req) => {
      // Prioritize the standardized Forwarded header if present, then X-Forwarded-For
      return (req.headers['forwarded'] as string) || (req.headers['x-forwarded-for'] as string) || req.ip || 'unknown';
    },
    validate: { xForwardedForHeader: false }, // Disable internal check since we handle it in keyGenerator
  });
  app.use("/api", limiter);

  // Health Check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", message: "RentEase API is running" });
  });

  // Products API
  app.get("/api/products", (req, res) => {
    const products = [
      { id: 1, category: 'Appliances', image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a', title: 'Whirlpool 7kg Washing Machine', vendor: 'Home Appliances Co.', price: 25, deposit: 100, status: 'Available', rating: 4.8, reviewCount: 124, variants: [{ type: 'Color', options: ['White', 'Silver', 'Slate'] }, { type: 'Capacity', options: ['7kg', '8kg', '9kg'] }] },
      { id: 2, category: 'Office', image: 'https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1', title: 'Ergonomic Study Chair', vendor: 'Student Essentials', price: 10, deposit: 25, status: 'Low Stock', statusColor: 'text-orange-500 bg-orange-50', rating: 4.5, reviewCount: 89, variants: [{ type: 'Color', options: ['Black', 'Blue', 'Grey', 'Orange'] }] },
      { id: 3, category: 'Living Room', image: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd', title: 'Minimalist Study Desk', vendor: 'IKEA Rentals', price: 15, deposit: 40, status: 'Available', rating: 4.7, reviewCount: 56, variants: [{ type: 'Finish', options: ['Oak', 'White', 'Walnut'] }] },
      { id: 4, category: 'Appliances', image: 'https://images.unsplash.com/photo-1584568694244-14fbdf83bd30', title: 'Haier 50L Mini Fridge', vendor: 'Campus Appliances', price: 20, deposit: 50, status: 'Available', rating: 4.9, reviewCount: 203 },
      { id: 5, category: 'Living Room', image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85', title: 'Single Folding Bed', vendor: 'SleepWell', price: 18, deposit: 60, status: 'Available', rating: 4.2, reviewCount: 45 },
      { id: 6, category: 'Appliances', image: 'https://images.unsplash.com/photo-1527344073380-49638706d87f', title: 'Blue Star Portable AC', vendor: 'CoolBreeze', price: 40, deposit: 150, status: 'Available', rating: 4.6, reviewCount: 78 },
      { id: 7, category: 'Appliances', image: 'https://images.unsplash.com/photo-1574269909862-7e1d70bb8078', title: 'Prestige Induction Cooktop', vendor: 'Campus Appliances', price: 8, deposit: 20, status: 'Available', rating: 4.4, reviewCount: 32 },
      { id: 8, category: 'Appliances', image: 'https://images.unsplash.com/photo-1585659722983-38ca6114bcfe', title: 'Samsung 20L Microwave', vendor: 'Home Appliances Co.', price: 12, deposit: 30, status: 'Available', rating: 4.7, reviewCount: 112 },
      { id: 9, category: 'Living Room', image: 'https://images.unsplash.com/photo-1595428774223-ef52624120ec', title: 'Portable Canvas Wardrobe', vendor: 'IKEA Rentals', price: 5, deposit: 15, status: 'Available', rating: 4.0, reviewCount: 67 },
      { id: 10, category: 'Appliances', image: 'https://images.unsplash.com/photo-1565022513478-f79a9cdce8df', title: 'Crompton Table Fan', vendor: 'CoolBreeze', price: 4, deposit: 10, status: 'Available', rating: 4.3, reviewCount: 156 },
      { id: 11, category: 'Appliances', image: 'https://images.unsplash.com/photo-1586041857948-438914619d85', title: 'Ironing Board + Iron', vendor: 'Home Appliances Co.', price: 6, deposit: 15, status: 'Available', rating: 4.5, reviewCount: 94 },
      { id: 12, category: 'Appliances', image: 'https://images.unsplash.com/photo-1549488344-c10444fc4fb7', title: 'Kent Water Purifier', vendor: 'Campus Appliances', price: 15, deposit: 40, status: 'Low Stock', statusColor: 'text-orange-500 bg-orange-50', rating: 4.8, reviewCount: 142 },
      { id: 13, category: 'Living Room', image: 'https://images.unsplash.com/photo-1594620302200-9a762244a156', title: '2-Tier Plastic Bookshelf', vendor: 'Student Essentials', price: 3, deposit: 10, status: 'Available', rating: 4.1, reviewCount: 28 },
      { id: 14, category: 'Living Room', image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc', title: 'Modern Gray Sofa', vendor: 'Living Space', price: 45, deposit: 200, status: 'Available', rating: 4.9, reviewCount: 88 },
      { id: 15, category: 'Office', image: 'https://images.unsplash.com/photo-1497366216548-37526070297c', title: 'Executive Wooden Desk', vendor: 'Office Pro', price: 35, deposit: 100, status: 'Available', rating: 4.7, reviewCount: 15 },
      { id: 16, category: 'Appliances', image: 'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1', title: 'Front Load Washing Machine', vendor: 'TCL Global', price: 32, deposit: 120, status: 'Available', rating: 4.8, reviewCount: 210 },
    ];
    res.json(products);
  });


  // TODO: Add API Routes here in Step 2 & 3

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
