const express = require("express");
const passport = require("passport");
const userControllers = require("../controllers/userControllers");

const router = express.Router();

router.post("/register", userControllers.register);
router.post("/login", userControllers.login);
router.patch("/wishlist/add", passport.authenticate("jwt", { session: false }), userControllers.addToWishlist);
router.patch("/wishlist/remove", passport.authenticate("jwt", { session: false }), userControllers.removeFromWishlist);
router.patch("/cart/add", passport.authenticate("jwt", { session: false }), userControllers.addToCart);
router.patch("/cart/remove", passport.authenticate("jwt", { session: false }), userControllers.RemoveFromCart);
router.patch("/me/password", passport.authenticate("jwt", { session: false }), userControllers.updateUserPassword);
router.get("/me", passport.authenticate("jwt", { session: false }), userControllers.getUserProfile);
router.patch("/me", passport.authenticate("jwt", { session: false }), userControllers.updateUserProfile);
router.delete("/me", passport.authenticate("jwt", { session: false }), userControllers.deleteUserProfile);

module.exports = router;
