
const categoryModel = require("../models/category.model");
const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");
const courseModel = require("../models/course.model");

function getRandomInt(max) {
  return Math.floor(Math.random() * max)
}
 
//createCategory
exports.createCategory = asyncHandler( async(req, res)=>{

    const {name, description} = req.body;

    if(!name ){
      return res. ApiError(401, "All fields are reuired")
    }

    const CategoryDetails = await categoryModel.create ({
        name: name,
        description: description
    });



    return res.status(200)
    .json( new ApiResponse(200, CategoryDetails, "Category created succesfully") )

    
})


//showAllCategory
exports.showAllCategories = asyncHandler( async(req,res)=>{

    const AllCategory = await categoryModel.find({},{name:true, description:true})

    if(!AllCategory){
      return res. ApiError(401, "Unable to get Category")
    }

    return res.status(200)
    .json( new ApiResponse(200,AllCategory, "Get All Category succesfully"))
})



//CategoryPageDetails
exports.categoryPageDetails = asyncHandler(async (req, res) => {
  const { categoryId } = req.body;
 

  try {
    // Validate input
    if (!categoryId) {
      return res. ApiError(400, "Category ID is required")
    }

    // Fetch the selected category with published courses
    const selectedCategory = await categoryModel.findById(categoryId)
      .populate({
        path: "courses",
        match: { status: "Published" },
        populate: [{ path: "ratingAndreviews" }, { path: "instructor" }],
      });



    if (!selectedCategory) {
      return res. ApiError(404, "Category not found")
    }

    if (selectedCategory.courses.length === 0) {
        return res. ApiError(404, "No published courses found for the selected category")
    }

    // Fetch all other categories except the selected one
    const categoriesExceptSelected = await categoryModel.find({
      _id: { $ne: categoryId },
    });

    let differentCategory = null;

    // Fetch random category only if other categories exist
    if (categoriesExceptSelected.length > 0) {
      const randomIndex = getRandomInt(categoriesExceptSelected.length);
      differentCategory = await categoryModel.findById(
        categoriesExceptSelected[randomIndex]._id
      )
        .populate({
          path: "courses",
          match: { status: "Published" },
          populate: [{ path: "ratingAndreviews" }, { path: "instructor" }],
        });
    }

 
    // Fetch top-selling courses across all categories using aggregation
    const mostSellingCourses = await courseModel
      .find({ status: "Published" })
      .sort({ sold: -1 }) 
      .limit(10) 
      .populate([{ path: "ratingAndreviews" }, { path: "instructor" }]);



    // Construct and return the response
    return res
      .status(200)
      .json(
        new ApiResponse(200, {
          selectedCategory,
          differentCategory,
          mostSellingCourses,
        },
      "Category details fetched successfully")
      );
  } 
  catch (error) {
    console.error("Error fetching category details:", error);
    return res. ApiError(500, "An error occurred while fetching category details")
  }
});



//deleteCategory
exports.deleteCategory = async (req, res) => {
  try {
    // get categoryId
    const { categoryId } = req.body;

    // get corresponding courses of category
    const selectedCategory = await categoryModel.findById(categoryId);

    // validation
    if (!selectedCategory) {
        return res. ApiError(401, "selectedCategory not found")
    }

    await courseModel.findByIdAndDelete(
      { category: categoryId },
      { $pullAll: { category: { $in: selectedCategory } } }
    );

    await categoryModel.findOneAndDelete({ _id: categoryId });
    // return response
    return res.status(200)
    .json(200, "Delete category Succesfully");

  }
   catch (err) {
    console.log(err);
      return res. ApiError(500, "An error occurred while deleting category ")
  }
};



//updateCategory
exports.updateCategory = async (req, res) => {
  try {
    // Fetch data from request body
    const { categoryId, name, description } = req.body;

    // Validation: Ensure categoryId is provided
    if (!categoryId) {
      return res. ApiError(400, "Category ID is required.")
    }

    // Validate: At least one field to update
    if (!name && !description) {
      return res. ApiError(400, "Please provide at least one field to update (name or description).")
    }

    // Find and update the category
    const categoryDetails = await categoryModel.findByIdAndUpdate(
      categoryId,
      { ...(name && { name }), ...(description && { description }) }, // Update only provided fields
      { new: true, runValidators: true } // Return updated document and enforce schema validation
    );

    // If category does not exist
    if (!categoryDetails) {
      return res. ApiError(404, "Category not found.")
    }

    // Return success response
    return res.status(200).json(
      new ApiResponse(200, "Category updated successfully.", categoryDetails)
    );
    
  } 
  catch (err) {
    return res. ApiError(500,"An unexpected error occurred while updating the category.",  err.message)
  }
};


