import React, { useEffect, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate, useParams } from "react-router-dom"

import "video-react/dist/video-react.css"
import { useLocation } from "react-router-dom"
import { BigPlayButton, Player } from "video-react"

import { markLectureAsComplete } from "../../../services/operations/courseDetailsAPI"
import { updateCompletedLectures } from "../../../slices/viewCourseSlice"
import IconBtn from "../../common/IconBtn"

const VideoDetails = () => {
  const { courseId, sectionId, subSectionId } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const playerRef = useRef(null)
  const dispatch = useDispatch()
  const { token } = useSelector((state) => state.auth)
  const { courseSectionData, courseEntireData, completedLectures } =
    useSelector((state) => state.viewCourse)

  const [videoData, setVideoData] = useState([])
  const [previewSource, setPreviewSource] = useState("")
  const [videoEnded, setVideoEnded] = useState(false)
  const [loading, setLoading] = useState(false)


  useEffect(() => {
    ;(async () => {
      if (!courseSectionData.length) return

      if (!courseId && !sectionId && !subSectionId) {
        navigate(`/dashboard/enrolled-courses`)
      } else {
        //course section ke data --> current section ka data
        const filteredSectionData = courseSectionData.filter(
          (section) => section._id === sectionId
        )
        
        //current section data --> current subSection extract karo
        const filteredVideoData = filteredSectionData?.[0]?.subSection.filter(
          (data) => data._id === subSectionId
        )
        //video that we show on ui
        setVideoData(filteredVideoData[0]) 
        setPreviewSource(courseEntireData?.thumbnail)
        setVideoEnded(false)
      }
    })()
  }, [courseSectionData, courseEntireData, location.pathname])


  // check if the lecture is the first video of the course
  const isFirstVideo = () => {
    //current section ka index
    const currentSectionIndx = courseSectionData.findIndex(
      (data) => data._id === sectionId
    )
    //current subsection ka index from section wala aaray of obj
    const currentSubSectionIndx = courseSectionData[
      currentSectionIndx
    ].subSection.findIndex((data) => data._id === subSectionId)

    //currentSectionIndx & currentSubSectionIndx === 0 means 1st section ki 1st video 
    if (currentSectionIndx === 0 && currentSubSectionIndx === 0) {
      return true
    } else {
      return false
    }
  }


  // go to the next video
  const goToNextVideo = () => {
    

    const currentSectionIndx = courseSectionData.findIndex(
      (data) => data?._id === sectionId
    )

    const noOfSubsections = courseSectionData[currentSectionIndx].subSection.length

    const currentSubSectionIndx = 
    courseSectionData[currentSectionIndx].subSection.findIndex((data) => data?._id === subSectionId)

    
    //current subSection index !== last value of that subSection ---> means abe aage or be value hai subSection main
    if (currentSubSectionIndx !== noOfSubsections - 1) {

      //retrevie tha _id of next subSection w.r.t current subSection
      const nextSubSectionId =courseSectionData[currentSectionIndx].subSection[
          currentSubSectionIndx + 1
        ]?._id

      navigate( //move to that next subSection/video
        `/view-course/${courseId}/section/${sectionId}/sub-section/${nextSubSectionId}`
      )
    } else {
      //if we present on last value of that subSection -->mean current section ke subSection finish now move to Next section
      const nextSectionId = courseSectionData[currentSectionIndx + 1]?._id

      //find the 1st subSection of next Section
      const nextSubSectionId = courseSectionData[currentSectionIndx + 1].subSection[0]?._id
        
      navigate(//move to next video from next section
        `/view-course/${courseId}/section/${nextSectionId}/sub-section/${nextSubSectionId}`
      )
    }
  }


  // check if the lecture is the last video of the course
  const isLastVideo = () => {
    const currentSectionIndx = courseSectionData.findIndex(
      (data) => data._id === sectionId
    )

    //section Data se current section --> total subSection from current section
    const noOfSubsections = courseSectionData[currentSectionIndx]?.subSection.length

    const currentSubSectionIndx = courseSectionData[
      currentSectionIndx
    ].subSection.findIndex((data) => data._id === subSectionId)

    //currentSectionIndx === courseSectionData.length - 1 ==> present on last section in section array
    //currentSubSectionIndx === noOfSubsections - 1 ==> present on last subSection of current section
    if ( 
      currentSectionIndx === courseSectionData.length - 1 &&
      currentSubSectionIndx === noOfSubsections - 1
    ) {
      return true
    } else {
      return false
    }
  }


  // go to the previous video
  const goToPrevVideo = () => {
    // console.log(courseSectionData)

    const currentSectionIndx = courseSectionData.findIndex(
      (data) => data?._id === sectionId
    )

    const currentSubSectionIndx = courseSectionData[
      currentSectionIndx
    ].subSection.findIndex((data) => data?._id === subSectionId)

    if (currentSubSectionIndx !== 0) { 
      //same section, prev video
      const prevSubSectionId =
        courseSectionData[currentSectionIndx].subSection[
          currentSubSectionIndx - 1
        ]?._id
      navigate(
        `/view-course/${courseId}/section/${sectionId}/sub-section/${prevSubSectionId}`
      )
    } else {
      //diffrerent section,last video
      const prevSectionId = courseSectionData[currentSectionIndx - 1]?._id
      const prevSubSectionLength =
        courseSectionData[currentSectionIndx - 1].subSection.length
      const prevSubSectionId =
        courseSectionData[currentSectionIndx - 1].subSection[
          prevSubSectionLength - 1
        ]?._id
      navigate(
        `/view-course/${courseId}/section/${prevSectionId}/sub-section/${prevSubSectionId}`
      )
    }
  }


  const handleLectureCompletion = async () => {
    setLoading(true)
    const res = await markLectureAsComplete(
      { courseId: courseId, subsectionId: subSectionId },
      token
    )
    if (res) {
      dispatch(updateCompletedLectures(subSectionId))
    }
    setLoading(false)
  }



  return (
    <div className="flex flex-col gap-5 text-white">
      {!videoData ? (
        <img
          src={previewSource}
          alt="Preview"
          className="h-full w-full rounded-md object-cover"
        />
      ) : (
        <Player
          ref={playerRef}
          aspectratio="16:9"
          playsInline
          fluid="true"
          onEnded={() => setVideoEnded(true)}
          src={videoData?.videoUrl}
        >
          <BigPlayButton position="center" />

          {/* buttons Render When Video Ends */}
          {videoEnded && (
            <div
              style={{
                backgroundImage:
                  "linear-gradient(to top, rgb(0, 0, 0), rgba(0,0,0,0.7), rgba(0,0,0,0.5), rgba(0,0,0,0.1)",
              }}
              className="full absolute inset-0 z-[100] grid h-full place-content-center font-inter"
            >
              {/* mark button */}
              {!completedLectures?.includes(subSectionId) && (
                <IconBtn
                  disabled={loading}
                  onclick={() => handleLectureCompletion()}
                  text={!loading ? "Mark As Completed" : "Loading..."}
                  customClasses="text-xl max-w-max px-4 mx-auto"
                />
              )}

              {/* Rewatch button */}
              <IconBtn
                disabled={loading}
                onclick={() => {
                  if (playerRef?.current) {
                    // set the current time of the video to 0
                    playerRef?.current?.seek(0)
                    setVideoEnded(false)
                  }
                }}
                text="Rewatch"
                customClasses="text-xl max-w-max px-4 mx-auto mt-2"
              />

              {/* prev & next button */}
              <div className="mt-10 flex min-w-[250px] justify-center gap-x-4 text-xl">
                {!isFirstVideo() && ( //not 1st video --> show prev btn
                  <button
                    disabled={loading}
                    onClick={goToPrevVideo}
                    className="blackButton"
                  >
                    Prev
                  </button>
                )}

                {!isLastVideo() && (//not last video --> show next btn
                  <button
                    disabled={loading}
                    onClick={goToNextVideo}
                    className="blackButton"
                  >
                    Next
                  </button>
                )}
              </div>
            </div>
          )}
        </Player>
      )}

      <h1 className="mt-4 text-3xl font-semibold">{videoData?.title}</h1>
      <p className="pt-2 pb-6">{videoData?.description}</p>
    </div>
  )
}

export default VideoDetails;

