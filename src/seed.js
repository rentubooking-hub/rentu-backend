import "dotenv/config";
import mongoose from "mongoose";
import Tool from "./models/Tool.js";

const TOOLS = [
  { name: "Bosch Rotary Hammer Drill", category: "Power Tools", price: 89, unit: "hr", dist: "0.8 km", rating: 4.8, reviews: 132, img: "https://picsum.photos/seed/rento-drill/400/300", verified: true },
  { name: "Mahindra 5kVA Generator", category: "Industrial", price: 349, unit: "day", dist: "1.4 km", rating: 4.9, reviews: 87, img: "https://picsum.photos/seed/rento-gen/400/300", verified: true },
  { name: "Concrete Cement Mixer", category: "Construction", price: 599, unit: "day", dist: "2.1 km", rating: 4.6, reviews: 54, img: "https://picsum.photos/seed/rento-mixer/400/300", verified: true },
  { name: "Canon EOS R6 Camera Kit", category: "Photography", price: 799, unit: "day", dist: "3.0 km", rating: 5.0, reviews: 41, img: "https://picsum.photos/seed/rento-cam/400/300", verified: false },
];

async function seed() {
  if (!process.env.MONGODB_URI) {
    console.error("Missing MONGODB_URI in environment.");
    process.exit(1);
  }
  await mongoose.connect(process.env.MONGODB_URI);
  await Tool.deleteMany({});
  await Tool.insertMany(TOOLS);
  console.log(`Seeded ${TOOLS.length} tools.`);
  await mongoose.disconnect();
}

seed();
