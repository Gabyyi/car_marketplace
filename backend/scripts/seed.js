const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const fs = require('fs')
const path = require('path')
require('dotenv').config()

const User = require('../models/User')
const Ad = require('../models/Ad')

const MONGO_URI = process.env.MONGO_URI || process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/car_marketplace'
const DB_NAME = process.env.DB_NAME || 'CarBuy'
const BATCH_USERS = Number(process.env.SEED_USERS || 1000)
const BATCH_ADS = Number(process.env.SEED_ADS || 10000)
const PASSWORD = process.env.SEED_PASSWORD || 'password123'
let fakerApi = null
let cachedCarImages = null

const makes = ['BMW', 'Audi', 'Mercedes-Benz', 'Toyota', 'Ford', 'Volkswagen', 'Tesla', 'Volvo', 'Porsche', 'Hyundai']
const models = {
  BMW: ['3 Series', '5 Series', 'X3', 'X5', 'i4'],
  Audi: ['A3', 'A4', 'A6', 'Q5', 'Q7'],
  'Mercedes-Benz': ['C-Class', 'E-Class', 'S-Class', 'GLC', 'GLE'],
  Toyota: ['Corolla', 'Camry', 'RAV4', 'Highlander', 'Prius'],
  Ford: ['Focus', 'Mondeo', 'Kuga', 'Mustang', 'Explorer'],
  Volkswagen: ['Golf', 'Passat', 'Tiguan', 'Touareg', 'ID.4'],
  Tesla: ['Model 3', 'Model Y', 'Model S', 'Model X'],
  Volvo: ['S60', 'S90', 'XC40', 'XC60', 'XC90'],
  Porsche: ['911', 'Cayenne', 'Macan', 'Panamera'],
  Hyundai: ['Elantra', 'Tucson', 'Santa Fe', 'Ioniq 5']
}
const fuels = ['Petrol', 'Diesel', 'Hybrid', 'Electric']
const transmissions = ['Manual', 'Automatic']
const categories = ['Saloon', 'Estate', 'SUV', 'Hatchback', 'Coupe', 'Convertible', 'Van', 'Pickup']
const countries = [
  { name: 'Germany', code: '+49 (DE)' },
  { name: 'Romania', code: '+40 (RO)' },
  { name: 'United States', code: '+1 (US)' },
  { name: 'United Kingdom', code: '+44 (GB)' },
  { name: 'France', code: '+33 (FR)' },
  { name: 'Spain', code: '+34 (ES)' }
]
const colors = ['black', 'white', 'grey', 'silver', 'blue', 'red', 'green', 'brown', 'beige']
const materials = ['Full leather', 'Leather', 'Alcantara', 'Fabric', 'Synthetic leather']
const priceTypes = ['On request', 'Fixed price', 'Negotiable']
const currs = ['€', '$', '£']
const formOfAddresses = ['Mr', 'Ms', 'Mrs', 'Dr']
const uploadsDir = path.join(__dirname, '..', 'uploads')
const carImageSources = [
  'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1600&q=80',
  'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1600&q=80',
  'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=1600&q=80',
  'https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?auto=format&fit=crop&w=1600&q=80',
  'https://images.unsplash.com/photo-1542362567-b07e54358753?auto=format&fit=crop&w=1600&q=80',
  'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1600&q=80',
  'https://images.unsplash.com/photo-1550355291-bbee04a92027?auto=format&fit=crop&w=1600&q=80',
  'https://images.unsplash.com/photo-1489824904134-891ab64532f1?auto=format&fit=crop&w=1600&q=80',
  'https://images.unsplash.com/photo-1493238792000-8113da705763?auto=format&fit=crop&w=1600&q=80',
  'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&w=1600&q=80',
  'https://images.unsplash.com/photo-1494905998402-395d579af36f?auto=format&fit=crop&w=1600&q=80',
  'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1600&q=80',
  'https://images.unsplash.com/photo-1469285994282-454ceb49e63f?auto=format&fit=crop&w=1600&q=80',
  'https://images.unsplash.com/photo-1532581140115-3e355d1ed1de?auto=format&fit=crop&w=1600&q=80',
  'https://images.unsplash.com/photo-1471478331149-c72f17e33c73?auto=format&fit=crop&w=1600&q=80'
]

