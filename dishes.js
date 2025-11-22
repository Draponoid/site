const dishes = [
  // СУПЫ
  { keyword: 'borscht',      name: 'Борщ',               price: 185, category: 'soup',     count: '350 г', image: 'soupe4', kind: 'meat' },
  { keyword: 'solanka',      name: 'Солянка',            price: 210, category: 'soup',     count: '350 г', image: 'soupe8', kind: 'meat' },
  { keyword: 'ukha',         name: 'Уха',                price: 220, category: 'soup',     count: '350 г', image: 'soupe9', kind: 'fish' },
  { keyword: 'chowder',      name: 'Рыбный чаудер',      price: 230, category: 'soup',     count: '350 г', image: 'soupe7', kind: 'fish' },
  { keyword: 'gazpacho',     name: 'Гаспачо',            price: 195, category: 'soup',     count: '350 г', image: 'soupe5', kind: 'veg'  },
  { keyword: 'mushroom',     name: 'Грибной суп-пюре',   price: 185, category: 'soup',     count: '330 г', image: 'soupe6', kind: 'veg'  },

  // ГЛАВНЫЕ БЛЮДА
  { keyword: 'chicken-grill',name: 'Курица гриль',       price: 299, category: 'main',     count: '280 г', image: 'food3',  kind: 'meat' },
  { keyword: 'steak',        name: 'Стейк рибай',        price: 490, category: 'main',     count: '300 г', image: 'food1',  kind: 'meat' },
  { keyword: 'salmon',       name: 'Лосось на гриле',    price: 520, category: 'main',     count: '250 г', image: 'food4',  kind: 'fish' },
  { keyword: 'cod',          name: 'Треска с овощами',   price: 420, category: 'main',     count: '300 г', image: 'food5',  kind: 'fish' },
  { keyword: 'lasagna',      name: 'Лазанья',            price: 385, category: 'main',     count: '400 г', image: 'food2',  kind: 'meat'  },
  { keyword: 'ratatouille',  name: 'Рататуй',            price: 320, category: 'main',     count: '350 г', image: 'food6',  kind: 'veg'  },

  // САЛАТЫ И СТАРТЕРЫ
  { keyword: 'caesar',       name: 'Цезарь с курицей',   price: 290, category: 'starter',  count: '220 г', image: 'starter1', kind: 'meat' },
  { keyword: 'herring',      name: 'Сельдь под шубой',   price: 210, category: 'starter',  count: '200 г', image: 'starter2', kind: 'fish' },
  { keyword: 'greek',        name: 'Греческий салат',    price: 260, category: 'starter',  count: '250 г', image: 'starter3', kind: 'veg'  },
  { keyword: 'vinegret',     name: 'Винегрет',           price: 150, category: 'starter',  count: '220 г', image: 'starter4', kind: 'veg'  },
  { keyword: 'olivie',       name: 'Оливье',             price: 240, category: 'starter',  count: '250 г', image: 'starter5', kind: 'meat'  },
  { keyword: 'caprese',      name: 'Капрезе',            price: 310, category: 'starter',  count: '200 г', image: 'starter6', kind: 'veg'  },

  // НАПИТКИ
  { keyword: 'apple-juice',  name: 'Яблочный сок',       price: 90,  category: 'drink',    count: '300 мл', image: 'drink1', kind: 'cold' },
  { keyword: 'orange-juice', name: 'Апельсиновый сок',   price: 120, category: 'drink',    count: '300 мл', image: 'drink2', kind: 'cold' },
  { keyword: 'carrot-juice', name: 'Морковный сок',      price: 110, category: 'drink',    count: '300 мл', image: 'drink3', kind: 'cold' },
  { keyword: 'tea',          name: 'Чай чёрный',         price: 80,  category: 'drink',    count: '200 мл', image: 'drink4', kind: 'hot'  },
  { keyword: 'coffee',       name: 'Кофе американо',     price: 130, category: 'drink',    count: '200 мл', image: 'drink5', kind: 'hot'  },
  { keyword: 'herbal-tea',   name: 'Травяной чай',       price: 100, category: 'drink',    count: '200 мл', image: 'drink6', kind: 'hot'  },

  // ДЕСЕРТЫ
  { keyword: 'icecream',     name: 'Мороженое ванильное',price: 140, category: 'dessert',  count: '100 г', image: 'dessert1', kind: 'small'  },
  { keyword: 'panna-cotta',  name: 'Панна-котта',        price: 220, category: 'dessert',  count: '120 г', image: 'dessert2', kind: 'small'  },
  { keyword: 'brownie',      name: 'Брауни',             price: 190, category: 'dessert',  count: '110 г', image: 'dessert3', kind: 'small'  },
  { keyword: 'tiramisu',     name: 'Тирамису',           price: 280, category: 'dessert',  count: '150 г', image: 'dessert4', kind: 'medium' },
  { keyword: 'napoleon',     name: 'Наполеон',           price: 260, category: 'dessert',  count: '160 г', image: 'dessert5', kind: 'medium' },
  { keyword: 'cheesecake',   name: 'Чизкейк',            price: 320, category: 'dessert',  count: '180 г', image: 'dessert6', kind: 'large'  }
];