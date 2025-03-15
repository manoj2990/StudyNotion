import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import CountryCode from "../../../data/countrycode.json";
import { apiConnector } from "../../../services/apiConnector";
import { contactusEndpoint } from "../../../services/apis";

const ContactUsForm = () => {
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitSuccessful },
  } = useForm();

  const submitContactForm = async (data) => {
    
    try {
      setLoading(true);
      
      const res = { status: "ok" };
      
      setLoading(false);
    } catch (error) {
    
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset({
        email: "",
        firstname: "",
        lastname: "",
        message: "",
        phoneNo: "",
      });
    }
  }, [reset, isSubmitSuccessful]);

  return (
    <form
      className="flex flex-col gap-6 p-6 max-w-2xl mx-auto bg-richblack-900 rounded-lg shadow-lg"
      onSubmit={handleSubmit(submitContactForm)}
    >
      {/* Name Fields */}
      <div className="flex flex-col gap-4 lg:flex-row">
        <div className="flex flex-col gap-2 lg:w-[48%]">
          <label htmlFor="firstname" className="text-richblack-300">
            First Name
          </label>
          <input
            type="text"
            name="firstname"
            id="firstname"
            placeholder="Enter first name"
            className="w-full p-3 bg-richblack-800 text-white rounded-md outline-none border border-richblack-700 focus:border-blue-500"
            {...register("firstname", { required: true })}
          />
          {errors.firstname && (
            <span className="text-sm text-yellow-500">
              Please enter your name.
            </span>
          )}
        </div>
        <div className="flex flex-col gap-2 lg:w-[48%]">
          <label htmlFor="lastname" className="text-richblack-300">
            Last Name
          </label>
          <input
            type="text"
            name="lastname"
            id="lastname"
            placeholder="Enter last name"
            className="w-full p-3 bg-richblack-800 text-white rounded-md outline-none border border-richblack-700 focus:border-blue-500"
            {...register("lastname")}
          />
        </div>
      </div>

      {/* Email Address */}
      <div className="flex flex-col gap-2">
        <label htmlFor="email" className="text-richblack-300">
          Email Address
        </label>
        <input
          type="email"
          name="email"
          id="email"
          placeholder="Enter email address"
          className="w-full p-3 bg-richblack-800 text-white rounded-md outline-none border border-richblack-700 focus:border-blue-500"
          {...register("email", { required: true })}
        />
        {errors.email && (
          <span className="text-sm text-yellow-500">
            Please enter your Email address.
          </span>
        )}
      </div>

      {/* Phone Number */}
      <div className="flex flex-col gap-2">
        <label htmlFor="phonenumber" className="text-richblack-300">
          Phone Number
        </label>
        <div className="flex gap-3">
          <select
            className="w-[150px] p-3 bg-richblack-800 text-white rounded-md outline-none border border-richblack-700 focus:border-blue-500"
            defaultValue="+91"
            {...register("countrycode", { required: true })}
          >
            {CountryCode.map((ele, i) => (
              <option key={i} value={ele.code}>
                {ele.code} - {ele.country}
              </option>
            ))}
          </select>
          <input
            type="text"
            name="phonenumber"
            id="phonenumber"
            placeholder="1234567890"
            className="w-full p-3 bg-richblack-800 text-white rounded-md outline-none border border-richblack-700 focus:border-blue-500"
            {...register("phoneNo", {
              required: {
                value: true,
                message: "Please enter your Phone Number.",
              },
              maxLength: { value: 12, message: "Invalid Phone Number" },
              minLength: { value: 10, message: "Invalid Phone Number" },
            })}
          />
        </div>
        {errors.phoneNo && (
          <span className="text-sm text-yellow-500">
            {errors.phoneNo.message}
          </span>
        )}
      </div>

      {/* Message */}
      <div className="flex flex-col gap-2">
        <label htmlFor="message" className="text-richblack-300">
          Message
        </label>
        <textarea
          name="message"
          id="message"
          rows="5"
          placeholder="Enter your message here"
          className="w-full p-3 bg-richblack-800 text-white rounded-md outline-none border border-richblack-700 focus:border-blue-500"
          {...register("message", { required: true })}
        ></textarea>
        {errors.message && (
          <span className="text-sm text-yellow-500">
            Please enter your Message.
          </span>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className={`w-full py-3 rounded-md bg-blue-50 text-white font-semibold hover:bg-blue-100 transition-all ${
          loading && "opacity-50"
        }`}
      >
        {loading ? "Sending..." : "Send Message"}
      </button>
    </form>
  );
};

export default ContactUsForm;