const vehicleCatalog = {
  BMW: [
    { model: '3 Series', category: 'Saloon', engine: '2.0L', fuel: 'Petrol', transmission: 'Automatic', motorPower: 184, motorPowerUnit: 'hp', cubicCapacity: '1998', driveType: 'RWD', emission: 'Euro 6d', emissionClass: 'Euro 6d', emissionSticker: '4 (Green)', subcategory: 'Used vehicle', priceBase: 32000, mileageBase: 26000, city: 'Munich', country: 'Germany', doors: '4/5', seats: 5, priceType: 'Fixed price' },
    { model: '5 Series', category: 'Saloon', engine: '2.0L', fuel: 'Diesel', transmission: 'Automatic', motorPower: 190, motorPowerUnit: 'hp', cubicCapacity: '1995', driveType: 'RWD', emission: 'Euro 6d', emissionClass: 'Euro 6d', emissionSticker: '4 (Green)', subcategory: 'Used vehicle', priceBase: 42000, mileageBase: 34000, city: 'Frankfurt', country: 'Germany', doors: '4/5', seats: 5, priceType: 'Negotiable' },
    { model: 'X3', category: 'SUV', engine: '2.0L', fuel: 'Hybrid', transmission: 'Automatic', motorPower: 252, motorPowerUnit: 'hp', cubicCapacity: '1998', driveType: 'AWD/4WD', emission: 'Euro 6d', emissionClass: 'Euro 6d', emissionSticker: '4 (Green)', subcategory: 'Used vehicle', priceBase: 45000, mileageBase: 28000, city: 'Berlin', country: 'Germany', doors: '4/5', seats: 5, priceType: 'On request' },
    { model: 'X5 xDrive40i', category: 'SUV', engine: '3.0L Inline 6', fuel: 'Petrol', transmission: 'Automatic', motorPower: 340, motorPowerUnit: 'hp', cubicCapacity: '2998', driveType: 'AWD/4WD', emission: 'Euro 6', emissionClass: 'Euro 6', emissionSticker: 'Green', subcategory: 'Used vehicle', priceBase: 67900, mileageBase: 18000, city: 'Munich', country: 'Germany', doors: '4/5', seats: 5, priceType: 'On request' },
    { model: 'i4', category: 'Sedan', engine: 'Electric', fuel: 'Electric', transmission: 'Automatic', motorPower: 340, motorPowerUnit: 'hp', cubicCapacity: '', driveType: 'RWD', emission: 'Zero emission', emissionClass: 'Electric', emissionSticker: 'Zero', subcategory: 'Used vehicle', priceBase: 54000, mileageBase: 15000, city: 'Hamburg', country: 'Germany', doors: '4/5', seats: 5, priceType: 'Negotiable' }
  ],
  Audi: [
    { model: 'A3', category: 'Hatchback', engine: '1.5 TFSI', fuel: 'Petrol', transmission: 'Automatic', motorPower: 150, motorPowerUnit: 'hp', cubicCapacity: '1498', driveType: 'FWD', emission: 'Euro 6d', emissionClass: 'Euro 6d', emissionSticker: '4 (Green)', subcategory: 'Used vehicle', priceBase: 24900, mileageBase: 22000, city: 'Frankfurt', country: 'Germany', doors: '4/5', seats: 5, priceType: 'Fixed price' },
    { model: 'A4', category: 'Saloon', engine: '2.0 TDI', fuel: 'Diesel', transmission: 'Automatic', motorPower: 204, motorPowerUnit: 'hp', cubicCapacity: '1968', driveType: 'AWD/4WD', emission: 'Euro 6d', emissionClass: 'Euro 6d', emissionSticker: '4 (Green)', subcategory: 'Used vehicle', priceBase: 32900, mileageBase: 31000, city: 'Munich', country: 'Germany', doors: '4/5', seats: 5, priceType: 'Negotiable' },
    { model: 'A6 Avant', category: 'Estate', engine: '2.0 TFSI', fuel: 'Petrol', transmission: 'Automatic', motorPower: 265, motorPowerUnit: 'hp', cubicCapacity: '1984', driveType: 'AWD/4WD', emission: 'Euro 6d', emissionClass: 'Euro 6d', emissionSticker: '4 (Green)', subcategory: 'Used vehicle', priceBase: 48900, mileageBase: 24000, city: 'Frankfurt', country: 'Germany', doors: '4/5', seats: 5, priceType: 'Fixed price' },
    { model: 'Q5', category: 'SUV', engine: '2.0 TFSI', fuel: 'Petrol', transmission: 'Automatic', motorPower: 245, motorPowerUnit: 'hp', cubicCapacity: '1984', driveType: 'AWD/4WD', emission: 'Euro 6d', emissionClass: 'Euro 6d', emissionSticker: '4 (Green)', subcategory: 'Used vehicle', priceBase: 46500, mileageBase: 29000, city: 'Berlin', country: 'Germany', doors: '4/5', seats: 5, priceType: 'On request' },
    { model: 'Q7', category: 'SUV', engine: '3.0 TDI', fuel: 'Diesel', transmission: 'Automatic', motorPower: 286, motorPowerUnit: 'hp', cubicCapacity: '2967', driveType: 'AWD/4WD', emission: 'Euro 6d', emissionClass: 'Euro 6d', emissionSticker: '4 (Green)', subcategory: 'Used vehicle', priceBase: 62900, mileageBase: 36000, city: 'Munich', country: 'Germany', doors: '4/5', seats: 7, priceType: 'Negotiable' }
  ],
  Mercedes: [
    { model: 'C-Class', category: 'Saloon', engine: '2.0L', fuel: 'Petrol', transmission: 'Automatic', motorPower: 204, motorPowerUnit: 'hp', cubicCapacity: '1999', driveType: 'RWD', emission: 'Euro 6d', emissionClass: 'Euro 6d', emissionSticker: '4 (Green)', subcategory: 'Used vehicle', priceBase: 35900, mileageBase: 21000, city: 'Stuttgart', country: 'Germany', doors: '4/5', seats: 5, priceType: 'Fixed price' },
    { model: 'E-Class', category: 'Saloon', engine: '2.0L', fuel: 'Diesel', transmission: 'Automatic', motorPower: 194, motorPowerUnit: 'hp', cubicCapacity: '1950', driveType: 'RWD', emission: 'Euro 6d', emissionClass: 'Euro 6d', emissionSticker: '4 (Green)', subcategory: 'Used vehicle', priceBase: 42900, mileageBase: 27000, city: 'Frankfurt', country: 'Germany', doors: '4/5', seats: 5, priceType: 'Negotiable' },
    { model: 'GLC', category: 'SUV', engine: '2.0L', fuel: 'Hybrid', transmission: 'Automatic', motorPower: 245, motorPowerUnit: 'hp', cubicCapacity: '1999', driveType: 'AWD/4WD', emission: 'Euro 6d', emissionClass: 'Euro 6d', emissionSticker: '4 (Green)', subcategory: 'Used vehicle', priceBase: 51900, mileageBase: 24000, city: 'Munich', country: 'Germany', doors: '4/5', seats: 5, priceType: 'On request' },
    { model: 'GLE', category: 'SUV', engine: '3.0L', fuel: 'Diesel', transmission: 'Automatic', motorPower: 272, motorPowerUnit: 'hp', cubicCapacity: '2987', driveType: 'AWD/4WD', emission: 'Euro 6d', emissionClass: 'Euro 6d', emissionSticker: '4 (Green)', subcategory: 'Used vehicle', priceBase: 68900, mileageBase: 22000, city: 'Hamburg', country: 'Germany', doors: '4/5', seats: 5, priceType: 'Fixed price' },
    { model: 'S-Class', category: 'Saloon', engine: '3.0L', fuel: 'Hybrid', transmission: 'Automatic', motorPower: 367, motorPowerUnit: 'hp', cubicCapacity: '2999', driveType: 'AWD/4WD', emission: 'Euro 6', emissionClass: 'Euro 6', emissionSticker: 'Green', subcategory: 'Used vehicle', priceBase: 88900, mileageBase: 12000, city: 'Stuttgart', country: 'Germany', doors: '4/5', seats: 5, priceType: 'On request' }
  ],
  Toyota: [
    { model: 'Corolla', category: 'Hatchback', engine: '1.8L Hybrid', fuel: 'Hybrid', transmission: 'Automatic', motorPower: 122, motorPowerUnit: 'hp', cubicCapacity: '1798', driveType: 'FWD', emission: 'Euro 6d', emissionClass: 'Euro 6d', emissionSticker: '4 (Green)', subcategory: 'Used vehicle', priceBase: 21900, mileageBase: 32000, city: 'Madrid', country: 'Spain', doors: '4/5', seats: 5, priceType: 'Fixed price' },
    { model: 'Camry', category: 'Saloon', engine: '2.5L Hybrid', fuel: 'Hybrid', transmission: 'Automatic', motorPower: 218, motorPowerUnit: 'hp', cubicCapacity: '2487', driveType: 'FWD', emission: 'Euro 6d', emissionClass: 'Euro 6d', emissionSticker: '4 (Green)', subcategory: 'Used vehicle', priceBase: 27900, mileageBase: 29000, city: 'Berlin', country: 'Germany', doors: '4/5', seats: 5, priceType: 'Negotiable' },
    { model: 'RAV4', category: 'SUV', engine: '2.5L Hybrid', fuel: 'Hybrid', transmission: 'Automatic', motorPower: 222, motorPowerUnit: 'hp', cubicCapacity: '2487', driveType: 'AWD/4WD', emission: 'Euro 6d', emissionClass: 'Euro 6d', emissionSticker: '4 (Green)', subcategory: 'Used vehicle', priceBase: 33900, mileageBase: 25000, city: 'Munich', country: 'Germany', doors: '4/5', seats: 5, priceType: 'On request' }
  ],
  Volkswagen: [
    { model: 'Golf', category: 'Hatchback', engine: '1.5 TSI', fuel: 'Petrol', transmission: 'Automatic', motorPower: 150, motorPowerUnit: 'hp', cubicCapacity: '1498', driveType: 'FWD', emission: 'Euro 6d', emissionClass: 'Euro 6d', emissionSticker: '4 (Green)', subcategory: 'Used vehicle', priceBase: 20900, mileageBase: 28000, city: 'Hamburg', country: 'Germany', doors: '4/5', seats: 5, priceType: 'Fixed price' },
    { model: 'Passat', category: 'Estate', engine: '2.0 TDI', fuel: 'Diesel', transmission: 'Automatic', motorPower: 150, motorPowerUnit: 'hp', cubicCapacity: '1968', driveType: 'FWD', emission: 'Euro 6d', emissionClass: 'Euro 6d', emissionSticker: '4 (Green)', subcategory: 'Used vehicle', priceBase: 24900, mileageBase: 35000, city: 'Frankfurt', country: 'Germany', doors: '4/5', seats: 5, priceType: 'Negotiable' },
    { model: 'Tiguan', category: 'SUV', engine: '2.0 TSI', fuel: 'Petrol', transmission: 'Automatic', motorPower: 190, motorPowerUnit: 'hp', cubicCapacity: '1984', driveType: 'AWD/4WD', emission: 'Euro 6d', emissionClass: 'Euro 6d', emissionSticker: '4 (Green)', subcategory: 'Used vehicle', priceBase: 31900, mileageBase: 30000, city: 'Berlin', country: 'Germany', doors: '4/5', seats: 5, priceType: 'On request' }
  ],
  Tesla: [
    { model: 'Model 3', category: 'Sedan', engine: 'Electric', fuel: 'Electric', transmission: 'Automatic', motorPower: 283, motorPowerUnit: 'hp', cubicCapacity: '', driveType: 'RWD', emission: 'Zero emission', emissionClass: 'Electric', emissionSticker: 'Zero', subcategory: 'Used vehicle', priceBase: 38900, mileageBase: 18000, city: 'San Francisco', country: 'United States', doors: '4/5', seats: 5, priceType: 'Fixed price' },
    { model: 'Model Y', category: 'SUV', engine: 'Electric', fuel: 'Electric', transmission: 'Automatic', motorPower: 351, motorPowerUnit: 'hp', cubicCapacity: '', driveType: 'AWD/4WD', emission: 'Zero emission', emissionClass: 'Electric', emissionSticker: 'Zero', subcategory: 'Used vehicle', priceBase: 45900, mileageBase: 16000, city: 'London', country: 'United Kingdom', doors: '4/5', seats: 5, priceType: 'Negotiable' },
    { model: 'Model S', category: 'Saloon', engine: 'Electric', fuel: 'Electric', transmission: 'Automatic', motorPower: 670, motorPowerUnit: 'hp', cubicCapacity: '', driveType: 'AWD/4WD', emission: 'Zero emission', emissionClass: 'Electric', emissionSticker: 'Zero', subcategory: 'Used vehicle', priceBase: 69900, mileageBase: 12000, city: 'Paris', country: 'France', doors: '4/5', seats: 5, priceType: 'On request' }
  ],
  Volvo: [
    { model: 'XC60', category: 'SUV', engine: '2.0L', fuel: 'Hybrid', transmission: 'Automatic', motorPower: 250, motorPowerUnit: 'hp', cubicCapacity: '1969', driveType: 'AWD/4WD', emission: 'Euro 6d', emissionClass: 'Euro 6d', emissionSticker: '4 (Green)', subcategory: 'Used vehicle', priceBase: 44900, mileageBase: 27000, city: 'Stockholm', country: 'Sweden', doors: '4/5', seats: 5, priceType: 'Fixed price' },
    { model: 'XC90', category: 'SUV', engine: '2.0L', fuel: 'Hybrid', transmission: 'Automatic', motorPower: 300, motorPowerUnit: 'hp', cubicCapacity: '1969', driveType: 'AWD/4WD', emission: 'Euro 6d', emissionClass: 'Euro 6d', emissionSticker: '4 (Green)', subcategory: 'Used vehicle', priceBase: 54900, mileageBase: 22000, city: 'Copenhagen', country: 'Denmark', doors: '4/5', seats: 7, priceType: 'Negotiable' }
  ],
  Porsche: [
    { model: '911', category: 'Coupe', engine: '3.0L', fuel: 'Petrol', transmission: 'Automatic', motorPower: 385, motorPowerUnit: 'hp', cubicCapacity: '2981', driveType: 'RWD', emission: 'Euro 6d', emissionClass: 'Euro 6d', emissionSticker: '4 (Green)', subcategory: 'Used vehicle', priceBase: 96900, mileageBase: 14000, city: 'Stuttgart', country: 'Germany', doors: '2/3', seats: 4, priceType: 'On request' },
    { model: 'Macan', category: 'SUV', engine: '2.0L', fuel: 'Petrol', transmission: 'Automatic', motorPower: 265, motorPowerUnit: 'hp', cubicCapacity: '1984', driveType: 'AWD/4WD', emission: 'Euro 6d', emissionClass: 'Euro 6d', emissionSticker: '4 (Green)', subcategory: 'Used vehicle', priceBase: 62900, mileageBase: 21000, city: 'Munich', country: 'Germany', doors: '4/5', seats: 5, priceType: 'Fixed price' }
  ],
  Hyundai: [
    { model: 'Tucson', category: 'SUV', engine: '1.6 T-GDI Hybrid', fuel: 'Hybrid', transmission: 'Automatic', motorPower: 230, motorPowerUnit: 'hp', cubicCapacity: '1598', driveType: 'AWD/4WD', emission: 'Euro 6d', emissionClass: 'Euro 6d', emissionSticker: '4 (Green)', subcategory: 'Used vehicle', priceBase: 29900, mileageBase: 23000, city: 'Madrid', country: 'Spain', doors: '4/5', seats: 5, priceType: 'Negotiable' },
    { model: 'Ioniq 5', category: 'SUV', engine: 'Electric', fuel: 'Electric', transmission: 'Automatic', motorPower: 218, motorPowerUnit: 'hp', cubicCapacity: '', driveType: 'AWD/4WD', emission: 'Zero emission', emissionClass: 'Electric', emissionSticker: 'Zero', subcategory: 'Used vehicle', priceBase: 36900, mileageBase: 17000, city: 'Paris', country: 'France', doors: '4/5', seats: 5, priceType: 'Fixed price' }
  ],
  Ford: [
    { model: 'Focus', category: 'Hatchback', engine: '1.5 EcoBoost', fuel: 'Petrol', transmission: 'Manual', motorPower: 150, motorPowerUnit: 'hp', cubicCapacity: '1498', driveType: 'FWD', emission: 'Euro 6d', emissionClass: 'Euro 6d', emissionSticker: '4 (Green)', subcategory: 'Used vehicle', priceBase: 17900, mileageBase: 33000, city: 'Bucharest', country: 'Romania', doors: '4/5', seats: 5, priceType: 'Fixed price' },
    { model: 'Kuga', category: 'SUV', engine: '2.5 Hybrid', fuel: 'Hybrid', transmission: 'Automatic', motorPower: 190, motorPowerUnit: 'hp', cubicCapacity: '2488', driveType: 'FWD', emission: 'Euro 6d', emissionClass: 'Euro 6d', emissionSticker: '4 (Green)', subcategory: 'Used vehicle', priceBase: 26900, mileageBase: 29000, city: 'London', country: 'United Kingdom', doors: '4/5', seats: 5, priceType: 'Negotiable' }
  ],
  Honda: [
    { model: 'Civic', category: 'Hatchback', engine: '1.5 VTEC Turbo', fuel: 'Petrol', transmission: 'Manual', motorPower: 182, motorPowerUnit: 'hp', cubicCapacity: '1498', driveType: 'FWD', emission: 'Euro 6d', emissionClass: 'Euro 6d', emissionSticker: '4 (Green)', subcategory: 'Used vehicle', priceBase: 22900, mileageBase: 26000, city: 'Madrid', country: 'Spain', doors: '4/5', seats: 5, priceType: 'Fixed price' },
    { model: 'CR-V', category: 'SUV', engine: '2.0 Hybrid', fuel: 'Hybrid', transmission: 'Automatic', motorPower: 184, motorPowerUnit: 'hp', cubicCapacity: '1993', driveType: 'AWD/4WD', emission: 'Euro 6d', emissionClass: 'Euro 6d', emissionSticker: '4 (Green)', subcategory: 'Used vehicle', priceBase: 30900, mileageBase: 30000, city: 'Rome', country: 'Italy', doors: '4/5', seats: 5, priceType: 'Negotiable' },
    { model: 'Accord', category: 'Saloon', engine: '2.0 Hybrid', fuel: 'Hybrid', transmission: 'Automatic', motorPower: 204, motorPowerUnit: 'hp', cubicCapacity: '1993', driveType: 'FWD', emission: 'Euro 6d', emissionClass: 'Euro 6d', emissionSticker: '4 (Green)', subcategory: 'Used vehicle', priceBase: 31900, mileageBase: 24000, city: 'Lisbon', country: 'Portugal', doors: '4/5', seats: 5, priceType: 'Fixed price' }
  ],
  Mazda: [
    { model: 'Mazda3', category: 'Hatchback', engine: '2.0 Skyactiv-G', fuel: 'Petrol', transmission: 'Manual', motorPower: 150, motorPowerUnit: 'hp', cubicCapacity: '1998', driveType: 'FWD', emission: 'Euro 6d', emissionClass: 'Euro 6d', emissionSticker: '4 (Green)', subcategory: 'Used vehicle', priceBase: 20900, mileageBase: 27000, city: 'Vienna', country: 'Austria', doors: '4/5', seats: 5, priceType: 'Fixed price' },
    { model: 'CX-5', category: 'SUV', engine: '2.5 Skyactiv-G', fuel: 'Petrol', transmission: 'Automatic', motorPower: 194, motorPowerUnit: 'hp', cubicCapacity: '2488', driveType: 'AWD/4WD', emission: 'Euro 6d', emissionClass: 'Euro 6d', emissionSticker: '4 (Green)', subcategory: 'Used vehicle', priceBase: 29900, mileageBase: 22000, city: 'Prague', country: 'Czech Republic', doors: '4/5', seats: 5, priceType: 'Negotiable' },
    { model: 'MX-5', category: 'Convertible', engine: '2.0 Skyactiv-G', fuel: 'Petrol', transmission: 'Manual', motorPower: 184, motorPowerUnit: 'hp', cubicCapacity: '1998', driveType: 'RWD', emission: 'Euro 6d', emissionClass: 'Euro 6d', emissionSticker: '4 (Green)', subcategory: 'Used vehicle', priceBase: 31900, mileageBase: 18000, city: 'Barcelona', country: 'Spain', doors: '2/3', seats: 2, priceType: 'On request' }
  ],
  Nissan: [
    { model: 'Qashqai', category: 'SUV', engine: '1.3 DIG-T', fuel: 'Petrol', transmission: 'Automatic', motorPower: 158, motorPowerUnit: 'hp', cubicCapacity: '1332', driveType: 'FWD', emission: 'Euro 6d', emissionClass: 'Euro 6d', emissionSticker: '4 (Green)', subcategory: 'Used vehicle', priceBase: 24900, mileageBase: 28000, city: 'Bucharest', country: 'Romania', doors: '4/5', seats: 5, priceType: 'Fixed price' },
    { model: 'X-Trail', category: 'SUV', engine: '1.5 e-POWER', fuel: 'Hybrid', transmission: 'Automatic', motorPower: 213, motorPowerUnit: 'hp', cubicCapacity: '1497', driveType: 'AWD/4WD', emission: 'Euro 6d', emissionClass: 'Euro 6d', emissionSticker: '4 (Green)', subcategory: 'Used vehicle', priceBase: 33900, mileageBase: 21000, city: 'Warsaw', country: 'Poland', doors: '4/5', seats: 7, priceType: 'Negotiable' },
    { model: 'Leaf', category: 'Hatchback', engine: 'Electric', fuel: 'Electric', transmission: 'Automatic', motorPower: 150, motorPowerUnit: 'hp', cubicCapacity: '', driveType: 'FWD', emission: 'Zero emission', emissionClass: 'Electric', emissionSticker: 'Zero', subcategory: 'Used vehicle', priceBase: 18900, mileageBase: 32000, city: 'Amsterdam', country: 'Netherlands', doors: '4/5', seats: 5, priceType: 'Fixed price' }
  ],
  Kia: [
    { model: 'Ceed', category: 'Hatchback', engine: '1.5 T-GDI', fuel: 'Petrol', transmission: 'Manual', motorPower: 160, motorPowerUnit: 'hp', cubicCapacity: '1482', driveType: 'FWD', emission: 'Euro 6d', emissionClass: 'Euro 6d', emissionSticker: '4 (Green)', subcategory: 'Used vehicle', priceBase: 19900, mileageBase: 26000, city: 'Sofia', country: 'Bulgaria', doors: '4/5', seats: 5, priceType: 'Fixed price' },
    { model: 'Sportage', category: 'SUV', engine: '1.6 T-GDI Hybrid', fuel: 'Hybrid', transmission: 'Automatic', motorPower: 230, motorPowerUnit: 'hp', cubicCapacity: '1598', driveType: 'AWD/4WD', emission: 'Euro 6d', emissionClass: 'Euro 6d', emissionSticker: '4 (Green)', subcategory: 'Used vehicle', priceBase: 31900, mileageBase: 23000, city: 'Budapest', country: 'Hungary', doors: '4/5', seats: 5, priceType: 'Negotiable' },
    { model: 'EV6', category: 'SUV', engine: 'Electric', fuel: 'Electric', transmission: 'Automatic', motorPower: 229, motorPowerUnit: 'hp', cubicCapacity: '', driveType: 'RWD', emission: 'Zero emission', emissionClass: 'Electric', emissionSticker: 'Zero', subcategory: 'Used vehicle', priceBase: 40900, mileageBase: 16000, city: 'Berlin', country: 'Germany', doors: '4/5', seats: 5, priceType: 'On request' }
  ],
  Skoda: [
    { model: 'Octavia', category: 'Estate', engine: '2.0 TDI', fuel: 'Diesel', transmission: 'Automatic', motorPower: 150, motorPowerUnit: 'hp', cubicCapacity: '1968', driveType: 'FWD', emission: 'Euro 6d', emissionClass: 'Euro 6d', emissionSticker: '4 (Green)', subcategory: 'Used vehicle', priceBase: 23900, mileageBase: 29000, city: 'Prague', country: 'Czech Republic', doors: '4/5', seats: 5, priceType: 'Fixed price' },
    { model: 'Kodiaq', category: 'SUV', engine: '2.0 TSI', fuel: 'Petrol', transmission: 'Automatic', motorPower: 190, motorPowerUnit: 'hp', cubicCapacity: '1984', driveType: 'AWD/4WD', emission: 'Euro 6d', emissionClass: 'Euro 6d', emissionSticker: '4 (Green)', subcategory: 'Used vehicle', priceBase: 34900, mileageBase: 24000, city: 'Brno', country: 'Czech Republic', doors: '4/5', seats: 7, priceType: 'Negotiable' },
    { model: 'Superb', category: 'Saloon', engine: '2.0 TSI', fuel: 'Petrol', transmission: 'Automatic', motorPower: 190, motorPowerUnit: 'hp', cubicCapacity: '1984', driveType: 'FWD', emission: 'Euro 6d', emissionClass: 'Euro 6d', emissionSticker: '4 (Green)', subcategory: 'Used vehicle', priceBase: 28900, mileageBase: 25000, city: 'Vienna', country: 'Austria', doors: '4/5', seats: 5, priceType: 'Fixed price' }
  ],
  Renault: [
    { model: 'Megane', category: 'Hatchback', engine: '1.3 TCe', fuel: 'Petrol', transmission: 'Manual', motorPower: 140, motorPowerUnit: 'hp', cubicCapacity: '1333', driveType: 'FWD', emission: 'Euro 6d', emissionClass: 'Euro 6d', emissionSticker: '4 (Green)', subcategory: 'Used vehicle', priceBase: 17900, mileageBase: 34000, city: 'Paris', country: 'France', doors: '4/5', seats: 5, priceType: 'Fixed price' },
    { model: 'Kadjar', category: 'SUV', engine: '1.3 TCe', fuel: 'Petrol', transmission: 'Automatic', motorPower: 160, motorPowerUnit: 'hp', cubicCapacity: '1333', driveType: 'FWD', emission: 'Euro 6d', emissionClass: 'Euro 6d', emissionSticker: '4 (Green)', subcategory: 'Used vehicle', priceBase: 22900, mileageBase: 30000, city: 'Lyon', country: 'France', doors: '4/5', seats: 5, priceType: 'Negotiable' },
    { model: 'Austral', category: 'SUV', engine: '1.2 E-Tech Hybrid', fuel: 'Hybrid', transmission: 'Automatic', motorPower: 200, motorPowerUnit: 'hp', cubicCapacity: '1199', driveType: 'FWD', emission: 'Euro 6d', emissionClass: 'Euro 6d', emissionSticker: '4 (Green)', subcategory: 'Used vehicle', priceBase: 29900, mileageBase: 19000, city: 'Marseille', country: 'France', doors: '4/5', seats: 5, priceType: 'On request' }
  ],
  Peugeot: [
    { model: '308', category: 'Hatchback', engine: '1.2 PureTech', fuel: 'Petrol', transmission: 'Manual', motorPower: 130, motorPowerUnit: 'hp', cubicCapacity: '1199', driveType: 'FWD', emission: 'Euro 6d', emissionClass: 'Euro 6d', emissionSticker: '4 (Green)', subcategory: 'Used vehicle', priceBase: 18900, mileageBase: 31000, city: 'Nice', country: 'France', doors: '4/5', seats: 5, priceType: 'Fixed price' },
    { model: '3008', category: 'SUV', engine: '1.6 Hybrid', fuel: 'Hybrid', transmission: 'Automatic', motorPower: 225, motorPowerUnit: 'hp', cubicCapacity: '1598', driveType: 'FWD', emission: 'Euro 6d', emissionClass: 'Euro 6d', emissionSticker: '4 (Green)', subcategory: 'Used vehicle', priceBase: 29900, mileageBase: 22000, city: 'Toulouse', country: 'France', doors: '4/5', seats: 5, priceType: 'Negotiable' },
    { model: '508', category: 'Saloon', engine: '1.6 PureTech', fuel: 'Petrol', transmission: 'Automatic', motorPower: 180, motorPowerUnit: 'hp', cubicCapacity: '1598', driveType: 'FWD', emission: 'Euro 6d', emissionClass: 'Euro 6d', emissionSticker: '4 (Green)', subcategory: 'Used vehicle', priceBase: 27900, mileageBase: 26000, city: 'Paris', country: 'France', doors: '4/5', seats: 5, priceType: 'Fixed price' }
  ]
}

