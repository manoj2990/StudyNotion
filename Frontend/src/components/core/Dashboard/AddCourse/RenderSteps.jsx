

import { FaCheck } from "react-icons/fa"
import { useSelector } from "react-redux"
import React from "react"; 
import CourseBuilderForm from "./CourseBuilder/CourseBuilderForm"
import CourseInformationForm from "./CourseInformation/CourseInformationForm"
import PublishCourse from "./PublishCourse"



export default function RenderSteps() {

  const { currentstep } = useSelector((state) => state.course)

  const steps = [
    {
      id: 1,
      title: "Course Information",
    },
    {
      id: 2,
      title: "Course Builder",
    },
    {
      id: 3,
      title: "Publish",
    },
  ]


  
  return (
    <>
    {/*specific steps design based on current form */}
      <div className="relative mb-2 flex w-full justify-center">
        {steps?.map((item) => (
           <React.Fragment key={item.id}>
            <div
              className="flex flex-col items-center "
              key={item.id}
            >
              <button
                className={`grid cursor-default aspect-square w-[34px] place-items-center rounded-full border-[1px] ${
                  currentstep === item.id
                    ? "border-yellow-50 bg-yellow-900 text-yellow-50"
                    : "border-richblack-700 bg-richblack-800 text-richblack-300"
                } ${currentstep > item.id && "bg-yellow-50 text-yellow-50"}} `}
              >
                {currentstep > item.id ? (
                  <FaCheck className="font-bold text-richblack-900" />
                ) : (
                  item.id
                )}
              </button>
              
            </div>
            {item.id !== steps.length && (
              <>
                <div
                  className={`h-[calc(34px/2)] w-[33%]  border-dashed border-b-2 ${
                    currentstep > item.id  ? "border-yellow-50" : "border-richblack-500"
                } `}
                ></div>
              </>
            )}
         </React.Fragment>

        ))}
      </div>

      {/*steps title*/}
      <div className="relative mb-16 flex w-full select-none justify-between">
        {steps.map((item) => (
          <React.Fragment key={item.id}>
            <div
              className="flex min-w-[130px] flex-col items-center gap-y-2"
              // key={item.id}
            >
              
              <p
                className={`text-sm ${
                  currentstep >= item.id ? "text-richblack-5" : "text-richblack-500"
                }`}
              >
                {item.title}
              </p>
            </div>
            
            </React.Fragment>
        ))}
      </div>

      {/* Render specific component based on current step */}
      {currentstep === 1 && <CourseInformationForm />}
       {currentstep === 2 && <CourseBuilderForm />}
      {currentstep === 3 && <PublishCourse />} 
    </>
  )
}
