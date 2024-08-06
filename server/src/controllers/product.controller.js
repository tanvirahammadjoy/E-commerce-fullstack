const Product = require('../models/product.models');
const ApiError = require('../utils/apiError');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');
const cloudinary = require('../utils/cloudinary');
const fs = require('fs');

// Create a new product
exports.createProduct = asyncHandler(async (req, res, next) => {
  const { name, description, price, category, stock } = req.body;
  const imageFile = req.file;

  let imageUrl = '';
  let imagePublicId = '';

  if (imageFile) {
    try {
      const uploadResult = await cloudinary.uploader.upload(imageFile.path, {
        folder: 'products',
      });
      imageUrl = uploadResult.secure_url;
      imagePublicId = uploadResult.public_id;
      fs.unlinkSync(imageFile.path); // Remove the file from local storage
    } catch (error) {
      return next(
        ApiError.internal('Failed to upload product image to Cloudinary')
      );
    }
  }

  const newProduct = new Product({
    name,
    description,
    price,
    category,
    stock,
    image: imageUrl,
    imagePublicId: imagePublicId,
  });

  await newProduct.save();

  new ApiResponse(
    201,
    { product: newProduct },
    'Product created successfully'
  ).send(res);
});

// Update a product
exports.updateProduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { name, description, price, category, stock } = req.body;
  const imageFile = req.file;

  const product = await Product.findById(id);
  if (!product) {
    return next(ApiError.notFound('Product not found'));
  }

  let imageUrl = product.image;
  let imagePublicId = product.imagePublicId;

  if (imageFile) {
    if (imagePublicId) {
      await cloudinary.uploader.destroy(imagePublicId);
    }
    try {
      const uploadResult = await cloudinary.uploader.upload(imageFile.path, {
        folder: 'products',
      });
      imageUrl = uploadResult.secure_url;
      imagePublicId = uploadResult.public_id;
      fs.unlinkSync(imageFile.path); // Remove the file from local storage
    } catch (error) {
      return next(
        ApiError.internal('Failed to upload product image to Cloudinary')
      );
    }
  }

  product.name = name ?? product.name;
  product.description = description ?? product.description;
  product.price = price ?? product.price;
  product.category = category ?? product.category;
  product.stock = stock ?? product.stock;
  product.image = imageUrl;
  product.imagePublicId = imagePublicId;

  await product.save();

  new ApiResponse(200, { product }, 'Product updated successfully').send(res);
});

// Delete a product
exports.deleteProduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const product = await Product.findById(id);

  if (!product) {
    return next(ApiError.notFound('Product not found'));
  }

  if (product.imagePublicId) {
    try {
      await cloudinary.uploader.destroy(product.imagePublicId);
    } catch (error) {
      return next(
        ApiError.internal('Failed to delete product image from Cloudinary')
      );
    }
  }

  await Product.findByIdAndDelete(id);

  new ApiResponse(200, null, 'Product deleted successfully').send(res);
});

// Get all products
exports.getProducts = asyncHandler(async (req, res, next) => {
  const products = await Product.find();
  new ApiResponse(200, { products }, 'Products fetched successfully').send(res);
});

// Get a product by ID
exports.getProductById = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const product = await Product.findById(id);

  if (!product) {
    return next(ApiError.notFound('Product not found'));
  }

  new ApiResponse(200, { product }, 'Product fetched successfully').send(res);
});