const profilePool = Object.entries(vehicleCatalog).flatMap(([make, entries]) => entries.map(entry => ({ make, ...entry })))

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}
function bool() {
  return Math.random() < 0.5
}

async function ensureAds(users) {
  // Ensure users list
  if (!users || !users.length) {
    users = await User.find({}).sort({ createdAt: 1 })
  }

  // If still empty, create a fallback user
  if (!users.length) {
    const password = await bcrypt.hash(PASSWORD, 10)
    const fallback = await User.create({ username: 'seed-fallback', email: `seed.fallback.${Date.now()}@example.com`, password, ads: [] })
    users.push(fallback)
  }

  const currentAds = await Ad.find({}).sort({ createdAt: 1 })
  const existingCount = currentAds.length
  const remaining = Math.max(0, BATCH_ADS - existingCount)
  if (remaining <= 0) return 0

  // Ensure we have enough users to distribute 50-100 ads each
  // minimal users = ceil(remaining / 100)
  let userCount = users.length
  const minUsersNeeded = Math.ceil(remaining / 100)
  if (userCount < minUsersNeeded) {
    // create additional users to reach minUsersNeeded
    const toCreate = minUsersNeeded - userCount
    for (let i = 0; i < toCreate; i++) {
      const password = await bcrypt.hash(PASSWORD, 10)
      const u = await User.create({ username: `seed-dealer-${Date.now()}-${i}`, email: `seed.dealer.${Date.now()}.${i}@example.com`, password, ads: [] })
      users.push(u)
    }
    userCount = users.length
  }

  // Start with base 50 ads per user
  const base = 50
  let targets = Array(userCount).fill(base)
  let allocated = base * userCount
  let extra = remaining - allocated

  // Distribute extra up to +50 per user (so each ends up 50-100)
  let idx = 0
  while (extra > 0) {
    const add = Math.min(50, extra, Math.floor(Math.random() * 51))
    targets[idx % userCount] += add
    extra -= add
    idx++
  }

  // Create ads per user according to targets
  let created = 0
  let globalIndex = existingCount
  for (let u = 0; u < userCount; u++) {
    const owner = users[u]
    const ownerId = owner._id || owner
    const toMake = Math.max(0, Math.min(targets[u], remaining - created))
    for (let j = 0; j < toMake; j++) {
      try {
        const payload = await buildAdDocument(globalIndex + j, ownerId)
        const ad = await Ad.create(payload)
        // attach ad to owner
        try {
          if (owner.ads && !owner.ads.some(existingId => String(existingId) === String(ad._id))) {
            owner.ads.push(ad._id)
            if (typeof owner.save === 'function') await owner.save()
            else await User.updateOne({ _id: owner._id }, { $addToSet: { ads: ad._id } })
          }
        } catch (relErr) {
          console.warn('Warning: failed to attach ad to owner record', relErr && relErr.message)
        }

        created += 1
        if (created % 500 === 0) {
          console.log(`Inserted ${created} new ads (DB total approx ${existingCount + created})`)
        }
      } catch (err) {
        console.error('Failed creating ad for owner', ownerId, err && err.message)
        // continue
      }
    }
    globalIndex += toMake
    if (created >= remaining) break
  }

  return created
}

