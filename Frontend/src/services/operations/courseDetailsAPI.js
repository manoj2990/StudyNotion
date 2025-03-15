import { toast } from "react-hot-toast"

import { updateCompletedLectures } from "../../slices/viewCourseSlice"
// import { setLoading } from "../../slices/profileSlice";
import { apiConnector } from "../apiConnector"
import { courseEndpoints } from "../apis"

const {
  COURSE_DETAILS_API,
  COURSE_CATEGORIES_API,
  GET_ALL_COURSE_API,
  CREATE_COURSE_API,
  EDIT_COURSE_API,
  CREATE_SECTION_API,
  CREATE_SUBSECTION_API,
  UPDATE_SECTION_API,
  UPDATE_SUBSECTION_API,
  DELETE_SECTION_API,
  DELETE_SUBSECTION_API,
  GET_ALL_INSTRUCTOR_COURSES_API,
  DELETE_COURSE_API,
  GET_FULL_COURSE_DETAILS_AUTHENTICATED,
  CREATE_RATING_API,
  LECTURE_COMPLETION_API,
} = courseEndpoints





export const getAllCourses = async () => {
  const toastId = toast.loading("Loading...")
  let result = []
  try {
    const response = await apiConnector("GET", GET_ALL_COURSE_API)
    if (!response?.data?.success) {
      throw new Error("Could Not Fetch Course Categories")
    }
    result = response?.data?.data
  } catch (error) {
   
    toast.error(error.message)
  }
  toast.dismiss(toastId)
  return result
}




export const fetchCourseDetails = async (courseId) => {

  const toastId = toast.loading("Loading...")
  //   dispatch(setLoading(true));

  let result = null
  try {
    const response = await apiConnector("POST", COURSE_DETAILS_API, {
      courseId,
    })
   

    if (!response.data.success) {
      throw new Error(response.data.message)
    }

    result = response?.data
    
  } catch (error) {
    
    result = error.response.data
    // toast.error(error.response.data.message);
  }

  toast.dismiss(toastId)
  //   dispatch(setLoading(false));
  return result
}




// fetching the available course categories
export const fetchCourseCategories = async () => {

  let result = []
  try {
    const response = await apiConnector("GET", COURSE_CATEGORIES_API)
    
    if (!response?.data?.success) {
      throw new Error("Could Not Fetch Course Categories")
    }

    result = response?.data?.data

  } catch (error) {
    
    toast.error(error.message)
  }
  
  return result
}




// add the course details
export const addCourseDetails = async (data, token) => {
  let result = null
  const toastId = toast.loading("Loading...")
  try {
    const response = await apiConnector("POST", CREATE_COURSE_API, data, {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    })
   
    if (!response?.data?.success) {
      throw new Error("Could Not Add Course Details")
    }
    toast.success("Course Details Added Successfully")
    result = response?.data?.data
  } catch (error) {
    
    toast.error(error.message)
  }
  toast.dismiss(toastId)
  return result
}




// edit the course details
export const editCourseDetails = async (data, token) => {
  let result = null
  const toastId = toast.loading("Loading...")
  try {
    const response = await apiConnector("POST", EDIT_COURSE_API, data, {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    })
    
    if (!response?.data?.success) {
      throw new Error("Could Not Update Course Details")
    }
    toast.success("Course Details Updated Successfully")
    result = response?.data?.data
  } catch (error) {
    
    toast.error(error.message)
  }
  toast.dismiss(toastId)
  return result
}

// create a section
export const createSection = async (data, token) => {
  let result = null
  const toastId = toast.loading("Loading...")
  try {
    const response = await apiConnector("POST", CREATE_SECTION_API, data, {
      Authorization: `Bearer ${token}`,
    })
    
    if (!response?.data?.success) {
      throw new Error("Could Not Create Section")
    }
    toast.success("Course Section Created")
    
    result = response?.data?.data
  } catch (error) {
   
    toast.error(error.message)
  }
  toast.dismiss(toastId)
  return result
}




// create a subsection
export const createSubSection = async (data, token) => {
  let result = null
  const toastId = toast.loading("Loading...")
  try {
    const response = await apiConnector("POST", CREATE_SUBSECTION_API, data, {
      Authorization: `Bearer ${token}`,
    })
    
    if (!response?.data?.success) {
      throw new Error("Could Not Add Lecture")
    }
    toast.success("Lecture Added")
    result = response?.data?.data
  } catch (error) {
    
    toast.error(error.message)
  }
  toast.dismiss(toastId)
  return result
}




// update a section
export const updateSection = async (data, token) => {
  let result = null
  const toastId = toast.loading("Loading...")
  try {
    const response = await apiConnector("POST", UPDATE_SECTION_API, data, {
      Authorization: `Bearer ${token}`,
    })
   
    if (!response?.data?.success) {
      throw new Error("Could Not Update Section")
    }
    toast.success("Course Section Updated")
    result = response?.data?.data
  } catch (error) {
    
    toast.error(error.message)
  }
  toast.dismiss(toastId)
  return result
}



