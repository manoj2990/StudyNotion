

import IconBtn from "./IconBtn";

export default function ConfirmationModal({ modalData }) {
  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="w-[90%] max-w-md rounded-lg bg-richblack-800 p-6">
        {/* Modal Heading */}
        <h3 className="text-lg font-semibold text-richblack-5">
          {modalData?.text1}
        </h3>
        {/* Modal Description */}
        <p className="mt-2 text-sm text-richblack-300">
          {modalData?.text2}
        </p>
        {/* Button Actions */}
        <div className="mt-4 flex justify-end gap-4">
          {/* Confirm Button */}
          <IconBtn
            onclick={modalData?.btn1Handler}
            text={modalData?.btn1Text}
            className="bg-pink-700 text-white hover:bg-pink-600"
          />
          {/* Cancel Button */}
          <button
            className="cursor-pointer rounded-md bg-gray-700 px-4 py-2 text-sm font-medium text-white hover:bg-gray-600"
            onClick={modalData?.btn2Handler}
          >
            {modalData?.btn2Text}
          </button>
        </div>
      </div>
    </div>
  );
}
