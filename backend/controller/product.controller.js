const Brand = require("../model/Brand");
const Category = require("../model/Category");
const productServices = require("../services/product.service");
const Product = require("../model/Products");
const XLSX = require("xlsx");


// add product
exports.addProduct = async (req, res,next) => {

  try {
    const firstItem = {
      color: {
        name:'',
        clrCode:''
      },
      img: req.body.img,
    };
    // Ensure imageURLs is an array
    const additionalImages = Array.isArray(req.body.imageURLs) ? req.body.imageURLs : [];
    const imageURLs = [firstItem, ...additionalImages];
    
    const result = await productServices.createProductService({
      ...req.body,
      imageURLs: imageURLs,
    });

    res.status(200).json({
      success:true,
      status: "success",
      message: "Product created successfully!",
      data: result,
    });
  } catch (error) {
    console.error('Error in addProduct:', error);
    next(error)
  }
};


// add all product
module.exports.addAllProducts = async (req,res,next) => {
  try {
    const result = await productServices.addAllProductService(req.body);
    res.json({
      message:'Products added successfully',
      result,
    })
  } catch (error) {
    next(error)
  }
}

// get all products
exports.getAllProducts = async (req,res,next) => {
  try {
    const result = await productServices.getAllProductsService();
    res.status(200).json({
      success:true,
      data:result,
    })
  } catch (error) {
    next(error)
  }
}

// get all products by type
module.exports.getProductsByType = async (req,res,next) => {
  try {
    const result = await productServices.getProductTypeService(req);
    res.status(200).json({
      success:true, 
      data:result,
    })
  } catch (error) {
    console.log(error)
    next(error)
  }
}

// get offer product controller
module.exports.getOfferTimerProducts = async (req,res,next) => {
  try {
    const result = await productServices.getOfferTimerProductService(req.query.type);
    res.status(200).json({
      success:true, 
      data:result,
    })
  } catch (error) {
    next(error)
  }
}

// get Popular Product By Type
module.exports.getPopularProductByType = async (req,res,next) => {
  try {
    const result = await productServices.getPopularProductServiceByType(req.params.type);
    res.status(200).json({
      success:true, 
      data:result,
    })
  } catch (error) {
    next(error)
  }
}

// get top rated Products
module.exports.getTopRatedProducts = async (req,res,next) => {
  try {
    const result = await productServices.getTopRatedProductService();
    res.status(200).json({
      success:true, 
      data:result,
    })
  } catch (error) {
    next(error)
  }
}

// getSingleProduct
exports.getSingleProduct = async (req,res,next) => {
  try {
    if (!req.params.id) {
      console.error("Product ID is required");
      return res.status(400).json({
        success: false,
        message: "Product ID is required"
      });
    }
    console.log(req.params.id);
    const product = await Product.findById(req.params.id).populate({
      path: "reviews",
      populate: { path: "userId", select: "name email imageURL" },
    });
    
    if (!product) {
      console.warn(`Product not found for ID: ${req.params.id}`);
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }
    res.json(product)
  } catch (error) {
    next(error)
  }
}

// get Related Product
exports.getRelatedProducts = async (req,res,next) => {
  try {
    const products = await productServices.getRelatedProductService(req.params.id)
    res.status(200).json({
      success:true, 
      data:products,
    })
  } catch (error) {
    next(error)
  }
}

// update product
exports.updateProduct = async (req, res,next) => {
  try {
    const product = await productServices.updateProductService(req.params.id,req.body)
    res.send({ data: product, message: "Product updated successfully!" });
  } catch (error) {
    next(error)
  }
};

// update product
exports.reviewProducts = async (req, res,next) => {
  try {
    const products = await productServices.getReviewsProducts()
    res.status(200).json({
      success:true, 
      data:products,
    })
  } catch (error) {
    next(error)
  }
};

// update product
exports.stockOutProducts = async (req, res,next) => {
  try {
    const products = await productServices.getStockOutProducts();
    res.status(200).json({
      success:true, 
      data:products,
    })
  } catch (error) {
    next(error)
  }
};

// update product
exports.deleteProduct = async (req, res,next) => {
  try {
    await productServices.deleteProduct(req.params.id);
    res.status(200).json({
      message:'Product delete successfully'
    })
  } catch (error) {
    next(error)
  }
};

