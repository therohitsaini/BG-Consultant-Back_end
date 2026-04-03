const express = require("express");
const { adminController, voucherController, getTransactionController, getUserConsultantController, getShopAllUserController, getShopAllConsultantController, updateUserConsultantController, appEnableAndDisableController, checkAppBillingController, voucherHandlerController, updatesVoucherController, getWithdrawalRequest, updateConsultantWidthrawalRequest, declineWithdrawalRequest, updateAdminPercentage } = require("../Controller/adminController");
const { bgVerifyToken } = require("../MiddleWare/ShopifyMiddleware/bgVerifyToken");
const adminRoute = express.Router();


adminRoute.get("/admin/:adminId", bgVerifyToken, adminController);
adminRoute.post("/admin/voucher/:adminId", voucherController);
adminRoute.get("/activity/transactions/:adminId" ,getTransactionController);
adminRoute.get("/user/consultant/:adminId", getUserConsultantController);
adminRoute.get("/shop/all-user/:adminId", getShopAllUserController);
adminRoute.get("/shop/all-consultant/:adminId", getShopAllConsultantController);
adminRoute.post("/update-wallet/:adminId", updateUserConsultantController);
adminRoute.post("/app-enable-and-disable/:adminId", appEnableAndDisableController);
adminRoute.get("/shop/billing-status/:adminId", checkAppBillingController)
adminRoute.delete("/delete/voucher/:shopId/:voucherId", voucherHandlerController)
adminRoute.put("/admin/voucher-updates/:shopId/:voucherId", updatesVoucherController)
adminRoute.get("/withdrawal-requests/:adminId", getWithdrawalRequest)
adminRoute.put("/update/widthrwal/req/:adminId", updateConsultantWidthrawalRequest)
adminRoute.put("/declin/widthrwal/req/:transactionId", declineWithdrawalRequest)
adminRoute.put("/admin/update-percentage/:adminId", updateAdminPercentage)

module.exports = { adminRoute };    