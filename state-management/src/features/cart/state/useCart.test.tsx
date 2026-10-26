import { renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { useCart } from "@/features/cart/state/useCart";

describe("useCart", () => {
  it("throws a clear error when rendered outside CartProvider", () => {
    expect(() => renderHook(() => useCart())).toThrow(
      "useCart must be used within a CartProvider.",
    );
  });
});
