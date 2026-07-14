const categories = [
  {
    id: "coffee",
    name: "Cà phê",
    icon: "https://stc-zmp.zadn.vn/templates/zaui-coffee/dummy/category-coffee.svg",
  },
  {
    id: "matcha",
    name: "Trà xanh",
    icon: "https://stc-zmp.zadn.vn/templates/zaui-coffee/dummy/category-matcha.svg",
  },
  {
    id: "food",
    name: "Đồ ăn vặt",
    icon: "https://stc-zmp.zadn.vn/templates/zaui-coffee/dummy/category-food.svg",
  },
  {
    id: "milktea",
    name: "Trà sữa",
    icon: "https://stc-zmp.zadn.vn/templates/zaui-coffee/dummy/category-milktea.svg",
  },
  {
    id: "drinks",
    name: "Giải khát",
    icon: "https://stc-zmp.zadn.vn/templates/zaui-coffee/dummy/category-drinks.svg",
  },
  {
    id: "bread",
    name: "Bánh mỳ",
    icon: "https://stc-zmp.zadn.vn/templates/zaui-coffee/dummy/category-bread.svg",
  },
  {
    id: "juice",
    name: "Nước ép",
    icon: "https://stc-zmp.zadn.vn/templates/zaui-coffee/dummy/category-juice.svg",
  },
];

const products = [
  {
    id: 1,
    name: "Caramel Latte",
    price: 35000,
    image: "https://stc-zmp.zadn.vn/templates/zaui-coffee/dummy/product-square-1.webp",
    description:
      "There is a set of mock banners available <u>here</u> in three colours and in a range of standard banner sizes",
    categoryId: ["coffee", "drinks"],
    variantId: ["size", "topping"],
  },
  {
    id: 2,
    name: "Mocha Frappuccino",
    price: 45000,
    image: "https://stc-zmp.zadn.vn/templates/zaui-coffee/dummy/product-square-2.webp",
    description:
      "There is a set of mock banners available <u>here</u> in three colours and in a range of standard banner sizes",
    categoryId: ["coffee"],
    variantId: ["size", "topping"],
  },
  {
    id: 3,
    name: "Grilled Pork Banh Mi",
    price: 30000,
    image: "https://stc-zmp.zadn.vn/templates/zaui-coffee/dummy/product-square-3.webp",
    description:
      "There is a set of mock banners available <u>here</u> in three colours and in a range of standard banner sizes",
    categoryId: ["food", "bread"],
    variantId: ["size"],
  },
  {
    id: 4,
    name: "Pizza",
    price: 28000,
    image: "https://stc-zmp.zadn.vn/templates/zaui-coffee/dummy/product-square-4.webp",
    description:
      "There is a set of mock banners available <u>here</u> in three colours and in a range of standard banner sizes",
    categoryId: ["food"],
    variantId: ["size"],
  },
  {
    id: 5,
    name: "Vanilla Latte",
    price: 35000,
    image: "https://stc-zmp.zadn.vn/templates/zaui-coffee/dummy/product-square-5.webp",
    description:
      "There is a set of mock banners available <u>here</u> in three colours and in a range of standard banner sizes",
    categoryId: ["coffee", "matcha"],
    variantId: ["size", "topping"],
  },
  {
    id: 6,
    name: "Caramel Macchiato",
    price: 38000,
    image: "https://stc-zmp.zadn.vn/templates/zaui-coffee/dummy/product-square-6.webp",
    description:
      "There is a set of mock banners available <u>here</u> in three colours and in a range of standard banner sizes",
    categoryId: ["coffee", "milktea"],
    variantId: ["size", "topping"],
  },
  {
    id: 7,
    name: "Espresso",
    price: 32000,
    image: "https://stc-zmp.zadn.vn/templates/zaui-coffee/dummy/product-square-7.webp",
    description:
      "There is a set of mock banners available <u>here</u> in three colours and in a range of standard banner sizes",
    categoryId: ["coffee"],
    variantId: ["size", "topping"],
  },
  {
    id: 8,
    name: "Green Tea Latte",
    price: 25000,
    image: "https://stc-zmp.zadn.vn/templates/zaui-coffee/dummy/product-square-8.webp",
    description:
      "There is a set of mock banners available <u>here</u> in three colours and in a range of standard banner sizes",
    categoryId: ["matcha"],
    variantId: ["size", "topping"],
  },
  {
    id: 9,
    name: "Bộ 3 Blue Corner Coffee siêu HOT",
    image: "https://stc-zmp.zadn.vn/templates/zaui-coffee/dummy/product-rect-1.webp",
    price: 25000,
    sale: {
      type: "percent",
      percent: 0.2,
    },
    description:
      "There is a set of mock banners available <u>here</u> in three colours and in a range of standard banner sizes",
    categoryId: ["coffee", "milktea", "drinks"],
    variantId: ["size", "topping"],
  },
  {
    id: 10,
    name: "Combo Hi Tea Aroma",
    image: "https://stc-zmp.zadn.vn/templates/zaui-coffee/dummy/product-rect-2.webp",
    price: 57000,
    sale: {
      type: "fixed",
      amount: 7000,
    },
    description:
      "There is a set of mock banners available <u>here</u> in three colours and in a range of standard banner sizes",
    categoryId: ["coffee", "drinks"],
    variantId: ["size", "topping"],
  },
  {
    id: 11,
    name: "Milk Tea Combo",
    price: 55000,
    image: "https://stc-zmp.zadn.vn/templates/zaui-coffee/dummy/product-rect-3.webp",
    description:
      "There is a set of mock banners available <u>here</u> in three colours and in a range of standard banner sizes",
    categoryId: ["milktea"],
    variantId: ["size", "topping"],
    sale: {
      type: "percent",
      percent: 0.5,
    },
  },
];

const variants = [
  {
    id: "size",
    label: "Kích cỡ",
    type: "single",
    default: "m",
    options: [
      {
        id: "s",
        label: "Nhỏ",
        priceChange: {
          type: "percent",
          percent: -0.2,
        },
      },
      {
        id: "m",
        label: "Vừa",
      },
      {
        id: "l",
        label: "To",
        priceChange: {
          type: "percent",
          percent: 0.2,
        },
      },
    ],
  },
  {
    id: "topping",
    label: "Topping",
    type: "multiple",
    default: ["t1", "t4"],
    options: [
      {
        id: "t1",
        label: "Trân châu",
        priceChange: {
          type: "fixed",
          amount: 5000,
        },
      },
      {
        id: "t2",
        label: "Bánh flan",
        priceChange: {
          type: "fixed",
          amount: 10000,
        },
      },
      {
        id: "t3",
        label: "Trang trí",
        priceChange: {
          type: "percent",
          percent: 0.15,
        },
      },
      {
        id: "t4",
        label: "Không lấy đá",
        priceChange: {
          type: "fixed",
          amount: -5000,
        },
      },
    ],
  },
];

module.exports = { categories, products, variants };