async function seedImages(count = 4) {
  const cached = await ensureCarImageCache()

  const images = []
  const shuffled = [...cached].sort(() => Math.random() - 0.5)
  for (let idx = 0; idx < count; idx++) {
    images.push(shuffled[idx % shuffled.length])
  }
  return images
}

function arraySample(values, minItems = 1, maxItems = values.length) {
  const shuffled = [...values].sort(() => Math.random() - 0.5)
  const limit = Math.max(minItems, Math.min(maxItems, shuffled.length))
  return shuffled.slice(0, num(minItems, limit))
}

function buildEquipment(profileName) {
  const baseSafety = [
    'Antilock braking system (ABS)',
    'Electronic stability program (ESP)',
    'Traction control (ASR)',
    'Emergency brake assist',
    'Lane assist',
    'Blind spot assist',
    'Traffic sign recognition'
  ]

  const comfort = [
    'Electric windows',
    'Electric side mirrors',
    'Keyless central locking',
    'Ambient lighting',
    'Rain sensor',
    'Light sensor',
    'Leather steering wheel',
    'Power Assisted Steering'
  ]

  const infotainment = [
    'Bluetooth',
    'Navigation system',
    'Digital cockpit',
    'Touchscreen',
    'Apple CarPlay',
    'Android Auto',
    'USB port',
    'WLAN / Wi-Fi hotspot',
    'Head-up display'
  ]

  const extras = [
    'Sunroof',
    'Panoramic roof',
    'Sports package',
    'Air suspension',
    'Alloy wheels',
    'Winter tyres',
    'Summer tyres'
  ]

  return {
    colors: arraySample(colors, 1, 3),
    metallic: bool(),
    interiorColor: pick(['black', 'beige', 'brown', 'grey', 'white']),
    materials: arraySample(materials, 1, 2),
    safety: profileName,
    comfort: profileName,
    infotainment: profileName,
    extras: profileName,
    safetyFeatures: arraySample(baseSafety, 5, baseSafety.length),
    cruise: pick(['Adaptive cruise control', 'Cruise control', '']),
    speedLimitControl: bool(),
    distanceWarning: bool(),
    airbags: pick(['Full set', 'Front and side', 'Front, side, curtain']),
    isofix: bool(),
    passengerIsofix: bool(),
    headlightType: pick(['LED', 'Matrix LED', 'Xenon', 'Halogen']),
    headlightWasher: bool(),
    glareFreeHighBeam: bool(),
    highBeamAssist: bool(),
    daytimeRunning: pick(['Daytime running LED', 'LED', 'Halogen']),
    adaptiveLighting: bool() ? 'Yes' : 'No',
    fogLamps: bool(),
    alarmSystem: bool(),
    engineImmobilizer: bool(),
    climatization: pick(['Automatic climatization', '2 zones', '3 zones', 'Manual climate control']),
    auxiliaryHeating: bool(),
    heatedWindshield: bool(),
    heatedSteeringWheel: bool(),
    parkingSelfSteering: bool(),
    acousticFront: bool(),
    acousticRear: bool(),
    visualCamera: bool(),
    visual360: bool(),
    heatedSeats: arraySample(['Front', 'Back'], 0, 2),
    electricSeats: arraySample(['Front', 'Back'], 0, 2),
    seatFeatures: arraySample(['Sport seats', 'Arm rest', 'Lumbar support', 'Massage seats', 'Seat ventilation', 'Fold flat passenger seat'], 1, 6),
    otherComfort: arraySample(comfort, 2, comfort.length),
    infotainmentFeatures: arraySample(infotainment, 3, infotainment.length),
    tires: arraySample(extras.slice(4), 1, 3),
    breakdownService: pick(['Europe-wide', 'National', 'Manufacturer warranty', 'Roadside assistance']),
    tirePressureMonitoring: bool(),
    extrasFeatures: arraySample(extras.slice(0, 4), 0, 4),
    trailerCoupling: pick(['No coupling', 'Preparation only', 'Tow bar', 'Electric trailer coupling']),
    lightSensor: bool(),
    rainSensor: bool(),
    powerAssistedSteering: bool(),
    ambientLighting: bool(),
    leatherSteeringWheel: bool(),
    electricWindows: bool(),
    electricSideMirror: bool(),
    electricTailgate: bool(),
    centralLocking: bool(),
    keylessCentralLocking: bool()
  }
}

