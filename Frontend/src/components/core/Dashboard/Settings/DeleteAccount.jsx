// import { FiTrash2 } from "react-icons/fi"
// import { useDispatch, useSelector } from "react-redux"
// import { useNavigate } from "react-router-dom"

// import { deleteProfile } from "../../../../services/operations/SettingsAPI"




// export default function DeleteAccount() {
//   const { token } = useSelector((state) => state.auth)
//   const dispatch = useDispatch()
//   const navigate = useNavigate()

//   async function handleDeleteAccount() {
//     try {
//       dispatch(deleteProfile(token, navigate))
//     } catch (error) {
//       console.log("ERROR MESSAGE - ", error.message)
//     }
//   }



//   return (
//     <>
//       <div className="my-10 flex flex-row gap-x-5 rounded-md border-[1px] border-pink-700 bg-pink-900 p-8 px-12">
//         <div className="flex aspect-square h-14 w-14 items-center justify-center rounded-full bg-pink-700">
//           <FiTrash2 className="text-3xl text-pink-200" />
//         </div>
//         <div className="flex flex-col space-y-2">
//           <h2 className="text-lg font-semibold text-richblack-5">
//             Delete Account
//           </h2>
//           <div className="w-3/5 text-pink-25">
//             <p>Would you like to delete account?</p>
//             <p>
//               This account may contain Paid Courses. Deleting your account is
//               permanent and will remove all the contain associated with it.
//             </p>
//           </div>
//           <button
//             type="button"
//             className="w-fit cursor-pointer italic text-pink-300"
//             onClick={handleDeleteAccount}
//           >
//             I want to delete my account.
//           </button>
//         </div>
//       </div>
//     </>
//   )
// }

import { FiTrash2 } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

import { deleteProfile } from "../../../../services/operations/SettingsAPI";
import toast from "react-hot-toast";

export default function DeleteAccount() {
  const { token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false); // State to toggle the modal

  async function handleDeleteAccount() {
    try {
      dispatch(deleteProfile(token, navigate));
    } catch (error) {
      toast.error("ERROR MESSAGE")
      
    }
  }

  return (
    <>
      <div className="my-10 flex flex-row gap-x-5 rounded-md border-[1px] border-pink-700 bg-pink-900 p-8 px-12">
        <div className="flex aspect-square h-14 w-14 items-center justify-center rounded-full bg-pink-700">
          <FiTrash2 className="text-3xl text-pink-200" />
        </div>
        <div className="flex flex-col space-y-2">
          <h2 className="text-lg font-semibold text-richblack-5">
            Delete Account
          </h2>
          <div className="w-3/5 text-pink-25">
            <p>Would you like to delete your account?</p>
            <p>
              This account may contain Paid Courses. Deleting your account is
              permanent and will remove all the content associated with it.
            </p>
          </div>
          <button
            type="button"
            className="w-fit cursor-pointer italic text-pink-300"
            onClick={() => setShowModal(true)} // Open modal
          >
            I want to delete my account.
          </button>
        </div>
      </div>

      {/* Modal for Confirmation */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-[90%] max-w-md rounded-lg bg-richblack-800 p-6">
            <h3 className="text-lg font-semibold text-richblack-5">
              Are you sure you want to delete your account?
            </h3>
            <p className="mt-2 text-sm text-richblack-300">
              Deleting your account is permanent and cannot be undone.
            </p>
            <div className="mt-4 flex justify-end gap-4">
              {/* Cancel Button */}
              <button
                onClick={() => setShowModal(false)} // Close modal
                className="rounded-md bg-gray-700 px-4 py-2 text-sm font-medium text-white hover:bg-gray-600"
              >
                No, Cancel
              </button>
              {/* Confirm Button */}
              <button
                onClick={handleDeleteAccount} // Call delete function
                className="rounded-md bg-pink-700 px-4 py-2 text-sm font-medium text-white hover:bg-pink-600"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
