import type { Product } from "@/features/cart/domain/cartTypes";

export interface ProductRepository {
  getAll(): Product[];
  findById(productId: string): Product | undefined;
}

const catalog: Product[] = [
  {
    id: "mug-ceramic",
    name: "Ceramic mug",
    description: "A warm pause for your ideas.",
    price: 12.5,
    category: "Home",
    image: "\u2615",
  },
  {
    id: "notebook-grid",
    name: "Grid notebook",
    description: "Smooth paper for planning and creating.",
    price: 8.9,
    category: "Stationery",
    image: "\u{1F4D3}",
  },
  {
    id: "tote-canvas",
    name: "Canvas tote bag",
    description: "Lightweight, sturdy, and ready to go.",
    price: 18,
    category: "Accessories",
    image: "\u{1F45C}",
  },
  {
    id: "bottle-steel",
    name: "Insulated bottle",
    description: "Keeps your drink at just the right temperature.",
    price: 24.75,
    category: "Accessories",
    image: "\u{1F9F4}",
  },
  {
    id: "lamp-desk",
    name: "Desk lamp",
    description: "Gentle light for your afternoon work sessions.",
    price: 36,
    category: "Home",
    image: "\u{1F4A1}",
  },
  {
    id: "pencils-set",
    name: "Pencil set",
    description: "Six shades for drawing new ideas.",
    price: 6.5,
    category: "Stationery",
    image: "\u270F\uFE0F",
  },
  {
    id: "plant-pot",
    name: "Clay planter",
    description: "A little home for your favorite plant.",
    price: 15.25,
    category: "Home",
    image: "\u{1FAB4}",
  },
  {
    id: "socks-color",
    name: "Colorful socks",
    description: "A cheerful detail for every step.",
    price: 9.4,
    category: "Accessories",
    image: "\u{1F9E6}",
  },
];

export const productRepository: ProductRepository = {
  getAll: () => catalog,
  findById: (productId) => catalog.find((product) => product.id === productId),
};

export const products = productRepository.getAll();