function buildProfile(index) {
  const profiles = [
    {
      make: 'Mercedes-Benz',
      model: 'S 500',
      year: '',
      regMonth: 'January',
      regYear: '2026',
      regDate: '',
      mileage: 1000,
      engine: '3.0L V6',
      fuel: 'Hybrid',
      transmission: 'Automatic',
      emission: 'Euro 6',
      conditionNotes: 'Luxury sedan in showroom condition',
      inspectionDate: '',
      category: 'Saloon',
      doors: '4/5',
      slidingDoor: 'No',
      seats: 4,
      motorPower: 430,
      motorPowerUnit: 'hp',
      cubicCapacity: '2999',
      paddleShifters: false,
      driveType: 'AWD/4WD',
      emissionClass: 'Euro 6',
      emissionSticker: 'Green',
      particulateFilter: true,
      startStop: true,
      fuelConsumptionComb: 12,
      fuelConsumptionUrban: 14,
      fuelConsumptionExtraUrban: 10.7,
      co2Combined: 86.5,
      subcategory: 'New vehicle',
      owners: '1',
      damaged: 'No',
      accidentDamaged: 'No',
      roadworthy: 'Yes',
      nonSmoking: false,
      inspectionMonth: 'August',
      inspectionYear: '2026',
      fullServiceHistory: true,
      warranty: true,
      priceBase: 140000,
      currency: '€',
      priceType: 'On request',
      city: 'Dubai',
      country: 'United Arab Emirates'
    },
    {
      make: 'Audi',
      model: 'A6 Avant',
      year: 2024,
      regMonth: 'March',
      regYear: '2024',
      regDate: '2024-03-15',
      mileage: 24500,
      engine: '2.0 TFSI',
      fuel: 'Petrol',
      transmission: 'Automatic',
      emission: 'Euro 6d',
      conditionNotes: 'One-owner, dealer serviced',
      inspectionDate: '2026-03-01',
      category: 'Estate',
      doors: '4/5',
      slidingDoor: 'No',
      seats: 5,
      motorPower: 265,
      motorPowerUnit: 'hp',
      cubicCapacity: '1984',
      paddleShifters: true,
      driveType: 'AWD/4WD',
      emissionClass: 'Euro 6d',
      emissionSticker: '4 (Green)',
      particulateFilter: true,
      startStop: true,
      fuelConsumptionComb: 7.1,
      fuelConsumptionUrban: 8.8,
      fuelConsumptionExtraUrban: 5.9,
      co2Combined: 161.2,
      subcategory: 'Used vehicle',
      owners: '1',
      damaged: 'No',
      accidentDamaged: 'No',
      roadworthy: 'Yes',
      nonSmoking: true,
      inspectionMonth: 'March',
      inspectionYear: '2026',
      fullServiceHistory: true,
      warranty: false,
      priceBase: 48900,
      currency: '€',
      priceType: 'Fixed price',
      city: 'Frankfurt',
      country: 'Germany'
    },
    {
      make: 'Tesla',
      model: 'Model 3 Performance',
      year: 2022,
      regMonth: 'November',
      regYear: '2022',
      regDate: '2022-11-05',
      mileage: 31400,
      engine: 'Electric',
      fuel: 'Electric',
      transmission: 'Automatic',
      emission: 'Zero emission',
      conditionNotes: 'Battery health excellent',
      inspectionDate: '2026-11-01',
      category: 'Sedan',
      doors: '4/5',
      slidingDoor: 'No',
      seats: 5,
      motorPower: 460,
      motorPowerUnit: 'hp',
      cubicCapacity: '',
      paddleShifters: false,
      driveType: 'RWD',
      emissionClass: 'Electric',
      emissionSticker: 'Zero',
      particulateFilter: false,
      startStop: false,
      fuelConsumptionComb: 0,
      fuelConsumptionUrban: 0,
      fuelConsumptionExtraUrban: 0,
      co2Combined: 0,
      subcategory: 'Used vehicle',
      owners: '2',
      damaged: 'No',
      accidentDamaged: 'No',
      roadworthy: 'Yes',
      nonSmoking: true,
      inspectionMonth: 'November',
      inspectionYear: '2026',
      fullServiceHistory: true,
      warranty: true,
      priceBase: 39900,
      currency: '$',
      priceType: 'Negotiable',
      city: 'San Francisco',
      country: 'United States'
    },
    {
      make: 'BMW',
      model: 'X5 xDrive40i',
      year: 2023,
      regMonth: 'May',
      regYear: '2023',
      regDate: '2023-05-20',
      mileage: 18200,
      engine: '3.0L Inline 6',
      fuel: 'Petrol',
      transmission: 'Automatic',
      emission: 'Euro 6',
      conditionNotes: 'Well maintained family SUV',
      inspectionDate: '2026-05-20',
      category: 'SUV',
      doors: '4/5',
      slidingDoor: 'No',
      seats: 5,
      motorPower: 340,
      motorPowerUnit: 'hp',
      cubicCapacity: '2998',
      paddleShifters: true,
      driveType: 'AWD/4WD',
      emissionClass: 'Euro 6',
      emissionSticker: 'Green',
      particulateFilter: true,
      startStop: true,
      fuelConsumptionComb: 9.3,
      fuelConsumptionUrban: 11.2,
      fuelConsumptionExtraUrban: 7.8,
      co2Combined: 208.4,
      subcategory: 'Used vehicle',
      owners: '1',
      damaged: 'No',
      accidentDamaged: 'No',
      roadworthy: 'Yes',
      nonSmoking: true,
      inspectionMonth: 'May',
      inspectionYear: '2026',
      fullServiceHistory: true,
      warranty: true,
      priceBase: 67900,
      currency: '€',
      priceType: 'On request',
      city: 'Munich',
      country: 'Germany'
    }
  ]

  if (index === 0) return profiles[0]

  const base = profilePool[index % profilePool.length]
  return {
    make: base.make,
    model: base.model,
    year: num(2018, 2025),
    regMonth: pick(['January', 'March', 'May', 'July', 'September', 'November']),
    regYear: num(2019, 2025),
    regDate: '',
    mileage: Math.max(500, (base.mileageBase || 22000) + num(-6000, 14000)),
    engine: base.engine,
    fuel: base.fuel,
    transmission: base.transmission,
    emission: base.emission,
    conditionNotes: pick(['Well maintained and ready to drive', 'Dealer serviced with full history', 'Excellent condition with no major wear', 'Carefully used and fully inspected']),
    inspectionDate: '',
    category: base.category,
    doors: base.doors,
    slidingDoor: 'No',
    seats: base.seats,
    motorPower: base.motorPower,
    motorPowerUnit: base.motorPowerUnit,
    cubicCapacity: base.cubicCapacity,
    paddleShifters: bool(),
    driveType: base.driveType,
    emissionClass: base.emissionClass,
    emissionSticker: base.emissionSticker,
    particulateFilter: bool(),
    startStop: bool(),
    fuelConsumptionComb: base.fuel === 'Electric' ? 0 : Number((Math.random() * 4 + 5).toFixed(1)),
    fuelConsumptionUrban: base.fuel === 'Electric' ? 0 : Number((Math.random() * 4 + 6).toFixed(1)),
    fuelConsumptionExtraUrban: base.fuel === 'Electric' ? 0 : Number((Math.random() * 3 + 4).toFixed(1)),
    co2Combined: base.fuel === 'Electric' ? 0 : Number((Math.random() * 90 + 95).toFixed(1)),
    subcategory: base.subcategory,
    owners: String(num(1, 3)),
    damaged: 'No',
    accidentDamaged: 'No',
    roadworthy: 'Yes',
    nonSmoking: bool(),
    inspectionMonth: pick(['March', 'May', 'July', 'September', 'November']),
    inspectionYear: String(num(2025, 2027)),
    fullServiceHistory: bool(),
    warranty: bool(),
    priceBase: base.priceBase,
    currency: pick(currs),
    priceType: base.priceType,
    city: base.city,
    country: base.country
  }
}

