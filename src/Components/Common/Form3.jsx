import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { BASE_URL } from "../../config";
import { useLocation, useNavigate } from "react-router-dom";
import CustomDatePicker from "./CustomDatePicker";
import { FaTrash } from "react-icons/fa";
import AddIcon from "@mui/icons-material/Add";

function Form3({
  selectedHeadName,
  selectedHead,
  selectedSubHeadName,
  selectedSubHead,
  selectedSubReceiptName,
  selectedSubReceipt,
  selectedSubSubReceiptName,
  selectedSubSubReceipt,
}) {
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
            const [netAmount, setNetAmount] = useState(0);
                const [fields, setFields] = useState({
                  receiptAmount: [
                    {
                      totalAmount: 0,
                      paymentDetails: [
                        {
                          modeOfPayment: "",
                          chequeUtrNumber: "",
                          amount: "",
                        },
                        {
                          modeOfPayment: "",
                          chequeUtrNumber: "",
                          amount: "",
                        },
                      ],
                    },
                  ],
                });
  const [formData, setFormData] = useState({
    receiptDescription: "",
    billing: "",
    receiptDate: "",
    receiptAmount: [
      {
        totalAmount: "",
        paymentDetails: [
          {
            modeOfPayment: "",
            chequeUtrNumber: "",
            amount: "",
          },
          {
            modeOfPayment: "",
            chequeUtrNumber: "",
            amount: "",
          },
        ],
      },
    ],
    chequeUtrNumber: "",
    modeOfPayment:"",
    payerName: "",
    payerAddress: "",
    otherInfo: "",
  });

  useEffect(() => {
    setFormData((prevData) => ({
      ...prevData,
      receiptDescription: "",
      billing: "",
      receiptDate: "",
      receiptAmount: [
        {
          totalAmount: 0,
          paymentDetails: [
            { modeOfPayment: "", chequeUtrNumber: "", amount: 0 },
          ],
        },
      ],
      chequeUtrNumber: "",
      modeOfPayment:"",
      payerName: "",
      payerAddress: "",
      otherInfo: "",
    }));
  }, [selectedHead, selectedSubHead, selectedSubReceipt, selectedSubSubReceipt]);

     const location = useLocation();
      const { rowData } = location.state || {};
    
      useEffect(() => {
        if (!rowData) {
          return;
        }
      
        setFormData((prevData) => {
          const updatedData = {
            ...prevData,
            billing:rowData.billing || "",
            payerPhoneNumber: rowData.payerPhoneNumber || "",
            receiptDate: rowData.receiptDate || "",
            receiptDescription: rowData.description || "",
            netAmount: rowData.finalAmount
              ? rowData.finalAmount.replace(/[₹,]/g, "").trim()
              : "",
            otherInfo: rowData.otherInfo || "",
            payerbankName: rowData.payerbankName || "",
            payerName: rowData.payerName || "",
            payerifscCode: rowData.payerifscCode || "",
            payerAddress: rowData.payerAddress || "",
            payeraccountNumber: rowData.payeraccountNumber || "",
            payerconfirmAccountNumber: rowData.payerconfirmAccountNumber || "",
          };
          return updatedData;
        });
      
        if (!rowData.receiptAmount || !Array.isArray(rowData.receiptAmount)) {
          return;
        }
      
        setFields((prevFields) => {
          const updatedFields = {
            ...prevFields,
            receiptAmount: rowData.receiptAmount.map((item, idx) => {
              return {
                totalAmount: (item.totalAmount?.toString() || "₹ 0.00")
                  .replace(/[₹,]/g, "")
                  .trim(), 
                paymentDetails: item.paymentDetails?.map((detail, detailIdx) => {
                  const amount = detail.amount?.toString() || "₹ 0.00";
                  return {
                    modeOfPayment: detail.modeOfPayment || "",
                    chequeUtrNumber: detail.chequeUtrNumber || "",
                    amount: parseFloat(amount.replace(/[₹,]/g, "").trim()) || 0,
                  };
                }) || [],
              };
            }),
          };
          return updatedFields;
        });
      }, [rowData]);

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      netAmount: netAmount.toFixed(2),
    }));
  }, [netAmount]);

  useEffect(() => {
    setNetAmount(calculateNetAmount());
  }, [fields]);

  const calculateTotal = (fieldName) => {
    if (rowData) {
      if (!fields[fieldName]) return 0;
      return fields[fieldName].reduce((sum, field) => {
        let fieldAmount = parseFloat(field.amount) || 0;
        if (fieldName === "receiptAmount" && field.paymentDetails) {
          fieldAmount += field.paymentDetails.reduce((subSum, item) => {
            return subSum + (parseFloat(item.amount) || 0);
          }, 0);
        }

        return sum + fieldAmount;
      }, 0);
    } else {
      const fieldData = fields[fieldName] || []; 
      return fieldData.reduce((sum, field) => {
        let amount = parseFloat(field.amount) || 0;
        return sum + amount;
      }, 0);
    }
  };

  const handleInputChange = (fieldName, index, event) => {
    const { name, value } = event.target;
    let fieldErrors = { ...errors };
    const errorKey = `${fieldName}[${index}].${name}`;
    if (name === "chequeUtrNumber") {
      if (!/^[a-zA-Z0-9]*$/.test(value)) {
        fieldErrors[errorKey] = "Only alphanumeric characters are allowed.";
      } else {
        delete fieldErrors[errorKey]; 
      }
    }

    if (name === "amount") {
      if (!/^\d+(\.\d{0,2})?$/.test(value)) {
        fieldErrors[errorKey] =
          "Please enter a valid amount (up to two decimal places).";
      } else {
        delete fieldErrors[errorKey]; 
      }
    }

    if (rowData) {
      const updatedFields = { ...fields };
      if (fieldName === "receiptAmount") {
        if (!updatedFields.receiptAmount[0].paymentDetails) {
          updatedFields.receiptAmount[0].paymentDetails = [];
        }

        updatedFields.receiptAmount[0].paymentDetails[index] = {
          ...updatedFields.receiptAmount[0].paymentDetails[index],
          [name]: value,
        };
      } else {
        updatedFields[fieldName] = [...updatedFields[fieldName]];
        updatedFields[fieldName][index] = {
          ...updatedFields[fieldName][index],
          [name]: value,
        };
      }

      setFields((prevFields) => {
        const newFields = { ...prevFields, ...updatedFields };
        setErrors(fieldErrors);
        setNetAmount(calculateNetAmount());
        return newFields;
      });
    } else {
      const updatedFields = [...fields[fieldName]];
      updatedFields[index][name] = value;
      setFields((prevFields) => {
        const newFields = { ...prevFields, [fieldName]: updatedFields };
        setErrors(fieldErrors);
        return newFields;
      });

      setNetAmount(calculateNetAmount());
    }
  };

  const calculateNetAmount = () => {
    return calculateTotal("receiptAmount");
  };

  const handleKeyPress = (event, fieldName, index) => {
    const { name } = event.target;
    let fieldErrors = { ...errors };

    if (name === "chequeUtrNumber") {
      const regex = /^[a-zA-Z0-9]$/; 
      if (!regex.test(event.key)) {
        event.preventDefault();
        fieldErrors[`${fieldName}[${index}].chequeUtrNumber`] =
          "Only alphanumeric characters are allowed.";
        setErrors(fieldErrors);
      }
    }

    if (name === "amount") {
      const regex = /[0-9\.]/;
      if (!regex.test(event.key)) {
        event.preventDefault();
        fieldErrors[`${fieldName}[${index}].amount`] =
          "Please enter a valid amount (up to two decimal places).";
        setErrors(fieldErrors);
      }
      if (event.key === "." && event.target.value.includes(".")) {
        event.preventDefault();
        fieldErrors[`${fieldName}[${index}].amount`] =
          "Amount can only have one decimal point.";
        setErrors(fieldErrors);
      }
    }
  };

  const handleAddMore = (fieldName) => {
    setFields((prevFields) => {
      const updatedFields = { ...prevFields };

      if (rowData) {
        if (fieldName === "receiptAmount") {
          updatedFields.receiptAmount = prevFields.receiptAmount.map(
            (advance, index) =>
              index === 0
                ? {
                    ...advance,
                    paymentDetails: [...advance.paymentDetails, { amount: "" }],
                  }
                : advance,
          );
        } else {
          updatedFields[fieldName] = [...prevFields[fieldName], { amount: "" }];
        }
      } else {
        updatedFields[fieldName] = [...prevFields[fieldName], { amount: "" }];
      }
      return updatedFields;
    });
    setTimeout(() => {
      setFields((prevFields) => {
        const total = Object.keys(prevFields).reduce((sum, key) => {
          return (
            sum +
            prevFields[key].reduce((fieldSum, field) => {
              const amount = parseFloat(field.amount) || 0;
              return fieldSum + amount;
            }, 0)
          );
        }, 0);

        setNetAmount(total);
        return prevFields;
      });
    }, 0);
  };

  const handleDelete = (fieldName, index) => {
    setFields((prevFields) => {
      let updatedFields = { ...prevFields };

      if (!rowData) {
        const updatedArray = [...updatedFields[fieldName]];
        updatedArray.splice(index, 1);
        updatedFields[fieldName] = updatedArray;
      } else {
        if (updatedFields[fieldName]?.[0]?.paymentDetails) {
          const updatedPaymentDetails = [
            ...updatedFields[fieldName][0].paymentDetails,
          ];
          updatedPaymentDetails.splice(index, 1);
          updatedFields[fieldName] = [
            {
              ...updatedFields[fieldName][0],
              paymentDetails: updatedPaymentDetails,
            },
          ];
        } else if (updatedFields[fieldName]) {
          const updatedArray = [...updatedFields[fieldName]];
          updatedArray.splice(index, 1);
          updatedFields[fieldName] = updatedArray;
        }
      }
      const total = Object.keys(updatedFields).reduce((sum, key) => {
        return (
          sum +
          (updatedFields[key]?.reduce((fieldSum, field) => {
            const amount = parseFloat(field.amount) || 0;
            return fieldSum + amount;
          }, 0) || 0)
        );
      }, 0);
      setNetAmount(total);
      return updatedFields;
    });
  };

  const handleInputValidation = (e) => {
    const { name, value } = e.target;
    let error = "";
    let isValid = true;
    let validValue = value;

    if (
      name === "chargeReason" ||
      name === "billing" ||
      name === "encrumbrance" ||
      name === "payerName"
    ) {
      if (!/^[a-zA-Z\s]*$/.test(value)) {
        error = "Only alphabets and spaces are allowed";
        validValue = validValue.replace(/[^a-zA-Z\s]/g, ""); 
        isValid = false;
      }
    }
    else if (
      name === "chequeRTGSorNEFT" ||
      name === "payerAddress"
    ) {
      if (!/^[a-zA-Z0-9\s]*$/.test(value)) {
        error = "Only alphanumeric characters and spaces are allowed";
        validValue = validValue.replace(/[^a-zA-Z0-9\s]/g, ""); 
        isValid = false;
      }
    }
    else if (name === "receiptAmount") {
      if (!/^\d*\.?\d{0,2}$/.test(value) || /^0/.test(value)) {
        validValue = validValue.replace(/[^0-9.]/g, ""); 
        validValue = validValue.replace(/^0+/, ""); 
        validValue =
          validValue.split(".").length > 2
            ? validValue.slice(0, validValue.lastIndexOf("."))
            : validValue;

        const parts = validValue.split(".");
        if (parts.length === 2 && parts[1].length > 2) {
          validValue = `${parts[0]}.${parts[1].slice(0, 2)}`; 
        }

        error =
          validValue === ""
            ? "This field cannot start with 0"
            : "Only numbers and up to two decimal places are allowed";
        isValid = false;
      }
    }
    else if (name === "receiptDate") {
      if (value === "") {
        error = "Receipt date is required";
        isValid = false;
      }
    }
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: error,
    }));
    if (isValid) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: validValue,
      }));
    } else {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: validValue,
      }));
    }
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;

    setIsSubmitting(true);
    const token = Cookies.get("token");
    if (!token) {
      throw new Error("No token found");
    }

    const newErrors = {};
     if (!formData.netAmount || isNaN(formData.netAmount) || formData.netAmount <= 0) {
      newErrors.netAmount = "Amount is required and must be a positive number";
    }

    if (!formData.receiptDate || (typeof formData.receiptDate === "string" && formData.receiptDate.trim() === "")) {
      newErrors.receiptDate = "Date is required";
    } else if (Object.prototype.toString.call(formData.date) === "[object Date]" && isNaN(formData.date.getTime())) {
      newErrors.date = "Invalid date provided";
    }
    

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      console.error("Form validation failed:", newErrors);
      setIsSubmitting(false);
      return;
    }

    const dataToSend = {
      hierarchyData: {
        head: {
          id: selectedHead,
          headName: selectedHeadName,
          subHeads: [
            {
              subHeadName: selectedSubHeadName,
              subHeadId: selectedSubHead,
              subHeads: [
                {
                  subHeadName: selectedSubReceiptName,
                  subHeadId: selectedSubReceipt,
                  subHeads:[
                    {
                      subHeadName: selectedSubSubReceiptName,
                      subHeadId: selectedSubSubReceipt,
                    }
                  ]
                },
              ],
            },
          ],
        },
        additionalFields: {
          subHeadId: selectedSubHead,
          parentId: selectedHead,
          parentModel: "HeadMaster",
          hierarchySequence:[selectedHead, selectedSubHead, selectedSubReceipt,selectedSubSubReceipt],
          receiptAmount: rowData
          ? fields.receiptAmount.map((field) => ({
              totalAmount:
                calculateTotal("receiptAmount").toFixed(2) || "0.00",
              paymentDetails: field.paymentDetails
                ? field.paymentDetails.map((item) => ({
                    modeOfPayment: item?.modeOfPayment || "",
                    chequeUtrNumber: item?.chequeUtrNumber || "",
                    amount: item?.amount ? parseFloat(item.amount) : 0,
                  }))
                : [],
            }))
          : [
              {
                totalAmount:
                  calculateTotal("receiptAmount").toFixed(2) || "0.00",
                paymentDetails: fields.receiptAmount.map((field) => ({
                  modeOfPayment: field?.modeOfPayment || "",
                  chequeUtrNumber: field?.chequeUtrNumber || "",
                  amount: field?.amount ? parseFloat(field.amount) : 0,
                })),
              },
            ],
          billing: formData.billing,
          receiptDate: formData.receiptDate,
          payerName: formData.payerName,
          payerAddress: formData.payerAddress,
          chequeRTGSorNEFT: formData.chequeRTGSorNEFT,
          description: formData.receiptDescription,
          otherInfo: formData.otherInfo,
        },
      },
    };

    try {
      console.log("dataToSend", dataToSend);
      let response;
      if (rowData) {
        response = await axios.post(
          `${BASE_URL}/revenue/update-revenue-form/${rowData._id}`,
          dataToSend,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        response = await axios.post(
          `${BASE_URL}/revenue/save-revenue-field`,
          dataToSend,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
      console.log("Response:", response);
      setFormData({
        receiptDescription: "",
        receiptDate: "",
        receiptAmount: [
          {
            totalAmount: 0,
            paymentDetails: [
              { modeOfPayment: "", chequeUtrNumber: "", amount: 0 },
            ],
          },
        ],
        chequeUtrNumber: "",
        modeOfPayment: "",
        payerName: "",
        payerAddress: "",
      });
    
      setErrors({});
      setIsSubmitting(false);
      navigate("/departmentRevenue");
    } catch (error) {
      console.error("Error submitting form:", error.message || error);
      setIsSubmitting(false);
    }
    setIsSubmitting(false);
  };

  const handleFocus = (e) => {
    const { name } = e.target;
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));
  };

  const handleDateChange = (date, fieldName) => {
    const today = new Date();
    let error = "";
    if (date && date > today) {
      error = "Date cannot be in the future";
    }
    setFormData((prevData) => ({
      ...prevData,
      [fieldName]: date,
    }));
  
    setErrors((prevErrors) => ({
      ...prevErrors,
      [fieldName]: error,
    }));
  };

  return (
    <div className="bg-gray-100 mx-auto max-w-6xl bg-white py-20 px-12 lg:px-24 shadow-xl mt-10 rounded-xl">
      <form>
        <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 flex flex-col">
          <div className="-mx-3 md:flex mb-6">
            <div className="md:w-1/2 px-3 mb-6 md:mb-0">
              <label className="tracking-wide text-black text-xs font-bold mb-2">
                Receipt Description (Reason for Fees/Charges)
              </label>
              <input
                className="w-full bg-gray-200 text-black border border-gray-200 rounded py-3 px-4 mb-3"
                type="text"
                placeholder="Receipt Description (Reason for Fees/Charges)"
                name="receiptDescription"
                value={formData.receiptDescription}
                onChange={handleInputValidation}
                  onBlur={handleInputValidation}
                onFocus={handleFocus}
                maxLength={255}
              />
              {errors.receiptDescription && (
                <p className="text-red-500 text-xs italic">
                  {errors.receiptDescription}
                </p>
              )}
            </div>
            <div className="md:w-1/2 px-3 mb-6 md:mb-0">
              <label className="tracking-wide text-black text-xs font-bold mb-2">
                Fees/Charges charged to (Name)
              </label>
              <input
                name="billing"
                value={formData.billing}
                onChange={handleInputValidation}
                  onBlur={handleInputValidation}
                onFocus={handleFocus}
                maxLength={20}
                className="w-full bg-gray-200 text-black border border-gray-200 rounded py-3 px-4 mb-3"
                type="text"
                placeholder="Fees/Charges charged to (Name)"
              />
              {errors.billing && (
                <p className="text-red-500 text-xs italic">{errors.billing}</p>
              )}
            </div>
          </div>
          <div className="-mx-3 md:flex mb-6">
          <div className="flex flex-col md:w-1/2 px-3">
              <label className="tracking-wide text-black text-xs font-bold mb-2">
              Receipt Date
              </label>
              <CustomDatePicker
                selectedDate={formData.receiptDate}
                onChangeDate={(date) => handleDateChange(date, "receiptDate")}
                onBlur={handleInputValidation}
                onFocus={handleFocus}
                errors={errors.receiptDate}
                 placeholder=" Receipt Date"
              />
            </div>
         
          </div>
          <div
            className="-mx-3 mb-6 p-5"
            style={{ border: "1px solid #f3f3f3", borderRadius: "10px" }}
          >
            <div className="md:w-9/12 px-3 mb-6 md:mb-0 flex gap-5 items-center">
              <label
                className="tracking-wide text-black text-xs font-bold mb-2"
                style={{ marginRight: "7.5%" }}
              >
                Receipt Amount (₹)
              </label>
              <input
                name="receiptAmount"
                value={calculateTotal("receiptAmount").toFixed(2)}
                readOnly
                className={`bg-gray-200 text-black border ${
                  errors.receiptAmount ? "border-red-500" : "border-gray-200"
                } rounded py-3 px-4 mb-3`}
                type="text"
                placeholder="Receipt Amount (₹)"
                style={{ width: "49%" }}
              />
              {errors.receiptAmount && (
                <p className="text-red-500 text-xs italic">{errors.receiptAmount}</p>
              )}
            </div>
            <div>
              {rowData && fields.receiptAmount?.[0]?.paymentDetails
                ? fields.receiptAmount[0].paymentDetails.map((field, index) => (
                    <div className="flex items-center mb-4" key={index}>
                      <div className="md:w-4/12 px-3">
                        <label className="tracking-wide text-black text-xs font-bold mb-2">
                          Mode of Payment
                        </label>
                        <select
                          className={`w-full bg-gray-200 text-black border ${
                            errors.modeOfPayment
                              ? "border-red-500"
                              : "border-gray-200"
                          } rounded py-3 px-4 mb-3`}
                          name="modeOfPayment"
                          value={field.modeOfPayment || ""}
                          onChange={(e) =>
                            handleInputChange("receiptAmount", index, e)
                          }
                        >
                          <option value="" disabled hidden>
                            Select Mode of Payment
                          </option>
                          <option value="CHEQUE">CHEQUE</option>
                          <option value="RTGS">RTGS</option>
                          <option value="NEFT">NEFT</option>
                        </select>
                        {errors.modeOfPayment && (
                          <p className="text-red-500 text-xs italic">
                            {errors.modeOfPayment}
                          </p>
                        )}
                      </div>

                      <div className="md:w-4/12 px-3">
                        <label className="tracking-wide text-black text-xs font-bold mb-2">
                          CHEQUE/RTGS/NEFT details
                        </label>
                        <input
                          name="chequeUtrNumber"
                          value={field.chequeUtrNumber || ""}
                          onChange={(e) =>
                            handleInputChange("receiptAmount", index, e)
                          }
                          onKeyPress={(e) =>
                            handleKeyPress(e, "receiptAmount", index)
                          }
                          maxLength={22}
                          className={`w-full bg-gray-200 text-black border ${
                            errors[`receiptAmount[${index}].chequeUtrNumber`]
                              ? "border-red-500"
                              : "border-gray-200"
                          } rounded py-3 px-4 mb-3`}
                          type="text"
                          placeholder="Cheque Number/UTR Number"
                        />
                        {errors[`receiptAmount[${index}].chequeUtrNumber`] && (
                          <p className="text-red-500 text-xs italic">
                            {errors[`receiptAmount[${index}].chequeUtrNumber`]}
                          </p>
                        )}
                      </div>

                      <div className="md:w-4/12 px-3">
                        <label className="tracking-wide text-black text-xs font-bold mb-2">
                          Amount (₹)
                        </label>
                        <input
                          name="amount"
                          value={field.amount || ""}
                          onChange={(e) =>
                            handleInputChange("receiptAmount", index, e)
                          }
                          onKeyPress={(e) =>
                            handleKeyPress(e, "receiptAmount", index)
                          }
                          maxLength={14}
                          className={`w-full bg-gray-200 text-black border ${
                            errors[`receiptAmount[${index}].amount`]
                              ? "border-red-500"
                              : "border-gray-200"
                          } rounded py-3 px-4 mb-3`}
                          type="text"
                          placeholder="Amount (₹)"
                        />
                        {errors[`receiptAmount[${index}].amount`] && (
                          <p className="text-red-500 text-xs italic">
                            {errors[`receiptAmount[${index}].amount`]}
                          </p>
                        )}
                      </div>

                      {fields.receiptAmount?.[0]?.paymentDetails?.length > 1 && (
                        <button
                          type="button"
                          className="text-red-500 ml-3"
                          onClick={() => handleDelete("receiptAmount", index)}
                        >
                          <FaTrash />
                        </button>
                      )}
                    </div>
                  ))
                : fields.receiptAmount.map((field, index) => (
                    <div className="flex items-center mb-4" key={index}>
                      <div className="md:w-4/12 px-3">
                        <label className="tracking-wide text-black text-xs font-bold mb-2">
                          Mode of Payment
                        </label>
                        <select
                          className={`w-full bg-gray-200 text-black border ${
                            errors.modeOfPayment
                              ? "border-red-500"
                              : "border-gray-200"
                          } rounded py-3 px-4 mb-3`}
                          name="modeOfPayment"
                          value={field.modeOfPayment || ""}
                          onChange={(e) =>
                            handleInputChange("receiptAmount", index, e)
                          }
                        >
                          <option value="" disabled hidden>
                            Select Mode of Payment
                          </option>
                          <option value="CHEQUE">CHEQUE</option>
                          <option value="RTGS">RTGS</option>
                          <option value="NEFT">NEFT</option>
                        </select>
                        {errors.modeOfPayment && (
                          <p className="text-red-500 text-xs italic">
                            {errors.modeOfPayment}
                          </p>
                        )}
                      </div>

                      <div className="md:w-4/12 px-3">
                        <label className="tracking-wide text-black text-xs font-bold mb-2">
                          CHEQUE/RTGS/NEFT details
                        </label>
                        <input
                          name="chequeUtrNumber"
                          value={field.chequeUtrNumber || ""}
                          onChange={(e) =>
                            handleInputChange("receiptAmount", index, e)
                          }
                          onKeyPress={(e) =>
                            handleKeyPress(e, "receiptAmount", index)
                          }
                          maxLength={22}
                          className={`w-full bg-gray-200 text-black border ${
                            errors[`receiptAmount[${index}].chequeUtrNumber`]
                              ? "border-red-500"
                              : "border-gray-200"
                          } rounded py-3 px-4 mb-3`}
                          type="text"
                          placeholder="Cheque Number/UTR Number"
                        />
                        {errors[`receiptAmount[${index}].chequeUtrNumber`] && (
                          <p className="text-red-500 text-xs italic">
                            {errors[`receiptAmount[${index}].chequeUtrNumber`]}
                          </p>
                        )}
                      </div>

                      <div className="md:w-4/12 px-3">
                        <label className="tracking-wide text-black text-xs font-bold mb-2">
                          Amount (₹)
                        </label>
                        <input
                          name="amount"
                          value={field.amount || ""}
                          onChange={(e) =>
                            handleInputChange("receiptAmount", index, e)
                          }
                          onKeyPress={(e) =>
                            handleKeyPress(e, "receiptAmount", index)
                          }
                          maxLength={14}
                          className={`w-full bg-gray-200 text-black border ${
                            errors[`receiptAmount[${index}].amount`]
                              ? "border-red-500"
                              : "border-gray-200"
                          } rounded py-3 px-4 mb-3`}
                          type="text"
                          placeholder="Amount (₹)"
                        />
                        {errors[`receiptAmount[${index}].amount`] && (
                          <p className="text-red-500 text-xs italic">
                            {errors[`receiptAmount[${index}].amount`]}
                          </p>
                        )}
                      </div>

                      {fields.receiptAmount.length > 1 && (
                        <button
                          type="button"
                          className="text-red-500 ml-3"
                          onClick={() => handleDelete("receiptAmount", index)}
                        >
                          <FaTrash />
                        </button>
                      )}
                    </div>
                  ))}

              <button
                type="button"
                onClick={() => handleAddMore("receiptAmount")}
                className="text-blue-500 font-bold py-2 px-4 rounded"
              >
                <AddIcon
                  fontSize="small"
                  style={{ color: "#0000ff", marginTop: "-4px" }}
                />
                Add More
              </button>
            </div>
          </div>
          <div className="-mx-3 md:flex mb-6">
            <div className="md:w-1/2 px-3">
              <label className="tracking-wide text-black text-xs font-bold mb-2">
                Amount (₹)
              </label>
              <input
                name="netAmount"
                value={netAmount.toFixed(2)} 
                readOnly 
                className={`w-full bg-gray-200 text-black border ${
                  errors.netAmount ? "border-red-500" : "border-gray-200"
                } rounded py-3 px-4 mb-3`}
                type="text"
                placeholder="Amount (₹)"
              />

              {errors.netAmount && (
                <p className="text-red-500 text-xs italic">
                  {errors.netAmount}
                </p>
              )}
            </div>
            
            <div className="md:w-1/2 px-3 mb-6 md:mb-0">
              <label className="tracking-wide text-black text-xs font-bold mb-2">
                Payer's Name
              </label>
              <input
                name="payerName"
                value={formData.payerName}
                onChange={handleInputValidation}
                  onBlur={handleInputValidation}
                onFocus={handleFocus}
                maxLength={45}
                className="w-full bg-gray-200 text-black border border-gray-200 rounded py-3 px-4 mb-3"
                type="text"
                placeholder="Payer's Name"
              />
              {errors.payerName && (
                <p className="text-red-500 text-xs italic">
                  {errors.payerName}
                </p>
              )}
            </div>
          </div>
          <div className="-mx-3 md:flex mb-6">
            <div className="md:w-1/2 px-3">
              <label className="tracking-wide text-black text-xs font-bold mb-2">
                Payer's Address
              </label>
              <input
                name="payerAddress"
                value={formData.payerAddress}
                onChange={handleInputValidation}
                  onBlur={handleInputValidation}
                onFocus={handleFocus}
                maxLength={100}
                className="w-full bg-gray-200 text-black border border-gray-200 rounded py-3 px-4 mb-3"
                type="text"
                placeholder="Payer's Address"
              />
              {errors.payerAddress && (
                <p className="text-red-500 text-xs italic">
                  {errors.payerAddress}
                </p>
              )}
            </div>
            <div className="md:w-1/2 px-3">
              <label className="tracking-wide text-black text-xs font-bold mb-2">
                Remarks
              </label>
              <input
                name="otherInfo"
                value={formData.otherInfo}
                onChange={handleInputValidation}
                  onBlur={handleInputValidation}
                onFocus={handleFocus}
                maxLength={255}
                className="w-full bg-gray-200 text-black border border-gray-200 rounded py-3 px-4 mb-3"
                type="text"
                placeholder="Remarks"
              />
              {errors.otherInfo && (
                <p className="text-red-500 text-xs italic">
                  {errors.otherInfo}
                </p>
              )}
            </div>
          </div>
          <div className="-mx-3 md:flex mt-2">
            <div className="md:w-full px-3">
            <button
                className="md:w-full bg-gray-900 text-white font-bold py-2 px-4 border-b-4 hover:border-b-2 border-gray-500 hover:border-gray-100 rounded-full"
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Add Amount"}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default Form3;