// update a subsection
export const updateSubSection = async (data, token) => {
  let result = null
  const toastId = toast.loading("Loading...")
  try {
    const response = await apiConnector("POST", UPDATE_SUBSECTION_API, data, {
      Authorization: `Bearer ${token}`,
    })

    if (!response?.data?.success) {
      throw new Error("Could Not Update Lecture")
    }
    toast.success("Lecture Updated")
    result = response?.data?.data
  } catch (error) {
    
    toast.error(error.message)
  }
  toast.dismiss(toastId)
  return result
}



// delete a section
export const deleteSection = async (data, token) => {
  let result = null
  const toastId = toast.loading("Loading...")
  try {
    const response = await apiConnector("POST", DELETE_SECTION_API, data, {
      Authorization: `Bearer ${token}`,
    })
   
    if (!response?.data?.success) {
      throw new Error("Could Not Delete Section")
    }
    toast.success("Course Section Deleted")
    result = response?.data?.data
  } catch (error) {
   
    toast.error(error.message)
  }
  toast.dismiss(toastId)
  return result
}


// delete a subsection
export const deleteSubSection = async (data, token) => {
  
  let result = null
  const toastId = toast.loading("Loading...")
  try {
    const response = await apiConnector("POST", DELETE_SUBSECTION_API, data, {
      Authorization: `Bearer ${token}`,
    })
    
    if (!response?.data?.success) {
      throw new Error("Could Not Delete Lecture")
    }
    toast.success("Lecture Deleted")
    result = response?.data?.data
  } catch (error) {
    
    toast.error(error.message)
  }
  toast.dismiss(toastId)
  return result
}



// fetching all courses under a specific instructor
export const fetchInstructorCourses = async (token) => {
  
  let result = null;
  
  const toastId = toast.loading("Loading...")
  try {
    const response = await apiConnector(
      "GET",
      GET_ALL_INSTRUCTOR_COURSES_API,
      null,
      {
        Authorization: `Bearer ${token}`,
      }
    )
   
    if (!response?.data?.success) {
      throw new Error("Could Not Fetch Instructor Courses")
    }
    result = response?.data?.data
  } catch (error) {
    
    toast.error(error.message)
  }
  toast.dismiss(toastId)
  return result
}



// delete a course
export const deleteCourse = async (data, token) => {
 
  const toastId = toast.loading("Loading...")
  try {
    const response = await apiConnector("DELETE", "http://localhost:4000/api/v1/course/deleteCourse", data, {
      Authorization: `Bearer ${token}`,
    })
   
    if (!response?.data?.success) {
      throw new Error("Could Not Delete Course")
    }
    toast.success("Course Deleted")
  } catch (error) {

    toast.error(error.message)
  }
  toast.dismiss(toastId)
}



// get full details of a course
export const getFullDetailsOfCourse = async (courseId, token) => {
  const toastId = toast.loading("Loading...")
  //   dispatch(setLoading(true));
  let result = null
  try {
    const response = await apiConnector(
      "POST",
      GET_FULL_COURSE_DETAILS_AUTHENTICATED,
      {
        courseId,
      },
      {
        Authorization: `Bearer ${token}`,
      }
    )
    

    if (!response.data.success) {
      throw new Error(response.data.message)
    }
    result = response?.data?.data
  } catch (error) {

    result = error.response.data
    // toast.error(error.response.data.message);
  }
  toast.dismiss(toastId)
  //   dispatch(setLoading(false));
  return result
}



// mark a lecture as complete
export const markLectureAsComplete = async (data, token) => {
  let result = null
 
  const toastId = toast.loading("Loading...")
  try {
    const response = await apiConnector("POST", LECTURE_COMPLETION_API, data, {
      Authorization: `Bearer ${token}`,
    })
   

    if (!response.data.message) {
      throw new Error(response.data.error)
    }
    toast.success("Lecture Completed")
    result = true
  } catch (error) {
  
    toast.error(error.message)
    result = false
  }
  toast.dismiss(toastId)
  return result
}



// create a rating for course
export const createRating = async (data, token) => {
  const toastId = toast.loading("Loading...")
  let success = false
  try {
    const response = await apiConnector("POST", CREATE_RATING_API, data, {
      Authorization: `Bearer ${token}`,
    })
   
    if (!response?.data?.success) {
      throw new Error("Could Not Create Rating")
    }
    toast.success("Rating Created")
    success = true
  } catch (error) {
    success = false
   
    toast.error(error.message)
  }
  toast.dismiss(toastId)
  return success
}
