import { defineStore } from "pinia";
import { computed, ref } from "vue";
import type { Product } from "@/types/products";

type SelectedProductEntry = {
  product: Product;
  quantity: number;
};

export const useLabelPrintingStore = defineStore("labelPrinting", () => {
  const selectedProducts = ref<Map<string, SelectedProductEntry>>(new Map());

  const duplicatedProductList = computed(() => {
    const result: Product[] = [];
    selectedProducts.value.forEach(({ product, quantity }) => {
      for (let i = 0; i < quantity; i++) {
        result.push(product);
      }
    });
    return result;
  });

  function selectProduct(product: Product) {
    selectedProducts.value.set(product.sku, {
      product,
      quantity: 1, // Default starting quantity
    });
  }

  function unselectProduct(productId: string) {
    selectedProducts.value.delete(productId);
  }

  function isSelected(productId: string) {
    return selectedProducts.value.has(productId);
  }

  function toggleSelection(product: Product) {
    if (isSelected(product.sku)) {
      unselectProduct(product.sku);
    } else {
      selectProduct(product);
    }
  }

  function clearSelection() {
    selectedProducts.value.clear();
  }

  function updateQuantity(productId: string, quantity: number) {
    const item = selectedProducts.value.get(productId);
    if (item && quantity > 0) {
      selectedProducts.value.set(productId, {
        ...item,
        quantity,
      });
    }
  }

  function incrementQuantity(productId: string) {
    const item = selectedProducts.value.get(productId);
    if (item) {
      selectedProducts.value.set(productId, {
        ...item,
        quantity: item.quantity + 1,
      });
    }
  }

  function decrementQuantity(productId: string) {
    const item = selectedProducts.value.get(productId);
    if (item && item.quantity > 1) {
      selectedProducts.value.set(productId, {
        ...item,
        quantity: item.quantity - 1,
      });
    }
  }

  return {
    selectedProducts,
    duplicatedProductList,
    selectProduct,
    unselectProduct,
    toggleSelection,
    isSelected,
    clearSelection,
    updateQuantity,
    incrementQuantity,
    decrementQuantity,
  };
});
