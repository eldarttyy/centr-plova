// Branches and outbound links used across the site.
// Phones and addresses come from the Instagram bio; ratings and features from 2GIS (Oct 2026).
// Paste delivery-app store URLs (Glovo, Yandex Eats…) into DELIVERY once the
// restaurant shares them — their buttons appear automatically when set.

export const BRANCHES = [
  {
    id: 'zhibek',
    name: 'Жибек-Жолу',
    address: 'пр. Жибек-Жолу, 527 / ул. Исанова',
    phone: '+996550887777',
    phoneLabel: '0550 887 777',
    hours: 'Ежедневно 10:00–23:00',
    rating: 4.6,
    ratingCount: 1604,
    twoGis: 'https://2gis.kg/bishkek/firm/70000001019790293',
    mapQuery: 'Центр плова, проспект Жибек-Жолу 527, Бишкек',
    features: ['Летняя веранда', 'Кыргызская кухня', 'Шашлык'],
  },
  {
    id: 'tugolbai',
    name: 'Түгөлбай Ата',
    address: 'ул. Түгөлбай Ата, 1/1 (бывш. Линейная)',
    phone: '+996777977779',
    phoneLabel: '0777 977 779',
    hours: 'Ежедневно 10:00–23:00',
    rating: 4.5,
    ratingCount: 1035,
    twoGis: 'https://2gis.kg/bishkek/firm/70000001019347398',
    mapQuery: 'Центр плова, улица Туголбай Ата 1/1, Бишкек',
    features: ['Европейская кухня', 'Шашлык', 'Манты'],
  },
  {
    id: 'mkr5',
    name: '5 микрорайон',
    address: '5 мкр, 66Б (ул. Карла Маркса, 66/1)',
    phone: '+996556777779',
    phoneLabel: '0556 777 779',
    hours: 'Ежедневно 10:00–23:00',
    rating: 4.4,
    ratingCount: 1864,
    twoGis: 'https://2gis.kg/bishkek/firm/70000001021452701',
    mapQuery: 'Центр плова, 5-й микрорайон 66Б, Бишкек',
    features: ['Летняя веранда', 'Кыргызская кухня', 'Шашлык'],
  },
];

export const LINKS = {
  instagram: 'https://www.instagram.com/centr_plova/',
  website: 'https://eldarttyy.github.io/centr-plova/',
};

export const DELIVERY = {
  glovo: null,  // e.g. 'https://glovoapp.com/kg/ru/bishkek/centr-plova/'
  yandex: null, // e.g. 'https://eda.yandex.kg/bishkek/r/centr_plova'
};

export const reviewUrl = (b) => `${b.twoGis}/tab/reviews`;
export const mapEmbed = (b) => `https://maps.google.com/maps?q=${encodeURIComponent(b.mapQuery)}&z=16&output=embed`;
export const directionsUrl = (b) => `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(b.mapQuery)}`;
