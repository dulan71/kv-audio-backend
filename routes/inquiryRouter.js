import express from "express";
import { addInquiry, deleteInquiries, getInquiries, updateInquiries } from "../controllers/inuiryController.js";

const InquiryRouter = express.Router();

InquiryRouter.post("/",addInquiry)
InquiryRouter.get("/",getInquiries)
InquiryRouter.delete("/:id",deleteInquiries)
InquiryRouter.put("/:id",updateInquiries)

export default InquiryRouter;