// Export products to CSV/Excel
exports.exportProducts = async (req, res, next) => {
  try {
    const format = req.query.format || 'xlsx'; // 'xlsx' or 'csv'
    const products = await Product.find({})
      .populate('brand.id', 'name')
      .populate('category.id', 'parent')
      .lean();

    // Prepare data for export
    const exportData = products.map(product => ({
      'Title': product.title || '',
      'SKU': product.sku || '',
      'Price': product.price || 0,
      'Discount (%)': product.discount || 0,
      'Quantity': product.quantity || 0,
      'Unit': product.unit || '',
      'Status': product.status || '',
      'Product Type': product.productType || '',
      'Brand Name': product.brand?.name || product.brand?.name || '',
      'Category Parent': product.category?.name || product.category?.name || '',
      'Category Children': product.children || '',
      'Description': product.description || '',
      'Main Image URL': product.img || '',
      'Ingredients': product.ingredients || '',
      'How to Use': product.howToUse || '',
      'Key Benefits': Array.isArray(product.keyBenefits) ? product.keyBenefits.join('; ') : '',
      'Tags': Array.isArray(product.tags) ? product.tags.join(', ') : '',
      'Sizes': Array.isArray(product.sizes) ? product.sizes.join(', ') : '',
    }));

    if (format === 'csv') {
      // Convert to CSV
      const worksheet = XLSX.utils.json_to_sheet(exportData);
      const csv = XLSX.utils.sheet_to_csv(worksheet);
      
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename=products_${Date.now()}.csv`);
      res.send(csv);
    } else {
      // Convert to Excel
      const worksheet = XLSX.utils.json_to_sheet(exportData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Products');
      
      // Generate buffer
      const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
      
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', `attachment; filename=products_${Date.now()}.xlsx`);
      res.send(buffer);
    }
  } catch (error) {
    console.error('Export error:', error);
    next(error);
  }
};

// Import products from CSV/Excel
exports.importProducts = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    const file = req.file;
    const workbook = XLSX.read(file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(worksheet);

    if (data.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No data found in file'
      });
    }

    const results = {
      success: 0,
      failed: 0,
      errors: []
    };

    // Get all brands and categories for lookup
    const brands = await Brand.find({});
    const categories = await Category.find({});
    
    const brandMap = new Map(brands.map(b => [b.name.toLowerCase(), b]));
    const categoryMap = new Map(categories.map(c => [c.parent.toLowerCase(), c]));

    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      try {
        // Required fields validation
        if (!row['Title'] || !row['Price'] || !row['Brand Name'] || !row['Category Parent']) {
          results.failed++;
          results.errors.push(`Row ${i + 2}: Missing required fields (Title, Price, Brand Name, Category Parent)`);
          continue;
        }

        // Find brand
        const brandName = String(row['Brand Name']).trim();
        const brand = brandMap.get(brandName.toLowerCase());
        if (!brand) {
          results.failed++;
          results.errors.push(`Row ${i + 2}: Brand "${brandName}" not found. Please create the brand first.`);
          continue;
        }

        // Find category
        const categoryName = String(row['Category Parent']).trim();
        const category = categoryMap.get(categoryName.toLowerCase());
        if (!category) {
          results.failed++;
          results.errors.push(`Row ${i + 2}: Category "${categoryName}" not found. Please create the category first.`);
          continue;
        }

        // Prepare product data
        const productData = {
          title: String(row['Title']).trim(),
          sku: row['SKU'] ? String(row['SKU']).trim() : undefined,
          price: parseFloat(row['Price']) || 0,
          discount: row['Discount (%)'] ? parseFloat(row['Discount (%)']) : 0,
          quantity: parseInt(row['Quantity']) || 0,
          unit: String(row['Unit'] || '1pc').trim(),
          status: row['Status'] || 'in-stock',
          productType: row['Product Type'] || 'electronics',
          brand: {
            name: brand.name,
            id: brand._id
          },
          category: {
            name: category.parent,
            id: category._id
          },
          parent: category.parent,
          children: row['Category Children'] ? String(row['Category Children']).trim() : (Array.isArray(category.children) && category.children.length > 0 ? category.children[0] : ''),
          description: row['Description'] ? String(row['Description']).trim() : '',
          img: row['Main Image URL'] ? String(row['Main Image URL']).trim() : '',
          ingredients: row['Ingredients'] ? String(row['Ingredients']).trim() : undefined,
          howToUse: row['How to Use'] ? String(row['How to Use']).trim() : undefined,
          keyBenefits: row['Key Benefits'] ? String(row['Key Benefits']).split(';').map(b => b.trim()).filter(b => b) : [],
          tags: row['Tags'] ? String(row['Tags']).split(',').map(t => t.trim()).filter(t => t) : [],
          sizes: row['Sizes'] ? String(row['Sizes']).split(',').map(s => s.trim()).filter(s => s) : [],
          imageURLs: []
        };

        // Validate main image
        if (!productData.img) {
          results.failed++;
          results.errors.push(`Row ${i + 2}: Main Image URL is required`);
          continue;
        }

        // Create product
        await productServices.createProductService(productData);
        results.success++;
      } catch (error) {
        results.failed++;
        results.errors.push(`Row ${i + 2}: ${error.message}`);
      }
    }

    res.status(200).json({
      success: true,
      message: `Import completed. ${results.success} products imported, ${results.failed} failed.`,
      data: {
        success: results.success,
        failed: results.failed,
        errors: results.errors.slice(0, 20) // Limit errors to first 20
      }
    });
  } catch (error) {
    console.error('Import error:', error);
    next(error);
  }
};