function buildDescription(profile, profileName, title) {
  const paragraphs = [
    `${title} is a ${profile.conditionNotes.toLowerCase()}.`,
    `${fakerSentence()} Features include ${fakerFeatureList()}.`,
    `Contact the seller for more details about this ${profile.make} ${profile.model} located in ${profile.city}.`
  ]

  return [
    `${profile.year || 'New'} ${profile.make} ${profile.model}`,
    `${profile.engine}`,
    `${profile.motorPower}${profile.motorPowerUnit ? ` ${profile.motorPowerUnit}` : ''}`,
    `${profile.driveType}`,
    '',
    ...paragraphs,
    '',
    'Additional features',
    ...buildBulletLines(profileName)
  ].join('\n')
}

function fakerSentence() {
  return fakerApi ? fakerApi.lorem.sentence() : 'Well maintained car with excellent condition.'
}

function fakerFeatureList() {
  return fakerApi ? Array.from({ length: 3 }, () => fakerApi.hacker.phrase()).join(', ') : 'modern comfort, safety, and infotainment'
}

function buildBulletLines(profileName) {
  const items = [
    `${profileName} premium package`,
    '360 camera',
    'Navigation system',
    'Heated seats',
    'Apple CarPlay / Android Auto',
    'Keyless entry'
  ]
  return items.map(item => `- ${item}`)
}

