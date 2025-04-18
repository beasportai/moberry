"use client"
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { toast } from "react-hot-toast";

interface Product {
  id: string;
  name: string;
  price: number;
  quantity: number;
  weight: string;
  image: string;
}

interface StateContextType {
  showCart: boolean;
  setShowCart: (show: boolean) => void;
  cartItems: Product[];
  totalPrice: number;
  totalQuantities: number;
  qty: number;
  active: boolean;
  setActive: (active: boolean) => void;
  setQty: (qty: number) => void;
  incQty: () => void;
  decQty: () => void;
  onAdd: (product: Product, quantity: number) => void;
  toggleCartItemQuanitity: (id: string, value: 'inc' | 'dec') => void;
  onRemove: (product: Product) => void;
  setCartItems: (items: Product[]) => void;
  setTotalPrice: (price: number) => void;
  setTotalQuantities: (quantities: number) => void;
  indexColor: number;
  setIndexColor: (color: number) => void;
}

const Context = createContext<StateContextType | undefined>(undefined);

interface StateContextProps {
  children: ReactNode;
}

export const StateContext: React.FC<StateContextProps> = ({ children }) => {
  const [showCart, setShowCart] = useState(false);
  const [cartItems, setCartItems] = useState<Product[]>([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalQuantities, setTotalQuantities] = useState(0);
  const [qty, setQty] = useState(1);
  const [indexColor, setIndexColor] = useState(1);
  const [active, setActive] = useState(false);
  let foundProduct: Product | undefined;
  let index: number;

  useEffect(() => {
    const bodyStyle = document.body.style;
    if (showCart || active) {
      bodyStyle.overflowY = "hidden";
    } else {
      bodyStyle.overflowY = "auto";
    }
  }, [showCart, active]);

  const onAdd = (product: Product, quantity: number) => {
    const uniqueId = `${product.id}-${product.weight}`;
    const checkProductInCart = cartItems.find((item) => item.id === uniqueId);

    setTotalPrice(
      (prevTotalPrice) => prevTotalPrice + product.price * quantity
    );
    setTotalQuantities((prevTotalQuantities) => prevTotalQuantities + quantity);

    if (checkProductInCart) {
      const updatedCartItems = cartItems.map((cartProduct) => {
        if (uniqueId === cartProduct.id) {
          const newQty = cartProduct.quantity + quantity;
          return {
            ...cartProduct,
            quantity: newQty,
          };
        } else {
          return {
            ...cartProduct,
          };
        }
      });

      setCartItems(updatedCartItems);
    } else {
      product.quantity = quantity;
      product.id = uniqueId;
      setCartItems([...cartItems, { ...product }]);
    }

    toast.success(
      `${qty} ${product.name} (${product.weight}) added to the cart.`
    );
  };

  const onRemove = (product: Product) => {
    foundProduct = cartItems.find((item) => item.id === product.id);
    if (!foundProduct) return;

    const newCartItems = cartItems.filter((item) => item.id !== product.id);

    setTotalPrice(
      (prevTotalPrice) =>
        prevTotalPrice - foundProduct!.price * foundProduct!.quantity
    );
    setTotalQuantities(
      (prevTotalQuantities) => prevTotalQuantities - foundProduct!.quantity
    );
    setCartItems(newCartItems);
  };

  const toggleCartItemQuanitity = (id: string, value: 'inc' | 'dec') => {
    foundProduct = cartItems.find((item) => item.id === id);
    if (!foundProduct) return;

    index = cartItems.findIndex((product) => product.id === id);
    const newCartItems = cartItems.filter((item) => item.id !== id);

    if (value === "inc") {
      newCartItems.splice(index, 0, {
        ...foundProduct,
        quantity: foundProduct.quantity + 1,
      });
      setCartItems(newCartItems);
      setTotalPrice((prevTotalPrice) => prevTotalPrice + foundProduct!.price);
      setTotalQuantities((prevTotalQuantities) => prevTotalQuantities + 1);
    } else if (value === "dec") {
      if (foundProduct.quantity > 1) {
        newCartItems.splice(index, 0, {
          ...foundProduct,
          quantity: foundProduct.quantity - 1,
        });
        setCartItems(newCartItems);
        setTotalPrice((prevTotalPrice) => prevTotalPrice - foundProduct!.price);
        setTotalQuantities((prevTotalQuantities) => prevTotalQuantities - 1);
      }
    }
  };

  const incQty = () => {
    setQty((prevQty) => prevQty + 1);
  };

  const decQty = () => {
    setQty((prevQty) => {
      if (prevQty - 1 < 1) return 1;
      return prevQty - 1;
    });
  };

  return (
    <Context.Provider
      value={{
        showCart,
        setShowCart,
        cartItems,
        totalPrice,
        totalQuantities,
        qty,
        active,
        setActive,
        setQty,
        incQty,
        decQty,
        onAdd,
        toggleCartItemQuanitity,
        onRemove,
        setCartItems,
        setTotalPrice,
        setTotalQuantities,
        indexColor,
        setIndexColor,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export const useStateContext = () => {
  const context = useContext(Context);
  if (context === undefined) {
    throw new Error('useStateContext must be used within a StateContextProvider');
  }
  return context;
};