function buildContact() {
  const country = pick(countries)
  const firstName = pick(['Alex', 'Nico', 'Emma', 'Sara', 'Luca', 'Mihai', 'Daniel', 'Anna', 'Elena', 'Sofia'])
  const lastName = pick(['Pop', 'Meyer', 'Smith', 'Reed', 'Boss', 'Ionescu', 'Wagner', 'Brown', 'Taylor', 'Nowak'])

  return {
    formOfAddress: pick(formOfAddresses),
    firstName,
    lastName,
    phone: String(num(700000000, 799999999)),
    countryCode: country.code,
    displayName: bool() ? 'yes' : 'no',
    street: fakerStreet(),
    number: String(num(1, 220)),
    zip: String(num(10000, 99999)),
    city: pick(['Berlin', 'Munich', 'Frankfurt', 'Bucharest', 'Dubai', 'London', 'Paris', 'Madrid', 'San Francisco']),
    country: country.name
  }
}

function fakerStreet() {
  const streets = ['Main Street', 'Park Avenue', 'Oak Road', 'Market Street', 'Central Boulevard', 'Sunset Drive', 'Bahnhofstrasse']
  return pick(streets)
}

function buildVehicle(profile) {
  return {
    make: profile.make,
    model: profile.model,
    year: profile.year,
    regMonth: profile.regMonth,
    regYear: profile.regYear,
    regDate: profile.regDate,
    mileage: profile.mileage + num(0, 5000),
    engine: profile.engine,
    fuel: profile.fuel,
    transmission: profile.transmission,
    emission: profile.emission,
    conditionNotes: profile.conditionNotes,
    inspectionDate: profile.inspectionDate,
    category: profile.category,
    doors: profile.doors,
    slidingDoor: profile.slidingDoor,
    seats: profile.seats,
    motorPower: profile.motorPower,
    motorPowerUnit: profile.motorPowerUnit,
    cubicCapacity: profile.cubicCapacity,
    paddleShifters: profile.paddleShifters,
    driveType: profile.driveType,
    emissionClass: profile.emissionClass,
    emissionSticker: profile.emissionSticker,
    particulateFilter: profile.particulateFilter,
    startStop: profile.startStop,
    fuelConsumptionComb: profile.fuelConsumptionComb,
    fuelConsumptionUrban: profile.fuelConsumptionUrban,
    fuelConsumptionExtraUrban: profile.fuelConsumptionExtraUrban,
    co2Combined: profile.co2Combined,
    subcategory: profile.subcategory,
    owners: profile.owners,
    damaged: profile.damaged,
    accidentDamaged: profile.accidentDamaged,
    roadworthy: profile.roadworthy,
    nonSmoking: profile.nonSmoking,
    inspectionMonth: profile.inspectionMonth,
    inspectionYear: profile.inspectionYear,
    fullServiceHistory: profile.fullServiceHistory,
    warranty: profile.warranty
  }
}

async function buildAdDocument(index, ownerId) {
  const profile = buildProfile(index)
  const profileName = `${profile.make} ${profile.model}`
  const title = `${fakerTitlePrefix()} ${profileName} ${fakerTitleSuffix()}`
  const price = String(Math.max(2500, profile.priceBase + num(-5000, 12000)))
  const images = await seedImages(4)

  return {
    vehicle: buildVehicle(profile),
    equipment: buildEquipment(profileName),
    details: {
      title,
      description: buildDescription(profile, profileName, title),
      price,
      images,
      priceType: profile.priceType,
      currency: profile.currency
    },
    contact: buildContact(),
    images,
    owner: ownerId,
    createdAt: new Date()
  }
}

function fakerTitlePrefix() {
  return pick(['Excellent', 'Premium', 'Luxury', 'Clean', 'Well maintained', 'Top condition', 'Low mileage'])
}

function fakerTitleSuffix() {
  return pick(['for sale', 'ready to drive', 'with warranty', 'dealer maintained', 'full service history', 'special offer'])
}

async function ensureUsers(faker, targetCount = BATCH_USERS) {
  const users = await User.find({}).sort({ createdAt: 1 })
  let attempt = 0

  while (users.length < targetCount) {
    attempt += 1
    const firstName = faker.person.firstName()
    const lastName = faker.person.lastName()
    const email = `seed.${firstName.toLowerCase()}.${lastName.toLowerCase()}.${Date.now()}.${attempt}@example.com`.replace(/[^a-z0-9.@_-]/g, '')
    const username = `${firstName} ${lastName} ${Date.now()} ${attempt}`
    const exists = await User.findOne({ email })
    if (exists) continue

    const password = await bcrypt.hash(PASSWORD, 10)
    try {
      const user = await User.create({ username, email, password, ads: [] })
      users.push(user)
    } catch (err) {
      if (err && err.code === 11000) continue
      throw err
    }
  }

  return users
}

async function ensureAds(users) {
  if (!users || !users.length) {
    users = await User.find({}).sort({ createdAt: 1 })
  }

  if (!users.length) {
    const password = await bcrypt.hash(PASSWORD, 10)
    const fallback = await User.create({ username: 'seed-fallback', email: `seed.fallback.${Date.now()}@example.com`, password, ads: [] })
    users.push(fallback)
  }

  const currentAds = await Ad.find({}).sort({ createdAt: 1 })
  const existingCount = currentAds.length
  const remaining = Math.max(0, BATCH_ADS - existingCount)
  if (remaining <= 0) return 0

  // determine user count to fit 50-100 ads per user
  const minUsers = Math.ceil(remaining / 100)
  const maxUsers = Math.floor(remaining / 50) || minUsers
  const preferred = Math.ceil(remaining / 75)
  let userCount = Math.min(BATCH_USERS, Math.max(minUsers, Math.min(maxUsers, preferred)))

  // ensure we have enough users
  if (users.length < userCount) {
    const toCreate = userCount - users.length
    let attempt = 0
    for (let i = 0; i < toCreate; i++) {
      attempt += 1
      const firstName = `Dealer${Date.now()}${i}`
      const email = `seed.dealer.${Date.now()}.${attempt}@example.com`
      const password = await bcrypt.hash(PASSWORD, 10)
      const u = await User.create({ username: `seed-dealer-${Date.now()}-${i}`, email, password, ads: [] })
      users.push(u)
    }
  }

  // allocate base 50 per user and distribute extra
  const base = 50
  const targets = Array(userCount).fill(base)
  let allocated = base * userCount
  let extra = remaining - allocated
  let idx = 0
  while (extra > 0) {
    const add = Math.min(50, extra, Math.floor(Math.random() * 51))
    targets[idx % userCount] += add
    extra -= add
    idx++
  }

  // create ads
  let created = 0
  let globalIndex = existingCount
  for (let u = 0; u < userCount; u++) {
    const owner = users[u]
    const ownerId = owner._id || owner
    const toMake = Math.max(0, Math.min(targets[u], remaining - created))
    for (let j = 0; j < toMake; j++) {
      try {
        const payload = await buildAdDocument(globalIndex + j, ownerId)
        const ad = await Ad.create(payload)
        try {
          if (owner.ads && !owner.ads.some(existingId => String(existingId) === String(ad._id))) {
            owner.ads.push(ad._id)
            if (typeof owner.save === 'function') await owner.save()
            else await User.updateOne({ _id: owner._id }, { $addToSet: { ads: ad._id } })
          }
        } catch (relErr) {
          console.warn('Warning: failed to attach ad to owner record', relErr && relErr.message)
        }

        created += 1
        if (created % 500 === 0) console.log(`Inserted ${created} new ads (DB total approx ${existingCount + created})`)
      } catch (err) {
        console.error('Failed creating ad for owner', ownerId, err && err.message)
      }
    }
    globalIndex += toMake
    if (created >= remaining) break
  }

  return created
}

async function seed() {
  const { faker } = await import('@faker-js/faker')
  fakerApi = faker

  try {
    await mongoose.connect(MONGO_URI, { dbName: DB_NAME })
    console.log(`Connected to ${MONGO_URI} / ${DB_NAME}`)

    const existingUsers = await User.countDocuments()
    const existingAds = await Ad.countDocuments()

    // Determine how many ads remain to create
    const remainingAds = Math.max(0, BATCH_ADS - existingAds)
    if (remainingAds === 0) {
      console.log('No additional ads required. Exiting seeder.')
    } else {
      // compute minimal users needed so each user can have between 50 and 100 ads
      const minUsersNeeded = Math.ceil(remainingAds / 100)
      const maxUsersAllowed = Math.min(BATCH_USERS, Math.ceil(remainingAds / 50))

      const targetUsers = Math.max(minUsersNeeded, Math.min(BATCH_USERS, maxUsersAllowed || minUsersNeeded))

      const users = await ensureUsers(faker, targetUsers)
      const insertedAds = await ensureAds(users)

      const finalUsers = await User.countDocuments()
      const finalAds = await Ad.countDocuments()

      console.log(`Seeder finished. Added users: ${finalUsers - existingUsers}, ads: ${finalAds - existingAds}.`)
      console.log(`Database totals: users ${existingUsers} -> ${finalUsers}, ads ${existingAds} -> ${finalAds}.`)
    }
  } finally {
    await mongoose.disconnect().catch(() => {})
  }
}

seed().catch(err => {
  console.error('Seeder failed:', err)
  process.exit(1)
})
